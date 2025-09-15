// DarkPlasma_SurpriseControl 3.0.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/05/06 3.0.0 イベントコマンド時の先制判定を別プラグインに分離
 *                  typescript移行
 * 2021/07/05 2.0.2 MZ 1.3.2に対応
 * 2021/06/22 2.0.1 サブフォルダからの読み込みに対応
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/27 1.0.1 イベントコマンドの戦闘の処理で無限に戦闘が繰り返される不具合を修正
 * 2020/08/26 1.0.0 MZ版公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Control preemptive/surprise attacks
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

Version: 3.0.0
Controls preemptive attacks for the player and enemy sides.
When specific switches are ON in the plugin parameters, you can set preemptive
attacks to not/not/yes/yes.

When multiple switches are ON, the priority is as follows:

Always attack first > Always attack first > Never/Do not attack first

By entering <NoPreemptive>, <NoSurprise>,
<ForcePreemptive>, or <ForceSurprise> in the enemy's memo field,
you can set that enemy to never/not/yes/yes preemptive in battles involving
that enemy.

<NoPreemptive>: The player side will not attack first
<NoSurprise>: The enemy side will not attack first
<ForcePreemptive>: The player side will always attack first
<ForceSurprise>: The enemy side will always attack first

In battles that include multiple of the above, the priority is as follows:

Always attack first > Always be attacked first > Do not attack first/do not
attack first

Due to the specifications of RPG Maker MZ, preemptive/surprise attack
determination is not performed in battles triggered by the "Battle" event
command.
By using this plugin in conjunction with
DarkPlasma_SurpriseControlWithEventBattle,
this plugin's settings can also be applied to battles triggered by event
commands.

@param noPreemptiveSwitch
@text Switch number that will stop preemptive attacks
@desc When the specified switch is ON, the player will not attack first.
@type switch
@default 0

@param noSurpriseSwitch
@text Switch number to prevent preemptive attacks
@desc When the specified switch is ON, the enemy side will not launch a preemptive attack.
@type switch
@default 0

@param forcePreemptiveSwitch
@text Switch number to always attack first
@desc When the specified switch is ON, the player side will definitely attack first.
@type switch
@default 0

@param forceSurpriseSwitch
@text Switch numbers that are always preemptively attacked
@desc When the specified switch is ON, the enemy side will definitely launch a preemptive attack.
@type switch
@default 0
*/

