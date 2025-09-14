// DarkPlasma_DualWieldRepeats 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/09/13 1.0.0 最初のバージョン
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Increases the number of consecutive times you can perform certain actions when using dual wielding
@author DarkPlasma
@license MIT

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
-----

version: 1.0.0
By adding the specified notetag to a skill or item,
the target will be set to perform a Dual Wield Repeat.
When used by a Dual Wield Battler, the Dual Wield Repeat count increases by 1.

<dualWieldRepeats>
*/

/*:ja
@plugindesc 二刀流時に特定の行動の連続回数を増やす
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.0.0
スキル・アイテムに指定のメモタグを記述すると、
対象を二刀流連撃行動に設定します。
二刀流連撃行動は、二刀流のバトラーが使用すると連続回数が1増えます。

<dualWieldRepeats>
*/

(() => {
  'use strict';

  function Game_Action_DualWieldAttackTimesMixIn(gameAction) {
    gameAction.isDualWieldRepeats = function () {
      return !!this.item()?.meta.dualWieldRepeats;
    };
    const _numRepeats = gameAction.numRepeats;
    gameAction.numRepeats = function () {
      const repeats = _numRepeats.call(this);
      if (this.subject().isDualWield() && this.isDualWieldRepeats()) {
        return repeats + 1;
      }
      return repeats;
    };
  }
  Game_Action_DualWieldAttackTimesMixIn(Game_Action.prototype);
})();
