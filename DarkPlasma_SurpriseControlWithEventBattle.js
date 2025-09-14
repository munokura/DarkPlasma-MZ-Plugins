// DarkPlasma_SurpriseControlWithEventBattle 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/05/06 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Use the event command "Battle Processing" to determine preemptive attack/surprise attack
@author DarkPlasma
@license MIT

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
-----

Version: 1.0.0
The "Battle Processing" event command also determines whether a preemptive
attack or surprise attack occurred.
*/

/*:ja
@plugindesc イベントコマンド「戦闘の処理」で先制攻撃/不意打ちの判定を行う
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.0.0
イベントコマンド「戦闘の処理」でも先制攻撃/不意打ちの判定を行います。
*/

(() => {
  'use strict';

  function BattleManager_SurpriseControlMixIn(battleManager) {
    const _setup = battleManager.setup;
    battleManager.setup = function (troopId, canEscape, canLose) {
      _setup.call(this, troopId, canEscape, canLose);
      if (this.mustDoOnEncounter()) {
        this.onEncounter();
      }
    };
    battleManager.mustDoOnEncounter = function () {
      return this._isEventBattle;
    };
    battleManager.setIsEventBattle = function (isEventBattle) {
      this._isEventBattle = isEventBattle;
    };
  }
  BattleManager_SurpriseControlMixIn(BattleManager);
  function Game_Interpreter_SurpriseControlMixIn(gameInterpreter) {
    const _command301 = gameInterpreter.command301;
    gameInterpreter.command301 = function (params) {
      BattleManager.setIsEventBattle(true);
      const result = _command301.call(this, params);
      BattleManager.setIsEventBattle(false);
      return result;
    };
  }
  Game_Interpreter_SurpriseControlMixIn(Game_Interpreter.prototype);
})();
