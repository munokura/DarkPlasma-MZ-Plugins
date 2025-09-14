// DarkPlasma_SkillCostExtensionTraits 1.0.2
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2021/01/11 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Feature settings for skill cost extension plugin
@author DarkPlasma
@license MIT

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
-----

version: 1.0.2
Adds feature settings for the Skill Cost Extension plugin.

Add settings to the memo field for the actor, job, or equipment using the
following syntax:

<hpCostRate:n>
HP Consumption Rate
Multiplies the HP consumed by the skill by a percentage. The default is n=1.

This plugin requires the following plugin:
DarkPlasma_SkillCostExtension
If using with the following plugin, add this plugin below it.
DarkPlasma_SkillCostExtension
*/

/*:ja
@plugindesc スキルコスト拡張プラグインに関する特徴設定
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@base DarkPlasma_SkillCostExtension
@orderAfter DarkPlasma_SkillCostExtension

@help
version: 1.0.2
スキルコスト拡張プラグインに関する特徴設定を追加します。

アクター、職業、装備のメモ欄に下記の記法で設定を追加します。

<hpCostRate:n>
 HP消費率
 スキルで消費するHP量に割合をかけます。デフォルトはn=1です。

本プラグインの利用には下記プラグインを必要とします。
DarkPlasma_SkillCostExtension
下記プラグインと共に利用する場合、それよりも下に追加してください。
DarkPlasma_SkillCostExtension
*/

(() => {
  'use strict';

  Game_BattlerBase.prototype.hpCostRate = function () {
    return this.traitObjects()
      .reduce((result, object) => result.concat(object.meta.hpCostRate), [])
      .filter((hpCostRate) => !!hpCostRate)
      .reduce((result, hpCostRate) => result * Number(hpCostRate), 1);
  };
})();
