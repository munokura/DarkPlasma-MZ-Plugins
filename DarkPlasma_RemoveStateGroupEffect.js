// DarkPlasma_RemoveStateGroupEffect 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/08/11 1.0.0 最初のバージョン
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Effect: Removes the state belonging to the specified group.
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

version: 1.0.0
This effect removes states belonging to a specified group.
Write the following in the memo field of a skill or item:
<removeStateGroup: x>
Removes states belonging to group x.

Use DarkPlasma_StateGroup2 to set the group.

This plugin requires the following plugin:
DarkPlasma_StateGroup2 version:2.0.0
DarkPlasma_AllocateUniqueEffectCode version:1.0.1
If using with the following plugin, add it below it:
DarkPlasma_AllocateUniqueEffectCode
*/

/*:ja
@plugindesc 使用効果 指定グループに属するステート解除
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@base DarkPlasma_StateGroup2
@base DarkPlasma_AllocateUniqueEffectCode
@orderAfter DarkPlasma_AllocateUniqueEffectCode

@help
version: 1.0.0
指定グループに属するステートを解除する使用効果を実現します。
スキルやアイテムのメモ欄に、以下のように記述します。
<removeStateGroup: x>
グループxに属するステートを解除します。

グループの設定には DarkPlasma_StateGroup2 をご利用ください。

本プラグインの利用には下記プラグインを必要とします。
DarkPlasma_StateGroup2 version:2.0.0
DarkPlasma_AllocateUniqueEffectCode version:1.0.1
下記プラグインと共に利用する場合、それよりも下に追加してください。
DarkPlasma_AllocateUniqueEffectCode
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const removeStateGroupEffect = uniqueEffectCodeCache.allocate(pluginName, 0);
  function DataManager_RemoveStateGroupEffectMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('effects' in data && data.meta.removeStateGroup) {
        const groupName = String(data.meta.removeStateGroup).trim();
        data.effects.push({
          code: removeStateGroupEffect.code,
          dataId: this.allocateStateGroup(groupName).id,
          value1: 0,
          value2: 0,
        });
      }
    };
  }
  DataManager_RemoveStateGroupEffectMixIn(DataManager);
  function Game_Action_RemoveStateGroupEffectMixIn(gameAction) {
    const _testItemEffect = gameAction.testItemEffect;
    gameAction.testItemEffect = function (target, effect) {
      if (effect.code === removeStateGroupEffect.code) {
        return target.isStateGroupAffected(effect.dataId);
      }
      return _testItemEffect.call(this, target, effect);
    };
    const _applyItemEffect = gameAction.applyItemEffect;
    gameAction.applyItemEffect = function (target, effect) {
      _applyItemEffect.call(this, target, effect);
      if (effect.code === removeStateGroupEffect.code) {
        this.itemEffectRemoveStateGroup(target, effect);
      }
    };
    gameAction.itemEffectRemoveStateGroup = function (target, effect) {
      DataManager.stateGroup(effect.dataId)?.stateIds.forEach((stateId) => {
        target.removeState(stateId);
      });
      this.makeSuccess(target);
    };
  }
  Game_Action_RemoveStateGroupEffectMixIn(Game_Action.prototype);
})();
