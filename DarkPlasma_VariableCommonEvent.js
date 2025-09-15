// DarkPlasma_VariableCommonEvent 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/10/27 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Calls a common event with the ID specified by a variable.
@author DarkPlasma
@license MIT

@help
English Help Translator: munokura
This is an unofficial English translation of the plugin help,
created to support global RPG Maker users.
Original plugin by DarkPlasma.
Please check the latest official version at:
https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
-----

version: 1.0.0
Provides a plugin command that calls a common event with a specified variable
as its ID.

@command variableCommonEvent
@text Variable Common Events
@desc Specify a variable and call a common event with that value as its ID.
@arg variableId
@text variable
@desc Calls a common event with the specified variable value as its ID.
@type variable
@default 0
*/

/*:ja
@plugindesc 変数によって指定したIDのコモンイベントを呼び出す
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@command variableCommonEvent
@text 可変コモンイベント
@desc 変数を指定し、その値をIDとして持つコモンイベントを呼び出します。
@arg variableId
@desc 指定した変数の値をIDとして持つコモンイベントを呼び出します。
@text 変数
@type variable
@default 0

@help
version: 1.0.0
変数を指定し、その値をIDとして持つコモンイベントを
呼び出すプラグインコマンドを提供します。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_variableCommonEvent(args) {
    return {
      variableId: Number(args.variableId || 0),
    };
  }

  const command_variableCommonEvent = 'variableCommonEvent';

  PluginManager.registerCommand(pluginName, command_variableCommonEvent, function (args) {
    const parsedArgs = parseArgs_variableCommonEvent(args);
    const commonEvent = $dataCommonEvents[$gameVariables.value(parsedArgs.variableId)];
    if (commonEvent) {
      const eventId = this.isOnCurrentMap() ? this._eventId : 0;
      this.setupChild(commonEvent.list, eventId);
    }
  });
})();
