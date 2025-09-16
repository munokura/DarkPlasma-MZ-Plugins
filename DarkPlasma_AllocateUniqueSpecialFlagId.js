// DarkPlasma_AllocateUniqueSpecialFlagId 1.1.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/11/04 1.1.0 非推奨化
 * 2024/03/02 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Reserve unique special flag feature IDs
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
This plugin is deprecated.
Please consider using DarkPlasma_AllocateUniqueTraitDataId.

Allocates and makes available the ID of a special flag trait.

This plugin does not function on its own.
Please use it together with other plugins that require it.

The following information is for plugin developers.
Submit a request to the uniqueSpecialFlagIdCache object.

uniqueSpecialFlagIdCache.allocate
: (pluginName: string, localId: number, name: string) => UniqueSpecialFlagId
Allocates a unique special flag ID for the plugin.

UniqueSpecialFlagId.prototype.id: number
Allocates the special flag ID.

UniqueSpecialFlagId.prototype.name: string
Name of the allocated special flag ID.

This plugin requires the following plugins.
DarkPlasma_AllocateUniqueTraitDataId version:1.1.0
If using with the following plugins, add this below.
DarkPlasma_AllocateUniqueTraitDataId

@param startIdOfUniqueSpecialFlagId
@text Unique special flag ID start point
@desc The starting ID for allocating your own special flag ID. If you don't know, leave it as is.
@type number
@default 11
*/

/*:ja
@plugindesc 独自の特殊フラグ特徴のIDを確保する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@base DarkPlasma_AllocateUniqueTraitDataId
@orderAfter DarkPlasma_AllocateUniqueTraitDataId

@param startIdOfUniqueSpecialFlagId
@desc 独自に特殊フラグIDを確保する際の始点ID。わからない場合はそのままにしてください。
@text 独自特殊フラグID始点
@type number
@default 11

@help
version: 1.1.0
本プラグインの利用は非推奨になりました。
  DarkPlasma_AllocateUniqueTraitDataId の利用を検討してください。

特殊フラグ特徴のIDを確保し、利用できるようにします。

本プラグインは単体では機能しません。
本プラグインを必要とする別のプラグインと一緒に利用してください。

以下、プラグインの開発者向けの情報です。
uniqueSpecialFlagIdCache オブジェクトに対してリクエストを投げてください。

uniqueSpecialFlagIdCache.allocate
  : (pluginName: string, localId: number, name: string) => UniqueSpecialFlagId
  プラグインで独自の特殊フラグIDを確保します。

UniqueSpecialFlagId.prototype.id: number
  確保した特殊フラグID

UniqueSpecialFlagId.prototype.name: string
  確保した特殊フラグIDの名前

本プラグインの利用には下記プラグインを必要とします。
DarkPlasma_AllocateUniqueTraitDataId version:1.1.0
下記プラグインと共に利用する場合、それよりも下に追加してください。
DarkPlasma_AllocateUniqueTraitDataId
*/

(() => {
  'use strict';

  class UniqueSpecialFlagIdCache {
    constructor() {}
    allocate(pluginName, localId, name) {
      return uniqueTraitDataIdCache.allocate(pluginName, Game_BattlerBase.TRAIT_SPECIAL_FLAG, localId, name);
    }
    key(pluginName, localId) {
      return `${pluginName}_${localId}`;
    }
    nameById(id) {
      return uniqueTraitDataIdCache.nameByIds(Game_BattlerBase.TRAIT_SPECIAL_FLAG, id);
    }
  }
  globalThis.uniqueSpecialFlagIdCache = new UniqueSpecialFlagIdCache();
})();
