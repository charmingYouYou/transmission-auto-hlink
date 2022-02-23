#!/bin/bash
# TORRENT_INFO="Ace.Combat.7.Skies.Unknown.CRACKFIX-CPY;2117;/volume3/娱乐/other;657f2221076439e11442f4e2efdc79ab8b84f36c;"
TORRENT_INFO="$TR_TORRENT_NAME;$TR_TORRENT_ID;$TR_TORRENT_DIR;$TR_TORRENT_HASH"
DESP="种子名称: $TR_TORRENT_NAME;种子ID: $TR_TORRENT_ID;种子存放目录: $TR_TORRENT_DIR;种子hash值: $TR_TORRENT_HASH;"
echo $DESP >> /tmp/hlink.txt
SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)
cross-env TORRENT_INFO="$TORRENT_INFO" node $SHELL_FOLDER/index.js >> /tmp/hlink.txt 2>&1
