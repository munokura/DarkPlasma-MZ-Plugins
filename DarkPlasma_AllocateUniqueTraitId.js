// DarkPlasma_AllocateUniqueTraitId 1.0.2
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/11/04 1.0.2 ヘルプの誤字修正
 * 2022/08/21 1.0.1 typescript移行
 * 2022/05/28 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Ensure unique feature IDs
@author DarkPlasma
@license MIT

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
-----

version: 1.0.2
Allocates and makes available a unique trait ID.

This plugin does not function on its own.
Use it together with other plugins that require it.

The following information is for plugin developers.
Submit a request to the uniqueTraitIdCache object.

uniqueTraitIdCache.allocate
: (pluginName: string, localId: number, name: string) => UniqueTraitId
Allocates a unique trait ID for the plugin.

uniqueTraitIdCache.traitIdOf
: (pluginName: string, localId: number) => number|undefined
Reserved trait ID
Undefined if not reserved

uniqueTraitIdCache.nameOf
: (pluginName: string, localId: number) => string|undefined
Reserved trait ID name
Undefined if not reserved

UniqueTraitId.prototype.id: number
Reserved trait ID

UniqueTraitId.prototype.name: string
Reserved trait ID name

@param startIdOfUniqueTraitId
@text Unique feature ID starting point
@desc The starting ID for your own feature ID. If you don't know, leave it as is.
@type number
@default 71
*/

/*:ja
@plugindesc 独自の特徴IDを確保する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param startIdOfUniqueTraitId
@desc 独自に特徴IDを確保する際の始点ID。わからない場合はそのままにしてください
@text 独自特徴ID始点
@type number
@default 71

@help
version: 1.0.2
独自の特徴IDを確保し、利用できるようにします。

本プラグインは単体では機能しません。
本プラグインを必要とする別のプラグインと一緒に利用してください。

以下、プラグインの開発者向けの情報です。
uniqueTraitIdCache オブジェクトに対してリクエストを投げてください。

uniqueTraitIdCache.allocate
  : (pluginName: string, localId: number, name: string) => UniqueTraitId
  プラグインで独自の特徴IDを確保します。

uniqueTraitIdCache.traitIdOf
  : (pluginName: string, localId: number) => number|undefined
  確保した特徴ID
  確保していない場合はundefined

uniqueTraitIdCache.nameOf
  : (pluginName: string, localId: number) => string|undefined
  確保した特徴IDの名前
  確保していない場合はundefined

UniqueTraitId.prototype.id: number
  確保した特徴ID

UniqueTraitId.prototype.name: string
  確保した特徴IDの名前
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    startIdOfUniqueTraitId: Number(pluginParameters.startIdOfUniqueTraitId || 71),
  };

  let uniqueTraitId = settings.startIdOfUniqueTraitId;
  class UniqueTraitIdCache {
    constructor() {
      this._cache = {};
      this._cacheById = {};
    }
    /**
     * 独自のtraitIdを確保する
     * @param {string} pluginName プラグイン名
     * @param {number} localId プラグイン内で一意なID
     * @param {string} name 特徴名
     * @return {UniqueTraitId}
     */
    allocate(pluginName, localId, name) {
      const key = this.key(pluginName, localId);
      if (!this._cache[key]) {
        this._cache[key] = new UniqueTraitId(uniqueTraitId, name);
        this._cacheById[uniqueTraitId] = this._cache[key];
        uniqueTraitId++;
      }
      return this._cache[key];
    }
    /**
     * @param {string} pluginName プラグイン名
     * @param {number} localId プラグイン内で一意なID
     * @return {string}
     */
    key(pluginName, localId) {
      return `${pluginName}_${localId}`;
    }
    traitIdOf(pluginName, localId) {
      const key = this.key(pluginName, localId);
      return this._cache[key] ? this._cache[key].id : undefined;
    }
    /**
     * 特徴名を取得する
     * @param {string} pluginName プラグイン名
     * @param {number} localId プラグイン内で一意なID
     * @return {?string}
     */
    nameOf(pluginName, localId) {
      const key = this.key(pluginName, localId);
      return this._cache[key] ? this._cache[key].name : undefined;
    }
    /**
     * 特徴名
     * @param {number} id 特徴ID
     * @return {?string}
     */
    nameByTraitId(id) {
      return this._cacheById[id] ? this._cacheById[id].name : undefined;
    }
  }
  const uniqueTraitIdCache = new UniqueTraitIdCache();
  globalThis.uniqueTraitIdCache = uniqueTraitIdCache;
  class UniqueTraitId {
    /**
     * @param {number} id 特徴ID
     * @param {string} name 特徴名
     */
    constructor(id, name) {
      this._id = id;
      this._name = name;
    }
    get id() {
      return this._id;
    }
    get name() {
      return this._name;
    }
  }
})();
