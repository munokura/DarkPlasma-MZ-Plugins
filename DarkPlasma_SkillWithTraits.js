// DarkPlasma_SkillWithTraits 1.1.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/10/23 1.1.0 特徴付きスキル一覧を取得するインターフェース公開
 * 2023/10/14 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Specialized Skills
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
This allows you to acquire skills that gain traits simply by learning them.
This does not affect skills added by traits.

Enter the following in the skill's memo field:
<traits:actor/1>
Gain the same traits as actor ID 1.

<traits:class/1>
Gain the same traits as class ID 1.

<traits:weapon/1>
Gain the same traits as weapon ID 1.

<traits:armor/1>
Gain the same traits as armor ID 1.

<traits:state/1>
Gain the same traits as state ID 1.
*/

/*:ja
@plugindesc 特徴付きスキル
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.1.0
習得しているだけで特徴が得られるスキルを実現します。
特徴によって追加されたスキルには効果がありません。

スキルのメモ欄に以下のように記述してください。
<traits:actor/1>
アクターID1と同じ特徴を得ます。

<traits:class/1>
職業ID1と同じ特徴を得ます。

<traits:weapon/1>
武器ID1と同じ特徴を得ます。

<traits:armor/1>
防具ID1と同じ特徴を得ます。

<traits:state/1>
ステートID1と同じ特徴を得ます。
*/

(() => {
  'use strict';

  function Game_Actor_SkillWithTraitsMixin(gameActor) {
    const _traitObjects = gameActor.traitObjects;
    gameActor.traitObjects = function () {
      return _traitObjects.call(this).concat(this.traitObjectsBySkill());
    };
    gameActor.skillsWithTrait = function () {
      return this._skills.map((skillId) => $dataSkills[skillId]).filter((skill) => skill.meta.traits);
    };
    gameActor.traitObjectsBySkill = function () {
      return this.skillsWithTrait()
        .map((skill) => {
          const t = String(skill.meta.traits).split('/');
          switch (t[0]) {
            case 'actor':
              return $dataActors[Number(t[1])];
            case 'class':
              return $dataClasses[Number(t[1])];
            case 'weapon':
              return $dataWeapons[Number(t[1])];
            case 'armor':
              return $dataArmors[Number(t[1])];
            case 'state':
              return $dataStates[Number(t[1])];
            default:
              return undefined;
          }
        })
        .filter((object) => !!object && 'traits' in object);
    };
  }
  Game_Actor_SkillWithTraitsMixin(Game_Actor.prototype);
})();
