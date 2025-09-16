// DarkPlasma_EnemyLevel 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/09/16 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Set the enemy character's level
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
You can now set enemy character levels.

By entering the following in an enemy character's memo field,
the enemy character's level will be set to 1.
<level:1>

By entering b.level when calculating skill damage,
you can create a formula based on the target's level.

@param defaultLevel
@text Default Level
@type number
@default 1
*/

/*:ja
@plugindesc 敵キャラにレベルを設定する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param defaultLevel
@text デフォルトレベル
@type number
@default 1

@help
version: 1.0.0
敵キャラにレベルを設定できるようになります。

敵キャラのメモ欄に以下のように記述すると、
その敵キャラのレベルは1になります。
<level:1>

スキルのダメージ計算などに b.level と書けば、
対象のレベルに応じた計算式を作ることができます。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    defaultLevel: Number(pluginParameters.defaultLevel || 1),
  };

  function Game_Enemy_LevelMixIn(gameEnemy) {
    Object.defineProperty(gameEnemy, 'level', {
      get: function () {
        return this._level;
      },
      configurable: true,
    });
    const _setup = gameEnemy.setup;
    gameEnemy.setup = function (enemyId, x, y) {
      this._level = Number($dataEnemies[enemyId].meta.level || settings.defaultLevel);
      _setup.call(this, enemyId, x, y);
    };
  }
  Game_Enemy_LevelMixIn(Game_Enemy.prototype);
})();
