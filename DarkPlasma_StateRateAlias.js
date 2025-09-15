// DarkPlasma_StateRateAlias 1.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/11/17 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc A state that references the validity and invalidity flags of another state
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
You can create states that reference the validity and invalidity flags of
other states.
Enter the stateRateAlias tag in the memo field.

Example:
<stateRateAlias:4>
References the validity and invalidity flags of the state with state ID 4.
*/

/*:ja
@plugindesc 別ステートの有効度及び無効フラグを参照するステート
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.0.0
異なるステートの有効度及び無効フラグを参照するステートを作成できます。
メモ欄に stateRateAlias タグを記述してください。

記述例:
<stateRateAlias:4>
ステートID4のステートの有効度及び無効フラグを参照します。
*/

(() => {
  'use strict';

  const _Game_BattlerBase_stateRate = Game_BattlerBase.prototype.stateRate;
  Game_BattlerBase.prototype.stateRate = function (stateId) {
    return _Game_BattlerBase_stateRate.call(this, rateAliasedStateId(stateId));
  };

  const _Game_BattlerBase_isStateResist = Game_BattlerBase.prototype.isStateResist;
  Game_BattlerBase.prototype.isStateResist = function (stateId) {
    return _Game_BattlerBase_isStateResist.call(this, rateAliasedStateId(stateId));
  };

  /**
   * @param {number} stateId
   * @return {number}
   */
  function rateAliasedStateId(stateId) {
    const state = $dataStates[stateId];
    return state.meta.stateRateAlias ? Number(state.meta.stateRateAlias) : stateId;
  }
})();
