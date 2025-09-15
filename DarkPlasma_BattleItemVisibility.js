// DarkPlasma_BattleItemVisibility 2.0.4
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 2.0.4 MZ 1.3.2に対応
 * 2021/06/22 2.0.3 サブフォルダからの読み込みに対応
 * 2020/11/13 2.0.2 武器を表示する設定が効かない不具合を修正
 * 2020/09/11 2.0.1 戦闘中にアイテム欄を開くとエラーが出る不具合を修正
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Control what appears in the in-battle item list
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

version: 2.0.4
This setting determines which items are displayed in the item list displayed
when using item commands during battle.
You can use plugin parameters to configure which items are displayed by
category.
Items entered in the item memo field as shown below will be displayed.

<VisibleInBattle>

@param showOnlyMenuItems
@text Display menu screen items
@desc Displays items that can only be used on the menu screen
@type boolean
@default false

@param showUnusableItems
@text Show Unavailable Items
@desc Show unavailable items
@type boolean
@default false

@param showWeapons
@text Show Weapons
@desc Show weapons
@type boolean
@default false

@param showArmors
@text Show Armor
@desc Shows armor
@type boolean
@default false

@param showImportantItems
@text Show what matters
@desc Show what's important
@type boolean
@default false

@param showUsableSecretItems
@text Show usable hidden items
@desc Displays hidden items that can be used during battle
@type boolean
@default false

@param showUnusableSecretItemsA
@text Show Unusable Hidden Item A
@desc Displays hidden item A that cannot be used during battle.
@type boolean
@default false

@param showUnusableSecretItemsB
@text Show Unusable Hidden Item B
@desc Displays hidden item B that cannot be used during battle.
@type boolean
@default false
*/

/*:ja
@plugindesc 戦闘中のアイテムリストに表示するものを制御する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param showOnlyMenuItems
@desc メニュー画面のみ使用可能なアイテムを表示します
@text メニュー画面アイテムを表示
@type boolean
@default false

@param showUnusableItems
@desc 使用不可アイテムを表示します
@text 使用不可アイテムを表示
@type boolean
@default false

@param showWeapons
@desc 武器を表示します
@text 武器を表示
@type boolean
@default false

@param showArmors
@desc 防具を表示します
@text 防具を表示
@type boolean
@default false

@param showImportantItems
@desc 大事なものを表示します
@text 大事なものを表示
@type boolean
@default false

@param showUsableSecretItems
@desc 戦闘中に使用可能な隠しアイテムを表示します
@text 使用可能隠しアイテムを表示
@type boolean
@default false

@param showUnusableSecretItemsA
@desc 戦闘中に使用不可能な隠しアイテムAを表示します
@text 使用不可隠しアイテムAを表示
@type boolean
@default false

@param showUnusableSecretItemsB
@desc 戦闘中に使用不可能な隠しアイテムBを表示します
@text 使用不可隠しアイテムBを表示
@type boolean
@default false

@help
version: 2.0.4
戦闘中のアイテムコマンドで表示されるアイテム一覧に表示するアイテムを設定します。
プラグインパラメータで種別ごとに表示するものを設定できる他、
アイテムのメモ欄に以下のように入力したアイテムを表示します。

<VisibleInBattle>
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    showOnlyMenuItems: String(pluginParameters.showOnlyMenuItems || false) === 'true',
    showUnusableItems: String(pluginParameters.showUnusableItems || false) === 'true',
    showWeapons: String(pluginParameters.showWeapons || false) === 'true',
    showArmors: String(pluginParameters.showArmors || false) === 'true',
    showImportantItems: String(pluginParameters.showImportantItems || false) === 'true',
    showUsableSecretItems: String(pluginParameters.showUsableSecretItems || false) === 'true',
    showUnusableSecretItemsA: String(pluginParameters.showUnusableSecretItemsA || false) === 'true',
    showUnusableSecretItemsB: String(pluginParameters.showUnusableSecretItemsB || false) === 'true',
  };

  const _DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data) {
    _DataManager_extractMetadata.call(this, data);
    if (data.meta.VisibleInBattle !== undefined) {
      data.visibleInBattle = true;
    }
  };

  const _Window_BattleItem_includes = Window_BattleItem.prototype.includes;
  Window_BattleItem.prototype.includes = function (item) {
    if (!item) {
      return false;
    }
    const usableSecretItemCondition = settings.showUsableSecretItems || (item.itypeId !== 3 && item.itypeId !== 4);
    return (
      (_Window_BattleItem_includes.call(this, item) && usableSecretItemCondition) ||
      (settings.showOnlyMenuItems && DataManager.isItem(item) && item.itypeId === 1 && item.occasion === 2) ||
      (settings.showUnusableItems && DataManager.isItem(item) && item.itypeId === 1 && item.occasion === 3) ||
      (settings.showUnusableSecretItemsA &&
        DataManager.isItem(item) &&
        item.itypeId === 3 &&
        (item.occasion === 2 || item.occasion === 3)) ||
      (settings.showUnusableSecretItemsB &&
        DataManager.isItem(item) &&
        item.itypeId === 4 &&
        (item.occasion === 2 || item.occasion === 3)) ||
      (settings.showWeapons && DataManager.isWeapon(item)) ||
      (settings.showArmors && DataManager.isArmor(item)) ||
      item.visibleInBattle
    );
  };
})();
