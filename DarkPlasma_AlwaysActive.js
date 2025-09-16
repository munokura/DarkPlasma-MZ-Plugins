// DarkPlasma_AlwaysActive 1.0.1
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/02/23 1.0.1 TypeScript移行
 *                  デフォルト言語を設定
 * 2021/12/11 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Keep the game running even when the window is inactive
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

version: 1.0.1
The game doesn't stop even if the window is inactive.
*/

/*:ja
@plugindesc ウィンドウが非アクティブの時にもゲームを止めなくする
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.0.1
ウィンドウが非アクティブの場合にもゲームを止めません。
*/

(() => {
  'use strict';

  SceneManager.isGameActive = function () {
    return true;
  };
})();
