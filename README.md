## Transmission种子下载完成自动通知 & 硬链接

### 功能说明

* 支持Transmission种子下载完成后通知

* 支持Transmission种子下载完成后自动硬链接(限文件夹)


### 使用方式

1. 下载本项目

   * 如果安装有git

     ```sh
     git clone https://github.com/charmingYouYou/transmission-auto-hlink.git
     ```

   * release下载安装包, 解压到对应目录

1. 群晖套件中心安装`Node.js v12`

1. 在项目根目录运行

   ```shell
   // 安装全局hlink
   npm install -g hlink --registry=https://registry.npmmirror.com
   // 安装依赖
   npm install --registry=https://registry.npmmirror.com
   // 给脚本执行权限
   chmod +xr index.sh
   ```

   > 1. 关于hlink可点击[链接](https://github.com/likun7981/hlink)获取更多信息, 威联通需要额外修改

1. 在`config.js`修改配置

   ```typescript
   module.exports = {
     // 是否自动进行硬链接
     HILINK: true,
     // 硬链接白名单, 根据模糊匹配, 只要路径中存在即进行硬链接, 不存在则跳过
     HLINK_TORRENT_DIR_WHITE_LIST: ['电影', '电视剧', '动画片', '纪录片'],
     // 硬链接源地址目录
     HLINK_INPUT_DIR: '/volume3/娱乐',
     // 硬链接输出目录
     HILINK_OUTPUT_DIR: '/volume3/娱乐/hlink',
   }
   ```

   > 举例说明: 
   >
   > * 下载电影合集`名侦探柯南20周年剧场版合集1080P`
   > * 下载最终地址为: `/volume3/娱乐/电影/名侦探柯南20周年剧场版合集1080P`
   > * 根据配置将`/volume3/娱乐`替换为`/volume3/娱乐/hlink`
   > * 最终硬链接地址为`/volume3/娱乐/hlink/电影/名侦探柯南20周年剧场版合集1080P`

1. 在`.env`中修改消息通知配置

   > 条件有限,目前仅自测企业微信应用消息推送正常,如有异常,请提issues

   | Name              | 归属                                                         | 属性   | 说明                                                         |
   | ----------------- | ------------------------------------------------------------ | ------ | ------------------------------------------------------------ |
   | `PUSH_KEY`        | 微信server酱推送                                             | 非必须 | server酱的微信通知[官方文档](http://sc.ftqq.com/3.version)，已兼容 [Server酱·Turbo版](https://sct.ftqq.com/) |
   | `BARK_PUSH`       | [BARK推送](https://apps.apple.com/us/app/bark-customed-notifications/id1403753865) | 非必须 | IOS用户下载BARK这个APP,填写内容是app提供的`设备码`，例如：https://api.day.app/123 ，那么此处的设备码就是`123`，再不懂看 [这个图](https://github.com/charmingYouYou/juejin_sign_ql/blob/main/icon/bark.jpg)（注：支持自建填完整链接即可） |
   | `BARK_SOUND`      | [BARK推送](https://apps.apple.com/us/app/bark-customed-notifications/id1403753865) | 非必须 | bark推送声音设置，例如`choo`,具体值请在`bark`-`推送铃声`-`查看所有铃声` |
   | `BARK_GROUP`      | [BARK推送](https://apps.apple.com/us/app/bark-customed-notifications/id1403753865) | 非必须 | bark推送消息分组，例如`jd_scripts`                           |
   | `TG_BOT_TOKEN`    | telegram推送                                                 | 非必须 | tg推送(需设备可连接外网),`TG_BOT_TOKEN`和`TG_USER_ID`两者必需,填写自己申请[@BotFather](https://t.me/BotFather)的Token,如`10xxx4:AAFcqxxxxgER5uw` , [具体教程](https://github.com/zero205/JD_tencent_scf/edit/main/backUp/TG_PUSH.md) |
   | `TG_USER_ID`      | telegram推送                                                 | 非必须 | tg推送(需设备可连接外网),`TG_BOT_TOKEN`和`TG_USER_ID`两者必需,填写[@getuseridbot](https://t.me/getuseridbot)中获取到的纯数字ID, [具体教程](https://github.com/zero205/JD_tencent_scf/edit/main/backUp/TG_PUSH.md) |
   | `DD_BOT_TOKEN`    | 钉钉推送                                                     | 非必须 | 钉钉推送(`DD_BOT_TOKEN`和`DD_BOT_SECRET`两者必需)[官方文档](https://developers.dingtalk.com/document/app/custom-robot-access) ,只需`https://oapi.dingtalk.com/robot/send?access_token=XXX` 等于`=`符号后面的XXX即可 |
   | `DD_BOT_SECRET`   | 钉钉推送                                                     | 非必须 | (`DD_BOT_TOKEN`和`DD_BOT_SECRET`两者必需) ,密钥，机器人安全设置页面，加签一栏下面显示的SEC开头的`SECXXXXXXXXXX`等字符 , 注:钉钉机器人安全设置只需勾选`加签`即可，其他选项不要勾选,再不懂看 [这个图](https://github.com/charmingYouYou/juejin_sign_ql/blob/main/icon/DD_bot.png) |
   | `QYWX_KEY`        | 企业微信机器人推送                                           | 非必须 | 密钥，企业微信推送 webhook 后面的 key [详见官方说明文档](https://work.weixin.qq.com/api/doc/90000/90136/91770) |
   | `QYWX_AM`         | 企业微信应用消息推送                                         | 非必须 | corpid,corpsecret,touser,agentid,素材库图片id [参考文档1](http://note.youdao.com/s/HMiudGkb) [参考文档2](http://note.youdao.com/noteshare?id=1a0c8aff284ad28cbd011b29b3ad0191) 素材库图片填0为图文消息, 填1为纯文本消息 |
   | `IGOT_PUSH_KEY`   | iGot推送                                                     | 非必须 | iGot聚合推送，支持多方式推送，确保消息可达。 [参考文档](https://wahao.github.io/Bark-MP-helper) |
   | `PUSH_PLUS_TOKEN` | pushplus推送                                                 | 非必须 | 微信扫码登录后一对一推送或一对多推送下面的token(您的Token) [官方网站](http://www.pushplus.plus/) |
   | `PUSH_PLUS_USER`  | pushplus推送                                                 | 非必须 | 一对多推送的“群组编码”（一对多推送下面->您的群组(如无则新建)->群组编码）注:(1、需订阅者扫描二维码 2、如果您是创建群组所属人，也需点击“查看二维码”扫描绑定，否则不能接受群组消息推送)，只填`PUSH_PLUS_TOKEN`默认为一对一推送 |
   | `TG_PROXY_HOST`   | Telegram 代理的 IP                                           | 非必须 | 代理类型为 http。例子：http代理 [http://127.0.0.1:1080](http://127.0.0.1:1080/) 则填写 127.0.0.1 |
   | `TG_PROXY_PORT`   | Telegram 代理的端口                                          | 非必须 | 例子：http代理 [http://127.0.0.1:1080](http://127.0.0.1:1080/) 则填写 1080 |

6. 配置脚本

   1. 在项目根目录运行`pwd`获取当前项目目录

   2. 在`transmission web control`设置中配置相关脚本目录

      ```shell
      # 举例
      项目根目录运行命令: pwd
      获取到目录为 /volume3/备份/transmission-auto-hlink
      则transmission web control配置为`/volume3/备份/transmission-auto-hlink/index.sh`
      ```

      

      ![img](https://charmingyouyou-1256314320.file.myqcloud.com/logo/chrome_2019-01-16_10-53-39.png)

   
