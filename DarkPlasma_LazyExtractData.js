// DarkPlasma_LazyExtractData 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/08/25 1.0.0 最初のバージョン
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Database Lazy Loading Part
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

version: 1.0.0
This plugin allows for delayed deployment of meta tags that depend on the
database structure.

This plugin does not work on its own.
Please use it together with an extension plugin.
*/

/*:ja
@plugindesc データベース遅延読み込みパート
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.0.0
データベースの構造に依存するようなmetaタグなどを
遅延して展開するためのプラグインです。

本プラグインは単体では動作しません。
拡張プラグインと一緒に利用してください。
*/

(() => {
  'use strict';

  function DataManager_LazyExtractDataMixIn(dataManager) {
    dataManager.lazyExtractData = function () {
      this._lazyExtractData.forEach((data) => this.lazyExtractMetadata(data));
    };
    dataManager.pushLazyExtractData = function (data) {
      if (!this._lazyExtractData) {
        this._lazyExtractData = [];
      }
      this._lazyExtractData.push(data);
    };
    dataManager.lazyExtractMetadata = function (data) {};
  }
  DataManager_LazyExtractDataMixIn(DataManager);
  function Scene_Boot_LazyExtractDataMixIn(sceneBoot) {
    const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
    sceneBoot.onDatabaseLoaded = function () {
      _onDatabaseLoaded.call(this);
      DataManager.lazyExtractData();
    };
  }
  Scene_Boot_LazyExtractDataMixIn(Scene_Boot.prototype);
})();
