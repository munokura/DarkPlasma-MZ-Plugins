// DarkPlasma_CertainHitAction 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/08/12 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Make skills and items guaranteed to hit, ignore counterattacks, or ignore reflections
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

Version: 1.0.0
By entering the specified tag in the memo field of a skill or item,
you can grant the target the Guaranteed Hit, Ignore Counterattack, or Ignore
Reflection traits.

Certain Hit: <CertainHit>
Sets the success rate of hit checks based on hit rate to 100%.
Sets the success rate of evasion checks based on evasion rate and magic
evasion rate to 0%.
Hit Type: Unlike Guaranteed Hit, physical damage rate and magic damage rate
remain affected, and
the success rate of applying a state is calculated normally.

Ignore Counter: <IgnoreCounter>
Sets the success rate of counterattack checks based on counterattack rate for
that skill to 0%.

Ignore Reflection: <IgnoreReflection>
Sets the success rate of magic reflection checks based on magic reflection for
that skill to 0%.
*/

/*:ja
@plugindesc スキルやアイテムを必中・反撃無視・反射無視にする
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.0.0
スキルやアイテムのメモ欄に指定のタグを記述することで
対象に必中特性、反撃無視特性、反射無視特性を付与します。

必中特性: <certainHit>
命中率による命中判定の成功率を100％にします。
回避率・魔法回避率による回避判定の成功率を0％にします。
命中タイプ:必中と異なり、物理ダメージ率や魔法ダメージ率の影響は残る他
ステートの付与の成功率も通常通りの計算となります。

反撃無視特性: <ignoreCounter>
そのスキルに対する反撃率による反撃判定の成功率を0％にします。

反射無視特性: <ignoreReflection>
そのスキルに対する魔法反射率による反射判定の成功率を0％にします。
*/

(() => {
  'use strict';

  function Game_Action_CertainHitMixIn(gameAction) {
    const _itemHit = gameAction.itemHit;
    gameAction.itemHit = function (target) {
      if (this.item()?.meta.certainHit) {
        return 1;
      }
      return _itemHit.call(this, target);
    };
    const _itemEva = gameAction.itemEva;
    gameAction.itemEva = function (target) {
      if (this.item()?.meta.certainHit) {
        return 0;
      }
      return _itemEva.call(this, target);
    };
    const _itemCnt = gameAction.itemCnt;
    gameAction.itemCnt = function (target) {
      if (this.item()?.meta.ignoreCounter) {
        return 0;
      }
      return _itemCnt.call(this, target);
    };
    const _itemMrf = gameAction.itemMrf;
    gameAction.itemMrf = function (target) {
      if (this.item()?.meta.ignoreReflection) {
        return 0;
      }
      return _itemMrf.call(this, target);
    };
  }
  Game_Action_CertainHitMixIn(Game_Action.prototype);
})();
