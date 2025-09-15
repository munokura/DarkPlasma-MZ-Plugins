// DarkPlasma_CommonDropItemSet 1.2.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/10/29 1.2.1 敵ごとにドロップする設定が効かない不具合を修正
 *            1.2.0 敵ごとにドロップする設定を追加
 *            1.1.0 共通ドロップアイテム有効判定の拡張用インターフェース追加
 *            1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Items, weapons, and armor dropped in all battles
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

version: 1.2.1
Sets the set of items, weapons, and armor that will drop in all battles.
Each drop set has its own drop probability.
For example, if you set Drop Set 1 to a 10% drop rate and Set 2 to a 20% drop
rate,
one of the items, weapons, or armor from Set 1 will drop 10% of the time,
and one of the items, weapons, or armor from Set 2 will drop 20% of the time.
(There are cases where both items drop.)

@param dropItemSetList
@text Drop Set List
@type struct<DropItemSet>[]
@default []

@param dropOneByOneEnemy
@text Drops from each enemy
@desc When turned ON, drop detection is performed per enemy, not per battle.
@type boolean
@default false
*/

/*:ja
@plugindesc 全戦闘共通でドロップするアイテム・武器・防具
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param dropItemSetList
@text ドロップセット一覧
@type struct<DropItemSet>[]
@default []

@param dropOneByOneEnemy
@desc ONにするとドロップ判定を戦闘ごとではなく、敵ごとに行います。
@text 敵ごとにドロップするか
@type boolean
@default false

@help
version: 1.2.1
全ての戦闘において共通でドロップするアイテム・武器・防具のセットを設定します。
ドロップセットはそれぞれ独立してドロップ確率判定を行います。
例えば、ドロップセット1に確率10％、セット2に確率20％を設定した場合、
セット1のアイテム・武器・防具のうちいずれか1つが10％
セット2のアイテム・武器・防具のうちいずれか1つが20％でドロップします。
（両方ドロップするケースもあります）
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    dropItemSetList: JSON.parse(pluginParameters.dropItemSetList || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          dropRate: Number(parsed.dropRate || 10),
          items: JSON.parse(parsed.items || '[]').map((e) => {
            return Number(e || 0);
          }),
          weapons: JSON.parse(parsed.weapons || '[]').map((e) => {
            return Number(e || 0);
          }),
          armors: JSON.parse(parsed.armors || '[]').map((e) => {
            return Number(e || 0);
          }),
        };
      })(e || '{}');
    }),
    dropOneByOneEnemy: String(pluginParameters.dropOneByOneEnemy || false) === 'true',
  };

  function makeDropItems() {
    return settings.dropItemSetList
      .filter((dropItemSet) => dropItemSet.dropRate > Math.randomInt(100))
      .map((dropItemSet) => {
        const dropItems = dropItemSet.items
          .map((id) => $dataItems[id])
          .concat(dropItemSet.weapons.map((id) => $dataWeapons[id]))
          .concat(dropItemSet.armors.map((id) => $dataArmors[id]));
        return dropItems[Math.randomInt(dropItems.length)];
      });
  }
  function Game_Troop_CommonDropItemSetMixIn(gameTroop) {
    const _makeDropItems = gameTroop.makeDropItems;
    gameTroop.makeDropItems = function () {
      return _makeDropItems.call(this).concat(this.makeCommonDropItems());
    };
    gameTroop.isCommonItemDropSetEnabled = function () {
      return !settings.dropOneByOneEnemy;
    };
    gameTroop.makeCommonDropItems = function () {
      return this.isCommonItemDropSetEnabled() ? makeDropItems() : [];
    };
  }
  Game_Troop_CommonDropItemSetMixIn(Game_Troop.prototype);
  function Game_Enemy_CommonDropItemSetMixIn(gameEnemy) {
    const _makeDropItems = gameEnemy.makeDropItems;
    gameEnemy.makeDropItems = function () {
      return _makeDropItems.call(this).concat(this.makeCommonDropItems());
    };
    gameEnemy.isCommonItemDropSetEnabled = function () {
      return settings.dropOneByOneEnemy;
    };
    gameEnemy.makeCommonDropItems = function () {
      return this.isCommonItemDropSetEnabled() ? makeDropItems() : [];
    };
  }
  Game_Enemy_CommonDropItemSetMixIn(Game_Enemy.prototype);
})();
