// DarkPlasma_MaxItemCount 1.0.6
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/08/18 1.0.6 typescript移行
 * 2021/07/05 1.0.5 MZ 1.3.2に対応
 * 2021/06/22 1.0.4 サブフォルダからの読み込みに対応
 * 2020/10/10 1.0.3 リファクタ
 * 2020/09/29 1.0.2 プラグインコマンドに説明を追加
 * 2020/09/08 1.0.1 rollup構成へ移行
 * 2020/08/30 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Change the maximum number of items you can own
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

version: 1.0.6
You can set the maximum number of items you can hold for each item.

Enter the following in the item's memo field:

<maxCount:1010>

This will set the maximum number of items you can hold for the specified item
to 1010.

The priority of the set values is as follows:
Item-specific settings via plugin command
> Memo field settings
> All item settings via plugin command
> Default maximum number of items

Using this plugin's plugin command
Changing the maximum number of items you can hold will extend your save data.

@param defaultMaxItemCount
@text Item possession limit
@desc The maximum number of items you can own.
@type number
@default 99

@command changeDefaultMaxItemCount
@text Changed the possession limit for all items
@desc Change the limit for all items/weapons/armor you can own during the game.
@arg count
@text New limit
@type number

@command changeMaxItemCount
@text Change the item possession limit
@desc Change the item limit per item during the game. This overrides the limit for all items.
@arg count
@text New limit
@type number

@arg id
@text Item ID
@type item

@command changeMaxWeaponCount
@text Change weapon possession limit
@desc Change the possession limit for each weapon during the game. This takes priority over the limit for all items.
@arg count
@text New limit
@type number

@arg id
@text Weapon ID
@type weapon

@command changeMaxArmorCount
@text Change in the armor possession limit
@desc Change the possession limit for each piece of armor during the game. This takes priority over the limit for all items.
@arg count
@text New limit
@type number

@arg id
@text Armor ID
@type armor
*/

