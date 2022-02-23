const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, './.env')
})
const fs = require('fs-extra')
const config = require('./config')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { sendNotify } = require('./sendNotify')

const { HILINK, HLINK_TORRENT_DIR_WHITE_LIST, HLINK_INPUT_DIR, HILINK_OUTPUT_DIR } = config
const torrentHashCacheJSONPath = path.join(__dirname, './torrentHash.json')

const [torrentName, torrentId, torrentDir, torrentHash] = (process.env.TORRENT_INFO || "").split(';')
const text = "transmission下载完成通知"
let desp = `种子名称: ${torrentName}\n种子ID: ${torrentId}\n种子存放目录: ${torrentDir}\n种子hash值: ${torrentHash}\n`

async function init() {
  console.log(`开始检测种子${torrentName}是否已下载...`)
  const isDowload = await checkTorrentIsDownload()
  if (isDowload) {
    console.log(`种子名称: ${torrentName}已存在, 跳过硬链接以及通知`)
  } else {
    console.log(`开始检测种子${torrentName}是否可以进行硬链接...`)
    const canLink = checkTorrentHlink()
    if (canLink) {
      torrentHlink()
    }
    console.log(`发送通知`)
    sendNotify(text, desp)
  }
}

function checkTorrentHlink() {
  const checkHlink = [{
    fn: () => HILINK,
    desp: `种子Hlink: 未启用, 已跳过`
  }, {
    fn: () => HLINK_TORRENT_DIR_WHITE_LIST.some(key => {
      return torrentDir.indexOf(key) > -1
    }),
    desp: `种子Hlink: 当前种子目录${torrentDir}无白名单中关键字, 跳过硬链接`
  }, {
    fn: () => torrentDir.indexOf(HLINK_INPUT_DIR) > -1,
    desp: `种子Hlink: 当前种子目录${torrentDir}不在${HLINK_INPUT_DIR}中, 跳过硬链接`
  }, {
    fn: () => {
      try {
        const stat = fs.statSync(`${torrentDir}/${torrentName}`)
        const isDir = stat.isDirectory()
        return isDir
      } catch (error) {
        return false
      }
    },
    desp: `种子Hlink: 当前种子目录${torrentDir}/${torrentName}不是文件夹, 跳过硬链接`
  }]
  const canHlink = checkHlink.every(item => {
    const checkRes = item.fn()
    if (!checkRes) {
      desp += item.desp
      console.log(item.desp)
    }
    return checkRes
  })
  return canHlink
}

async function torrentHlink() {
  try {
    const realHlinkOutPutDir = `${HILINK_OUTPUT_DIR}/${torrentDir.replace(HLINK_INPUT_DIR, '')}`.replace(/\/+/g, '/')
    const commond = `hlink ${torrentDir}/${torrentName} ${realHlinkOutPutDir}/${torrentName}`
    console.log(`hlink执行命令: ${commond}`)
    const { stdout, stderr } = await exec(commond)
    if (stdout) {
      console.log('hlink stdout:', stdout)
      try {
        const logs = stdout.split('\n').filter(log => log).map(log => log.replace(/\[HLINK \w+\]\:/, '').trim())
        desp += `种子Hlink: \n${logs.slice(-5).join('\n')}`
      } catch (error) {
        desp += `种子Hlink: \n${stdout}`
      }
    } else if (stderr) {
      console.error('hlink stderr:', stderr)
      desp += `种子Hlink:\n ${stderr}`
    }
  } catch (error) {
    desp += `种子Hlink: Error ${error}`
    console.log(`种子Hlink: Error ${error}`)
  }
}

async function checkTorrentIsDownload() {
  try {
    await fs.ensureFile(torrentHashCacheJSONPath)
    let torrentHashCacheJSON = await fs.readJSON(torrentHashCacheJSONPath, { throws: false })
    if ((torrentHashCacheJSON && !torrentHashCacheJSON.includes(torrentName)) || torrentHashCacheJSON === null) {
      if (Array.isArray(torrentHashCacheJSON)) {
        torrentHashCacheJSON.push(torrentName)
      } else {
        torrentHashCacheJSON = [torrentName]
      }
      await fs.writeJson(torrentHashCacheJSONPath, torrentHashCacheJSON)
      return false
    } else {
      return true
    }
  } catch (error) {
    console.error(error)
    return true
  }
}

init()