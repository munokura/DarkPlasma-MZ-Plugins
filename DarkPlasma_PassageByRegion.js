// DarkPlasma_PassageByRegion 1.1.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/10/21 1.1.0 各方向の通行不可設定を優先するように変更
 * 2024/01/05 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Region passability
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

version: 1.1.0
You can specify passable and impassable squares depending on the region.

@param regions
@text Region Settings
@type struct<Region>[]
@default []
*/

/*:ja
@plugindesc リージョンによる通行可能判定
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param regions
@text リージョン設定
@type struct<Region>[]
@default []

@help
version: 1.1.0
リージョンによって通行可能・通行不可のマスを指定できます。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    regions: JSON.parse(pluginParameters.regions || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          id: Number(parsed.id || 0),
          through: String(parsed.through || false) === 'true',
          impassableUp: String(parsed.impassableUp || false) === 'true',
          impassableDown: String(parsed.impassableDown || false) === 'true',
          impassableLeft: String(parsed.impassableLeft || false) === 'true',
          impassableRight: String(parsed.impassableRight || false) === 'true',
        };
      })(e || '{}');
    }),
  };

  function Game_Map_PassageByRegionMixIn(gameMap) {
    const _isPassable = gameMap.isPassable;
    gameMap.isPassable = function (x, y, d) {
      if (this.isImpassableRegion(x, y, d)) {
        return false;
      }
      return this.isPassableRegion(x, y) || _isPassable.call(this, x, y, d);
    };
    gameMap.isPassableRegion = function (x, y) {
      const regionSetting = settings.regions.find((region) => region.id === this.regionId(x, y));
      return regionSetting ? regionSetting.through : false;
    };
    gameMap.isImpassableRegion = function (x, y, d) {
      const regionSetting = settings.regions.find((region) => region.id === this.regionId(x, y));
      const impassableFlag =
        0 |
        (regionSetting?.impassableUp ? 8 : 0) |
        (regionSetting?.impassableRight ? 4 : 0) |
        (regionSetting?.impassableLeft ? 2 : 0) |
        (regionSetting?.impassableDown ? 1 : 0);
      return (impassableFlag & ((1 << (d / 2 - 1)) & 0x0f)) !== 0;
    };
  }
  Game_Map_PassageByRegionMixIn(Game_Map.prototype);
})();
