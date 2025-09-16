// DarkPlasma_AllocateUniqueEffectCode 1.0.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/09/11 1.0.1 typescript移行
 * 2022/07/17 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Secure your own effect code
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

version: 1.0.1
Allocates and makes available a unique effect code.

This plugin does not function on its own.
Use it with other plugins that require it.

Submit a request to the uniqueEffectCodeCache object.

uniqueEffectCodeCache.allocate
: (pluginName: string, localId: number) => UniqueEffectCode
Allocates a unique effect code for the plugin.

uniqueEffectCodeCache.effectCodeOf
: (pluginName: string, localId: number) => number|undefined
Allocates the effect code.
If not allocated, returns undefined.

UniqueEffectCode.prototype.code: number
Allocates the effect code.

@param startOfUniqueEffectCode
@text Original effect code start point
@desc Starting point for securing your own effect code. If you don't know, leave it as is.
@type number
@default 51
*/

/*:ja
@plugindesc 独自の効果コードを確保する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param startOfUniqueEffectCode
@desc 独自に効果コードを確保する際の始点。わからない場合はそのままにしてください
@text 独自効果コード始点
@type number
@default 51

@help
version: 1.0.1
特徴の効果コードを確保し、利用できるようにします。

本プラグインは単体では機能しません。
本プラグインを必要とする別のプラグインと一緒に利用してください。

uniqueEffectCodeCache オブジェクトに対してリクエストを投げてください。

uniqueEffectCodeCache.allocate
  : (pluginName: string, localId: number) => UniqueEffectCode
  プラグインで独自の効果コードを確保します。

uniqueEffectCodeCache.effectCodeOf
  : (pluginName: string, localId: number) => number|undefined
  確保した効果コード
  確保していない場合はundefined

UniqueEffectCode.prototype.code: number
  確保した効果コード
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    startOfUniqueEffectCode: Number(pluginParameters.startOfUniqueEffectCode || 51),
  };

  let uniqueEffectCode = settings.startOfUniqueEffectCode;
  class UniqueEffectCodeCache {
    constructor() {
      this._cache = {};
      this._cacheById = {};
    }
    /**
     * @param {string} pluginName プラグイン名
     * @param {number} localId プラグイン内で一意なID
     */
    allocate(pluginName, localId) {
      const key = this.key(pluginName, localId);
      if (!this._cache[key]) {
        this._cache[key] = new UniqueEffectCode(uniqueEffectCode);
        this._cacheById[uniqueEffectCode] = this._cache[key];
        uniqueEffectCode++;
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
    /**
     * @param {string} pluginName
     * @param {number} localId
     * @return {number|undefined}
     */
    effectCodeOf(pluginName, localId) {
      const key = this.key(pluginName, localId);
      return this._cache[key] ? this._cache[key].code : undefined;
    }
  }
  const uniqueEffectCodeCache = new UniqueEffectCodeCache();
  globalThis.uniqueEffectCodeCache = uniqueEffectCodeCache;
  class UniqueEffectCode {
    /**
     * @param {number} code 効果コードID
     */
    constructor(code) {
      this._code = code;
    }
    get code() {
      return this._code;
    }
  }
})();
