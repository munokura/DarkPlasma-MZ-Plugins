// DarkPlasma_ActionDebuffSuccessRate 1.0.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/03/17 1.0.1 TypeScript移行
 * 2022/06/12 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Set the debuff success rate for skills and items
@author DarkPlasma
@license MIT

@help
English Help Translator: munokura
This is an unofficial English translation of the plugin help,
created to support global RPG Maker users.
Feedback is welcome to improve translation quality
(see: https://github.com/munokura/DarkPlasma-MZ-Plugins ).
Original plugin by DarkPlasma.
Please check the latest official version at:
https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
-----

Version: 1.0.1
By entering the following in the skill/item memo field,
the base success rate of applying a debuff via that action will be x%. (100 if
not set.)
<debuffSuccessRate:x>

The final success rate will be calculated as follows:
Base success rate x Target debuff effectiveness x Target luck adjustment
*/

/*:ja
@plugindesc スキル・アイテムに弱体成功率を設定する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.0.1
スキル・アイテムのメモ欄に以下のように記述すると
その行動による弱体付与の基本成功率がx％になります。（未設定の場合100）
<debuffSuccessRate:x>

最終的な付与成功率は、以下の通りになります。
基本成功率 x 対象の弱体有効度 x 対象との運差による補正
*/

(() => {
  'use strict';

  /**
   * @param {Game_Action.prototype} gameAction
   */
  function Game_Action_DebuffSuccessRateMixIn(gameAction) {
    gameAction.baseDebuffSuccessRate = function () {
      return Number(this.item()?.meta.debuffSuccessRate || 100) / 100;
    };
    /**
     * 弱体の付与。成功率計算を変更するため上書き
     * @param {Game_BattlerBase} target
     * @param {MZ.Effect} effect
     */
    gameAction.itemEffectAddDebuff = function (target, effect) {
      let chance = this.baseDebuffSuccessRate() * target.debuffRate(effect.dataId) * this.lukEffectRate(target);
      if (Math.random() < chance) {
        target.addDebuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
      }
    };
  }
  Game_Action_DebuffSuccessRateMixIn(Game_Action.prototype);
})();
