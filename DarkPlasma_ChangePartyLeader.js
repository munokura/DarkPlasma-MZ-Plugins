// DarkPlasma_ChangePartyLeader 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/11/06 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Change the leader of the party
@author DarkPlasma
@license MIT

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
-----

Version: 1.0.0
This plugin command replaces the leading party member with a current party
member.

The following data is added to the save data:
- The leader immediately before the leader is changed with the plugin command.

Note that if the specified actor or the original leader is not a party member,
the plugin command will do nothing.

@command changeLeader
@text Change the leader
@desc Changes the party leader to the specified actor (swap positions with the original leader).
@arg actorId
@text actor
@type actor

@command resetLeader
@text Restore the leader
@desc Change the reader and return it to the state it was in just before the plugin command was executed.
*/

/*:ja
@plugindesc パーティの先頭（リーダー）を変更する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@command changeLeader
@text リーダーを変更する
@desc パーティリーダーを指定したアクターに変更します。（元のリーダーと隊列を入れ替えます）
@arg actorId
@text アクター
@type actor

@command resetLeader
@text リーダーを元に戻す
@desc リーダーを変更プラグインコマンド実行直前の状態に戻します。

@help
version: 1.0.0
先頭のパーティメンバーを、現在パーティメンバーにいるアクターに
入れ替えるプラグインコマンドを提供します。

セーブデータに以下のデータを追加します。
- プラグインコマンドでリーダーを変更する直前のリーダー

尚、指定したアクターや元のリーダーがパーティメンバーにいない場合、
プラグインコマンドは何もしません。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_changeLeader(args) {
    return {
      actorId: Number(args.actorId || 0),
    };
  }

  const command_changeLeader = 'changeLeader';

  const command_resetLeader = 'resetLeader';

  PluginManager.registerCommand(pluginName, command_changeLeader, function (args) {
    const parsedArgs = parseArgs_changeLeader(args);
    const actor = $gameActors.actor(parsedArgs.actorId);
    if (!actor || actor.index() === 0) {
      return;
    }
    this._leaderActorIdBeforeChange = $gameParty.leader().actorId();
    $gameParty.swapOrder(0, actor.index());
  });
  PluginManager.registerCommand(pluginName, command_resetLeader, function () {
    const actor = $gameActors.actor(this._leaderActorIdBeforeChange || 0);
    if (actor && actor.index() > 0) {
      $gameParty.swapOrder(0, actor.index());
    }
  });
})();
