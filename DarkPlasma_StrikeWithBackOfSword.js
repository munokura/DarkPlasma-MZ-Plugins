// DarkPlasma_StrikeWithBackOfSword 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/07/31 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Skills and items that cannot deliver the final blow
@author DarkPlasma
@license MIT

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
-----

Version: 1.0.0
Skills with the following description in the memo field
cannot deal more damage than the opponent's HP.
(At least 1 HP will always remain.)

<strikeWithBackOfSword>
*/

/*:ja
@plugindesc トドメを刺せないスキル・アイテム
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.0.0
メモ欄に以下のように記述したスキルでは
相手のHP以上のダメージを与えられません。
（必ず、HP1以上残ります）

<strikeWithBackOfSword>
*/

(() => {
  'use strict';

  /**
   * @param {Game_Action.prototype} gameAction
   */
  function Game_Action_StrikeWithBackOfSwordMixIn(gameAction) {
    gameAction.isStrikeWithBackOfSword = function () {
      return this.item().meta.strikeWithBackOfSword;
    };

    const _executeHpDamage = gameAction.executeHpDamage;
    gameAction.executeHpDamage = function (target, value) {
      if (this.isStrikeWithBackOfSword()) {
        value = Math.min(target.hp - 1, value);
      }
      _executeHpDamage.call(this, target, value);
    };
  }

  Game_Action_StrikeWithBackOfSwordMixIn(Game_Action.prototype);
})();
