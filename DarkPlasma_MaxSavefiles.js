// DarkPlasma_MaxSavefiles 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/07/27 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Change the maximum number of save files
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
Changes the maximum number of save files that can be created.

@param maxSavefiles
@text Number of save files
@desc Sets the maximum number of save files that can be created.
@type number
@default 20
*/

/*:ja
@plugindesc セーブファイルの最大数を変更する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param maxSavefiles
@desc セーブファイルを作れる最大数を設定します。
@text セーブファイル数
@type number
@default 20

@help
version: 1.0.0
セーブファイルを作れる最大数を変更します。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    maxSavefiles: Number(pluginParameters.maxSavefiles || 20),
  };

  function DataManager_MaxSavefilesMixIn(dataManager) {
    dataManager.maxSavefiles = function () {
      return settings.maxSavefiles;
    };
  }
  DataManager_MaxSavefilesMixIn(DataManager);
})();
