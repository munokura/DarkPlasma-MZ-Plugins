// DarkPlasma_ItemWithPartyTraits 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/12/01 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc An item that gives each member of your party a unique character just by having it.
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
This item grants traits to all party members simply by possessing it.
Traits will not be duplicated even if multiple items are possessed.

Enter the following in the item's memo field:
<partyTraits:actor/1>
Gain the same traits as actor ID 1.

<partyTraits:class/1>
Gain the same traits as class ID 1.

<partyTraits:weapon/1>
Gain the same traits as weapon ID 1.

<partyTraits:armor/1>
Gain the same traits as armor ID 1.

<partyTraits:state/1>
Gain the same traits as state ID 1.
*/

/*:ja
@plugindesc 持っているだけでパーティ全員に特徴を持たせるアイテム
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.0.0
所持しているだけでパーティメンバー全員が特徴を得るアイテムを実現します。
複数個所持していても特徴は重複しません。

アイテムのメモ欄に以下のように記述してください。
<partyTraits:actor/1>
アクターID1と同じ特徴を得ます。

<partyTraits:class/1>
職業ID1と同じ特徴を得ます。

<partyTraits:weapon/1>
武器ID1と同じ特徴を得ます。

<partyTraits:armor/1>
防具ID1と同じ特徴を得ます。

<partyTraits:state/1>
ステートID1と同じ特徴を得ます。
*/

(() => {
  'use strict';

  function Game_Party_ItemWithPartyTraitsMixIn(gameParty) {
    gameParty.itemsWithPartyTrait = function () {
      return this.items().filter((item) => item.meta.partyTraits);
    };
  }
  Game_Party_ItemWithPartyTraitsMixIn(Game_Party.prototype);
  function Game_Actor_ItemWithPartyTraitsMixIn(gameActor) {
    const _traitObjects = gameActor.traitObjects;
    gameActor.traitObjects = function () {
      return _traitObjects.call(this).concat(this.traitObjectsByItem());
    };
    gameActor.traitObjectsByItem = function () {
      return $gameParty
        .itemsWithPartyTrait()
        .map((item) => {
          const t = String(item.meta.partyTraits).split('/');
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
  Game_Actor_ItemWithPartyTraitsMixIn(Game_Actor.prototype);
})();
