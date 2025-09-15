// DarkPlasma_SelfDestructingEffect 1.0.1
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/10/06 1.0.1 依存関係を明記
 * 2024/09/27 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Usage effect: Self-destruction
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

version: 1.0.1
Implements the self-destruct effect.
Setting this effect on a skill or item will incapacitate the user.

It can be set using the following notetag:
<selfDestructing>

This plugin requires the following plugin:
DarkPlasma_AllocateUniqueEffectCode version:1.0.1
If using with the following plugin, add it below it:
DarkPlasma_AllocateUniqueEffectCode
*/

/*:ja
@plugindesc 使用効果 自滅
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@base DarkPlasma_AllocateUniqueEffectCode
@orderAfter DarkPlasma_AllocateUniqueEffectCode

@help
version: 1.0.1
使用効果 自滅を実装します。
この使用効果をスキルやアイテムに設定すると、使用者を戦闘不能にします。

以下のメモタグで設定することができます。
<selfDestructing>

本プラグインの利用には下記プラグインを必要とします。
DarkPlasma_AllocateUniqueEffectCode version:1.0.1
下記プラグインと共に利用する場合、それよりも下に追加してください。
DarkPlasma_AllocateUniqueEffectCode
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const selfDestructingEffect = uniqueEffectCodeCache.allocate(pluginName, 0);
  function DataManager_SelfDestructingMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('effects' in data && data.meta.selfDestructing) {
        data.effects.push({
          code: selfDestructingEffect.code,
          dataId: 0,
          value1: 0,
          value2: 0,
        });
      }
    };
  }
  DataManager_SelfDestructingMixIn(DataManager);
  function Game_Action_SelfDestructingMixIn(gameAction) {
    const _testItemEffect = gameAction.testItemEffect;
    gameAction.testItemEffect = function (target, effect) {
      if (effect.code === selfDestructingEffect.code) {
        return this.subject().isAlive();
      }
      return _testItemEffect.call(this, target, effect);
    };
    const _applyItemEffect = gameAction.applyItemEffect;
    gameAction.applyItemEffect = function (target, effect) {
      if (effect.code === selfDestructingEffect.code) {
        this.subject().die();
        this.subject().refresh();
        this.subject().performCollapse();
      }
      _applyItemEffect.call(this, target, effect);
    };
  }
  Game_Action_SelfDestructingMixIn(Game_Action.prototype);
})();