/*:ja
@plugindesc アイテム最大所持数変更
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param defaultMaxItemCount
@desc アイテムごとの所持数限界値です。
@text アイテム所持数限界
@type number
@default 99

@command changeDefaultMaxItemCount
@text 全アイテムの所持限界数変更
@desc ゲーム中に全アイテム/武器/防具のアイテム別所持限界数を変更します。
@arg count
@text 変更後の限界数
@type number

@command changeMaxItemCount
@text アイテムの所持限界数変更
@desc ゲーム中にアイテムごとに所持限界数を変更します。全アイテムの限界数よりも優先されます。
@arg count
@text 変更後の限界数
@type number
@arg id
@text アイテムID
@type item

@command changeMaxWeaponCount
@text 武器の所持限界数変更
@desc ゲーム中に武器ごとに所持限界数を変更します。全アイテムの限界数よりも優先されます。
@arg count
@text 変更後の限界数
@type number
@arg id
@text 武器ID
@type weapon

@command changeMaxArmorCount
@text 防具の所持限界数変更
@desc ゲーム中に防具ごとに所持限界数を変更します。全アイテムの限界数よりも優先されます。
@arg count
@text 変更後の限界数
@type number
@arg id
@text 防具ID
@type armor

@help
version: 1.0.6
アイテムごとに最大所持数を設定できます。

アイテムのメモ欄に以下のように記述してください。

<maxCount:1010>

これにより、記述したアイテムの所持数限界が1010個になります。

設定した値の優先順位は以下の通りです。
プラグインコマンドによるアイテム別設定
 > メモ欄の設定
 > プラグインコマンドによる全アイテムの設定
 > デフォルトの最大所持数

本プラグインのプラグインコマンドを使用して
アイテムの所持数最大値を変更するとセーブデータを拡張します。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_changeDefaultMaxItemCount(args) {
    return {
      count: Number(args.count || 0),
    };
  }

  function parseArgs_changeMaxItemCount(args) {
    return {
      count: Number(args.count || 0),
      id: Number(args.id || 0),
    };
  }

  function parseArgs_changeMaxWeaponCount(args) {
    return {
      count: Number(args.count || 0),
      id: Number(args.id || 0),
    };
  }

  function parseArgs_changeMaxArmorCount(args) {
    return {
      count: Number(args.count || 0),
      id: Number(args.id || 0),
    };
  }

  const command_changeDefaultMaxItemCount = 'changeDefaultMaxItemCount';

  const command_changeMaxItemCount = 'changeMaxItemCount';

  const command_changeMaxWeaponCount = 'changeMaxWeaponCount';

  const command_changeMaxArmorCount = 'changeMaxArmorCount';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    defaultMaxItemCount: Number(pluginParameters.defaultMaxItemCount || 99),
  };

  PluginManager.registerCommand(pluginName, command_changeDefaultMaxItemCount, function (args) {
    const parsedArgs = parseArgs_changeDefaultMaxItemCount(args);
    $gameParty.changeDefaultMaxItemCount(parsedArgs.count);
  });
  PluginManager.registerCommand(pluginName, command_changeMaxItemCount, function (args) {
    const parsedArgs = parseArgs_changeMaxItemCount(args);
    $gameParty.changeMaxItemCount($dataItems[parsedArgs.id], parsedArgs.count);
  });
  PluginManager.registerCommand(pluginName, command_changeMaxWeaponCount, function (args) {
    const parsedArgs = parseArgs_changeMaxWeaponCount(args);
    $gameParty.changeMaxItemCount($dataWeapons[parsedArgs.id], parsedArgs.count);
  });
  PluginManager.registerCommand(pluginName, command_changeMaxArmorCount, function (args) {
    const parsedArgs = parseArgs_changeMaxArmorCount(args);
    $gameParty.changeMaxItemCount($dataArmors[parsedArgs.id], parsedArgs.count);
  });
  function Game_Party_MaxItemCountMixIn(gameParty) {
    /**
     * 全アイテムの所持最大数をゲーム中に変更する
     * @param {number} count 変更後の最大数
     */
    gameParty.changeDefaultMaxItemCount = function (count) {
      this._defaultMaxItemCount = count;
      this.items()
        .filter((item) => this.hasMaxItems(item))
        .forEach((item) => this.setItemCountToMax(item));
    };
    /**
     * アイテムの所持最大数をゲーム中に変更する
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     * @param {number} count 変更後の最大数
     */
    gameParty.changeMaxItemCount = function (item, count) {
      if (!this._maxItemCount) {
        this._maxItemCount = {};
      }
      const key = this.itemMaxCountKey(item);
      if (!key) {
        return;
      }
      this._maxItemCount[key] = count;
      if (this.hasMaxItems(item)) {
        this.setItemCountToMax(item);
      }
    };
    /**
     * 指定したアイテムの所持数を最大にする
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     */
    gameParty.setItemCountToMax = function (item) {
      const container = this.itemContainer(item);
      if (container) {
        container[item.id] = this.maxItems(item);
        if (container[item.id] === 0) {
          delete container[item.id];
        }
      }
    };
    /**
     * ゲーム中に変更されたアイテムの所持最大数を返す
     * ゲーム中に変更されていない場合はnullを返す
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     * @return {number|null}
     */
    gameParty.changedMaxItemCount = function (item) {
      if (!this._maxItemCount) {
        return null;
      }
      const key = this.itemMaxCountKey(item);
      if (!key || this._maxItemCount[key] === undefined) {
        return null;
      }
      return this._maxItemCount[key];
    };
    /**
     * アイテム所持最大数のキーを返す
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     * @return {string|null}
     */
    gameParty.itemMaxCountKey = function (item) {
      if (DataManager.isItem(item)) {
        return `item_${item.id}`;
      }
      if (DataManager.isWeapon(item)) {
        return `weapon_${item.id}`;
      }
      if (DataManager.isArmor(item)) {
        return `armor_${item.id}`;
      }
      return null;
    };
    /**
     * アイテムの所持最大数を返す
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
     * @return {number}
     */
    gameParty.maxItems = function (item) {
      const changedMaxCount = this.changedMaxItemCount(item);
      if (changedMaxCount !== null) {
        return changedMaxCount;
      }
      if (item.meta.maxCount !== undefined) {
        return Number(item.meta.maxCount);
      }
      if (this._defaultMaxItemCount !== undefined) {
        return this._defaultMaxItemCount;
      }
      return settings.defaultMaxItemCount;
    };
    /**
     * アイテム最大所持数のうち、最も大きいものを返す
     * @return {number}
     */
    gameParty.maxOfMaxItemCount = function () {
      return $dataItems
        .filter((item) => !!item && item.meta.maxCount !== undefined)
        .map((item) => Number(item.meta.maxCount))
        .concat(Object.values(this._maxItemCount || {}))
        .concat([settings.defaultMaxItemCount, this._defaultMaxItemCount || 0])
        .reduce((a, b) => Math.max(a, b), 0);
    };
  }
  Game_Party_MaxItemCountMixIn(Game_Party.prototype);
  Window_ItemList.prototype.drawItemNumber = function (item, x, y, width) {
    if (this.needsNumber()) {
      this.drawText(':', x, y, width - this.textWidth($gameParty.maxOfMaxItemCount().toString()), 'right');
      this.drawText(`${$gameParty.numItems(item)}`, x, y, width, 'right');
    }
  };
})();
