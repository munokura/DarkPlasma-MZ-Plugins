// DarkPlasma_AllocateUniqueTraitDataId 1.1.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/11/04 1.1.0 特徴データ名のDBロード後評価に対応
 * 2024/11/04 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Ensure a unique feature data ID
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
Allocates and makes available unique trait data IDs.

This plugin does not function on its own.
Use it together with other plugins that require it.

The following information is for plugin developers.
Submit a request to the uniqueTraitDataIdCache object.

uniqueTraitDataIdCache.allocate
: (pluginName: string, traitId: number, localId: number, name: string|(() =>
string)) => UniqueTraitDataId
Allocates a unique special flag ID for the plugin.
The name can also be a function evaluated after loading the database.

UniqueSpecialFlagId.prototype.id: number
Allocates the special flag ID.

UniqueSpecialFlagId.prototype.name: string
Name of the allocated special flag ID.

If using with the following plugins, add it below them.
DarkPlasma_FilterEquip

@param startId
@text Unique ID start point
@desc Defines the unique ID start point for each feature.
@type struct<uniqueDataIds>
@default {"debuffRate":"8","param":"8","xparam":"10","sparam":"10","slotType":"2","specialFlag":"4","partyAbility":"6"}
*/

/*:ja
@plugindesc 独自の特徴データIDを確保する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@orderAfter DarkPlasma_FilterEquip

@param startId
@desc 各種特徴の独自ID始点を定義します。
@text 独自ID始点
@type struct<uniqueDataIds>
@default {"debuffRate":"8","param":"8","xparam":"10","sparam":"10","slotType":"2","specialFlag":"4","partyAbility":"6"}

@help
version: 1.1.0
独自の特徴データIDを確保し、利用できるようにします。

本プラグインは単体では機能しません。
本プラグインを必要とする別のプラグインと一緒に利用してください。

以下、プラグインの開発者向けの情報です。
uniqueTraitDataIdCache オブジェクトに対してリクエストを投げてください。

uniqueTraitDataIdCache.allocate
  : (pluginName: string, traitId: number, localId: number, name: string|(() => string)) => UniqueTraitDataId
  プラグインで独自の特殊フラグIDを確保します。
  名前をデータベースロード後に評価する関数にすることもできます。

UniqueSpecialFlagId.prototype.id: number
  確保した特殊フラグID

UniqueSpecialFlagId.prototype.name: string
  確保した特殊フラグIDの名前

下記プラグインと共に利用する場合、それよりも下に追加してください。
DarkPlasma_FilterEquip
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    startId: pluginParameters.startId
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            debuffRate: Number(parsed.debuffRate || 8),
            param: Number(parsed.param || 8),
            xparam: Number(parsed.xparam || 10),
            sparam: Number(parsed.sparam || 10),
            slotType: Number(parsed.slotType || 2),
            specialFlag: Number(parsed.specialFlag || 4),
            partyAbility: Number(parsed.partyAbility || 6),
          };
        })(pluginParameters.startId)
      : { debuffRate: 8, param: 8, xparam: 10, sparam: 10, slotType: 2, specialFlag: 4, partyAbility: 6 },
  };

  const uniqueDataIds = {
    [Game_BattlerBase.TRAIT_DEBUFF_RATE]: settings.startId.debuffRate,
    [Game_BattlerBase.TRAIT_PARAM]: settings.startId.param,
    [Game_BattlerBase.TRAIT_XPARAM]: settings.startId.xparam,
    [Game_BattlerBase.TRAIT_SPARAM]: settings.startId.sparam,
    [Game_BattlerBase.TRAIT_SLOT_TYPE]: settings.startId.slotType,
    [Game_BattlerBase.TRAIT_SPECIAL_FLAG]: settings.startId.specialFlag,
    [Game_BattlerBase.TRAIT_PARTY_ABILITY]: settings.startId.partyAbility,
  };
  /**
   * データID拡張すべきでない特徴一覧
   * 元々データIDが設定されていなかったり、データベースのIDが設定されているもの
   */
  const traitIdsWithFixedDataIds = [
    Game_BattlerBase.TRAIT_ELEMENT_RATE /* 属性有効度 */,
    Game_BattlerBase.TRAIT_STATE_RATE /* ステート有効度 */,
    Game_BattlerBase.TRAIT_STATE_RESIST /* ステート無効 */,
    Game_BattlerBase.TRAIT_ATTACK_ELEMENT /* 攻撃時属性 */,
    Game_BattlerBase.TRAIT_ATTACK_STATE /* 攻撃時ステート */,
    Game_BattlerBase.TRAIT_ATTACK_SPEED /* 攻撃速度補正 */,
    Game_BattlerBase.TRAIT_ATTACK_TIMES /* 攻撃追加回数 */,
    Game_BattlerBase.TRAIT_ATTACK_SKILL /* 攻撃スキル */,
    Game_BattlerBase.TRAIT_STYPE_ADD /* スキルタイプ追加 */,
    Game_BattlerBase.TRAIT_STYPE_SEAL /* スキルタイプ封印 */,
    Game_BattlerBase.TRAIT_SKILL_ADD /* スキル追加 */,
    Game_BattlerBase.TRAIT_SKILL_SEAL /* スキル封印 */,
    Game_BattlerBase.TRAIT_EQUIP_WTYPE /* 武器タイプ装備 */,
    Game_BattlerBase.TRAIT_EQUIP_ATYPE /* 防具タイプ装備 */,
    Game_BattlerBase.TRAIT_EQUIP_LOCK /* 装備固定 */,
    Game_BattlerBase.TRAIT_EQUIP_SEAL /* 装備封印 */,
    Game_BattlerBase.TRAIT_ACTION_PLUS /* 行動回数追加 */,
  ];
  class UniqueTraitDataIdCache {
    constructor() {
      this._cache = {};
      this._cacheByIds = {};
    }
    allocate(pluginName, traitId, localId, name) {
      this.validateTraitId(traitId);
      const key = this.key(pluginName, traitId, localId);
      if (!this._cache[key]) {
        if (!uniqueDataIds[traitId]) {
          uniqueDataIds[traitId] = 0;
        }
        const dataId = uniqueDataIds[traitId];
        this._cache[key] = new UniqueTraitDataId(dataId, name);
        if (!this._cacheByIds[`${traitId}_${dataId}`]) {
          this._cacheByIds[`${traitId}_${dataId}`] = this._cache[key];
        }
        uniqueDataIds[traitId]++;
      }
      return this._cache[key];
    }
    validateTraitId(traitId) {
      if (traitIdsWithFixedDataIds.includes(traitId)) {
        throw new Error(`特徴ID: ${traitId} は拡張が許可されていません。`);
      }
    }
    key(pluginName, traitId, localId) {
      return `${pluginName}_${traitId}_${localId}`;
    }
    nameByIds(traitId, dataId) {
      const key = `${traitId}_${dataId}`;
      return this._cacheByIds[key] ? this._cacheByIds[key].name : undefined;
    }
  }
  class UniqueTraitDataId {
    constructor(id, name) {
      this._id = id;
      if (typeof name === 'function') {
        this._name = '';
        this._lazyName = name;
        lazyEvaluationTargets.push(this);
      } else {
        this._name = name;
      }
    }
    get id() {
      return this._id;
    }
    get name() {
      return this._name;
    }
    evaluateName() {
      this._name = this._lazyName();
    }
  }
  globalThis.uniqueTraitDataIdCache = new UniqueTraitDataIdCache();
  const lazyEvaluationTargets = [];
  function Scene_Boot_AllocateUniqueTraitDataIdMixIn(sceneBoot) {
    const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
    sceneBoot.onDatabaseLoaded = function () {
      _onDatabaseLoaded.call(this);
      this.evaluateUniqueTraitDataNames();
    };
    sceneBoot.evaluateUniqueTraitDataNames = function () {
      lazyEvaluationTargets.forEach((dataId) => dataId.evaluateName());
    };
  }
  Scene_Boot_AllocateUniqueTraitDataIdMixIn(Scene_Boot.prototype);
  function Scene_Equip_AllocateUniqueTraitDataIdMixIn(sceneEquip) {
    if ('equipFilterBuilder' in sceneEquip) {
      const _equipFilterBuilder = sceneEquip.equipFilterBuilder;
      sceneEquip.equipFilterBuilder = function (equips) {
        return _equipFilterBuilder.call(this, equips).withTraitToEffectNameRule((traitId, dataId) => {
          return uniqueTraitDataIdCache.nameByIds(traitId, dataId) || null;
        });
      };
    }
  }
  Scene_Equip_AllocateUniqueTraitDataIdMixIn(Scene_Equip.prototype);
})();
