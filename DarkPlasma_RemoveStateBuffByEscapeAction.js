// DarkPlasma_RemoveStateBuffByEscapeAction 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/08/13 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Escape action removes status, strengthening, and debuffs
@author DarkPlasma
@license MIT

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
-----

version: 1.0.0
Special Effect: Determines whether or not to remove states, buffs, or debuffs
when escaping through an action with the "escape" effect.

If you enter <removeByEscapeAction:false> in the memo field,
the target state will not be removed by the escape action.

When a state is removed by an escape action, a message for removal will not be
displayed.

@param removeBuffByEscapeAction
@text Remove buffs and debuffs by fleeing
@desc Removes buffs and debuffs from a fleeing battler.
@type boolean
@default false
*/

/*:ja
@plugindesc 逃走行動によってステート・強化・弱体解除
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param removeBuffByEscapeAction
@desc 逃走行動したバトラーの強化・弱体をその場で解除します。
@text 逃走行動で強化・弱体を解除
@type boolean
@default false

@help
version: 1.0.0
特殊効果 逃げるの効果を持つ行動によって逃走した際、
ステートや強化・弱体を解除するかどうかを設定します。

メモ欄に <removeByEscapeAction:false> と記述した場合、
対象のステートは逃走行動によって解除されません。

逃走行動によってステートが解除される際、解除用メッセージを表示しません。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    removeBuffByEscapeAction: String(pluginParameters.removeBuffByEscapeAction || false) === 'true',
  };

  /**
   * @param {typeof DataManager} dataManager
   */
  function DataManager_RemoveStateByEscapeActionMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ($dataStates && $dataStates.contains(data)) {
        data.removeByEscapeAction = data.meta.removeByEscapeAction !== 'false';
      }
    };
  }

  DataManager_RemoveStateByEscapeActionMixIn(DataManager);

  /**
   * @param {Game_Battler.prototype} gameBattler
   */
  function Game_Battler_RemoveStateBuffByEscapeActionMixIn(gameBattler) {
    const _escape = gameBattler.escape;
    gameBattler.escape = function () {
      if (settings.removeBuffByEscapeAction) {
        const evacuatedResultPushRemovedBuff = this._result.pushRemovedBuff;
        /**
         * 逃走時にバフを消去した旨をバトルログに出さない
         */
        this._result.pushRemovedBuff = () => {};
        this.removeAllBuffs();
        this._result.pushRemovedBuff = evacuatedResultPushRemovedBuff;
      }
      const evacuatedClearStates = this.clearStates;
      this.clearStates = this.removeStatesByEscapeAction;
      const evacuatedResultPushRemovedState = this._result.pushRemovedState;
      this._result.pushRemovedState = () => {};
      _escape.call(this);
      this.clearStates = evacuatedClearStates;
      this._result.pushRemovedState = evacuatedResultPushRemovedState;
    };

    gameBattler.removeStatesByEscapeAction = function () {
      this.states()
        .filter((state) => state.removeByEscapeAction)
        .forEach((state) => this.removeState(state.id));
    };
  }

  Game_Battler_RemoveStateBuffByEscapeActionMixIn(Game_Battler.prototype);
})();
