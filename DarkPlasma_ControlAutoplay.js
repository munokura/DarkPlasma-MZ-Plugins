// DarkPlasma_ControlAutoplay 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/03/19 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Controlling the automatic playing of the map's BGM/BGS
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
Auto-play of the BGM/BGS set for the map will be disabled
only while the selected switch is ON.

Auto-play of the BGM/BGS will not start even if you move to the target map
while the selected switch is ON.

@param disableAutoplayBgmSwitch
@text BGM autoplay disable switch
@type switch
@default 0

@param disableAutoplayBgsSwitch
@text BGS autoplay disable switch
@type switch
@default 0
*/

/*:ja
@plugindesc マップのBGM/BGSの自動演奏を制御する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param disableAutoplayBgmSwitch
@text BGM自動演奏無効スイッチ
@type switch
@default 0

@param disableAutoplayBgsSwitch
@text BGS自動演奏無効スイッチ
@type switch
@default 0

@help
version: 1.0.0
マップに設定したBGM/BGSの自動再生を
設定したスイッチがONの間だけ無効にします。

設定したスイッチがONの間に対象マップに移動しても
BGM/BGSの自動演奏は開始されません。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    disableAutoplayBgmSwitch: Number(pluginParameters.disableAutoplayBgmSwitch || 0),
    disableAutoplayBgsSwitch: Number(pluginParameters.disableAutoplayBgsSwitch || 0),
  };

  function Game_Map_ControlAutoPlayMixIn(gameMap) {
    /**
     * コードをシンプルにするために上書き
     */
    gameMap.autoplay = function () {
      if (this.isAutoplayBgmEnabled()) {
        if ($gamePlayer.isInVehicle()) {
          $gameSystem.saveWalkingBgm2();
        } else {
          AudioManager.playBgm($dataMap.bgm);
        }
      }
      if (this.isAutoplayBgsEnabled()) {
        AudioManager.playBgs($dataMap.bgs);
      }
    };
    gameMap.isAutoplayBgmEnabled = function () {
      return (
        !!$dataMap?.autoplayBgm &&
        (!settings.disableAutoplayBgmSwitch || !$gameSwitches.value(settings.disableAutoplayBgmSwitch))
      );
    };
    gameMap.isAutoplayBgsEnabled = function () {
      return (
        !!$dataMap?.autoplayBgs &&
        (!settings.disableAutoplayBgsSwitch || !$gameSwitches.value(settings.disableAutoplayBgsSwitch))
      );
    };
  }
  Game_Map_ControlAutoPlayMixIn(Game_Map.prototype);
})();