/*:ja
@plugindesc 先制攻撃/不意打ちの制御を行う
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param noPreemptiveSwitch
@desc 指定したスイッチがONのとき、プレイヤーサイドが先制攻撃しなくなります
@text 先制攻撃しなくなるスイッチ番号
@type switch
@default 0

@param noSurpriseSwitch
@desc 指定したスイッチがONのとき、エネミーサイドが先制攻撃しなくなります
@text 先制攻撃されなくなるスイッチ番号
@type switch
@default 0

@param forcePreemptiveSwitch
@desc 指定したスイッチがONのとき、プレイヤーサイドが確実に先制攻撃します
@text 必ず先制攻撃するスイッチ番号
@type switch
@default 0

@param forceSurpriseSwitch
@desc 指定したスイッチがONのとき、エネミーサイドが確実に先制攻撃します
@text 必ず先制攻撃されるスイッチ番号
@type switch
@default 0

@help
version: 3.0.0
プレイヤーサイド、エネミーサイドの先制攻撃を制御します。
プラグインパラメータで特定スイッチがONのときに
先制攻撃しない/されない/する/される設定ができます。

複数のスイッチがONのとき、優先度は以下のようになります。

必ず先制攻撃する > 必ず先制攻撃される > 先制攻撃しない/されない

エネミーのメモ欄に<NoPreemptive>, <NoSurprise>,
<ForcePreemptive>, <ForceSurprise>と記述をすることで、
その敵が含まれる戦闘において、
先制しない/されない/する/される設定ができます。

<NoPreemptive>: プレイヤーサイドが先制攻撃しない
<NoSurprise>: エネミーサイドが先制攻撃しない
<ForcePreemptive>: プレイヤーサイドが必ず先制攻撃する
<ForceSurprise>: エネミーサイドが必ず先制攻撃する

上記が複数含まれるパターンの戦闘においては、優先度は以下のようになります。

必ず先制攻撃する > 必ず先制攻撃される > 先制攻撃しない/されない

イベントコマンド「戦闘の処理」による戦闘ではRPGツクールMZの仕様上
先制/不意打ち判定が行われません。
DarkPlasma_SurpriseControlWithEventBattle と併用することで
イベントコマンドでの戦闘にも本プラグインの設定を適用できます。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    noPreemptiveSwitch: Number(pluginParameters.noPreemptiveSwitch || 0),
    noSurpriseSwitch: Number(pluginParameters.noSurpriseSwitch || 0),
    forcePreemptiveSwitch: Number(pluginParameters.forcePreemptiveSwitch || 0),
    forceSurpriseSwitch: Number(pluginParameters.forceSurpriseSwitch || 0),
  };

  function BattleManager_SurpriseControlMixIn(battleManager) {
    const _ratePreemptive = battleManager.ratePreemptive;
    battleManager.ratePreemptive = function () {
      if (this.forcePreemptive()) {
        return 1;
      } else if (this.noPreemptive() || this.forceSurprise()) {
        return 0;
      }
      return _ratePreemptive.call(this);
    };
    const _rateSurprise = battleManager.rateSurprise;
    battleManager.rateSurprise = function () {
      if (this.forceSurprise()) {
        return 1;
      } else if (this.noSurprise()) {
        return 0;
      }
      return _rateSurprise.call(this);
    };
    battleManager.noPreemptive = function () {
      return (
        (settings.noPreemptiveSwitch > 0 && $gameSwitches.value(settings.noPreemptiveSwitch)) ||
        $gameTroop.hasNoPreemptiveFlag()
      );
    };
    battleManager.noSurprise = function () {
      return (
        (settings.noSurpriseSwitch > 0 && $gameSwitches.value(settings.noSurpriseSwitch)) ||
        $gameTroop.hasNoSurpriseFlag()
      );
    };
    battleManager.forcePreemptive = function () {
      return (
        (settings.forcePreemptiveSwitch > 0 && $gameSwitches.value(settings.forcePreemptiveSwitch)) ||
        $gameTroop.hasForcePreemptiveFlag()
      );
    };
    battleManager.forceSurprise = function () {
      return (
        (settings.forceSurpriseSwitch > 0 && $gameSwitches.value(settings.forceSurpriseSwitch)) ||
        $gameTroop.hasForceSurpriseFlag()
      );
    };
  }
  BattleManager_SurpriseControlMixIn(BattleManager);
  function Game_Troop_SurpriseControlMixIn(gameTroop) {
    gameTroop.hasNoPreemptiveFlag = function () {
      return this.members().some(function (enemy) {
        return enemy.hasNoPreemptiveFlag();
      });
    };
    gameTroop.hasNoSurpriseFlag = function () {
      return this.members().some(function (enemy) {
        return enemy.hasNoSurpriseFlag();
      });
    };
    gameTroop.hasForcePreemptiveFlag = function () {
      return this.members().some(function (enemy) {
        return enemy.hasForcePreemptiveFlag();
      });
    };
    gameTroop.hasForceSurpriseFlag = function () {
      return this.members().some(function (enemy) {
        return enemy.hasForceSurpriseFlag();
      });
    };
  }
  Game_Troop_SurpriseControlMixIn(Game_Troop.prototype);
  function Game_Enemy_SurpriseControlMixIn(gameEnemy) {
    gameEnemy.hasNoPreemptiveFlag = function () {
      return !!this.enemy().meta.NoPreemptive;
    };
    gameEnemy.hasNoSurpriseFlag = function () {
      return !!this.enemy().meta.NoSurprise;
    };
    gameEnemy.hasForcePreemptiveFlag = function () {
      return !!this.enemy().meta.ForcePreemptive;
    };
    gameEnemy.hasForceSurpriseFlag = function () {
      return !!this.enemy().meta.ForceSurprise;
    };
  }
  Game_Enemy_SurpriseControlMixIn(Game_Enemy.prototype);
})();
