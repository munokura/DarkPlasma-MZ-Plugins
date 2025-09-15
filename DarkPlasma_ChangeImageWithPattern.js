// DarkPlasma_ChangeImageWithPattern 1.0.1
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/06/13 1.0.1 導入前のセーブデータをロードするとエラーになる不具合の修正
 * 2024/06/07 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Change the image to set the orientation or pattern
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
Allows you to change the orientation and pattern of the image.

@command hackChangeImage
@text Image Change Custom
@desc Customize the target image change command.
@arg target
@text subject
@desc Choose what you want to customize to change the picture.
@type select
@default 0
@option Player
@value -1
@option This event
@value 0
@option Other events
@value 1

@arg targetEventId
@text Target event ID
@desc If the target is another event, set the target event ID.
@type number
@default 0

@arg direction
@desc Change the image to set the character's orientation.
@type select
@default 0
@option Do not change
@value 0
@option under
@value 2
@option left
@value 4
@option right
@value 6
@option above
@value 8

@arg pattern
@desc Change the image to set the character's pattern.
@type select
@default 1
@option left
@value 0
@option middle
@value 1
@option right
@value 2

@arg fixPattern
@text Pinning the pattern
@desc Fix the character pattern by changing the image.
@type boolean
@default true

@command unfixPattern
@text Unlocking the pattern
@desc Cancels the pattern lock state.
@arg target
@text subject
@desc Choose what you want to customize to change the picture.
@type select
@default 0
@option Player
@value -1
@option This event
@value 0
@option Other events
@value 1

@arg targetEventId
@text Target event ID
@desc If the target is another event, set the target event ID.
@type number
@default 0
*/

/*:ja
@plugindesc 画像の変更で向きやパターンを設定する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@command hackChangeImage
@text 画像の変更カスタム
@desc 対象の画像の変更コマンドをカスタマイズします。
@arg target
@desc 画像の変更をカスタマイズする対象を選びます。
@text 対象
@type select
@option プレイヤー
@value -1
@option このイベント
@value 0
@option 他のイベント
@value 1
@default 0
@arg targetEventId
@desc 対象が他のイベントの場合のみ、対象となるイベントIDを設定します。
@text 対象イベントID
@type number
@default 0
@arg direction
@desc 画像の変更によって、キャラクターの向きを設定します。
@text 向き
@type select
@option 変更しない
@value 0
@option 下
@value 2
@option 左
@value 4
@option 右
@value 6
@option 上
@value 8
@default 0
@arg pattern
@desc 画像の変更によって、キャラクターのパターンを設定します。
@text パターン
@type select
@option 左
@value 0
@option 真ん中
@value 1
@option 右
@value 2
@default 1
@arg fixPattern
@desc 画像の変更によってキャラクターのパターンを固定します。
@text パターンを固定する
@type boolean
@default true

@command unfixPattern
@text パターン固定の解除
@desc パターン固定状態を解除します。
@arg target
@desc 画像の変更をカスタマイズする対象を選びます。
@text 対象
@type select
@option プレイヤー
@value -1
@option このイベント
@value 0
@option 他のイベント
@value 1
@default 0
@arg targetEventId
@desc 対象が他のイベントの場合のみ、対象となるイベントIDを設定します。
@text 対象イベントID
@type number
@default 0

@help
version: 1.0.1
画像の変更で向きやパターンを設定できるようにします。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_hackChangeImage(args) {
    return {
      target: Number(args.target || 0),
      targetEventId: Number(args.targetEventId || 0),
      direction: Number(args.direction || 0),
      pattern: Number(args.pattern || 1),
      fixPattern: String(args.fixPattern || true) === 'true',
    };
  }

  function parseArgs_unfixPattern(args) {
    return {
      target: Number(args.target || 0),
      targetEventId: Number(args.targetEventId || 0),
    };
  }

  const command_hackChangeImage = 'hackChangeImage';

  const command_unfixPattern = 'unfixPattern';

  PluginManager.registerCommand(pluginName, command_hackChangeImage, function (args) {
    const parsedArgs = parseArgs_hackChangeImage(args);
    const target =
      parsedArgs.target === 1 ? this.character(parsedArgs.targetEventId) : this.character(parsedArgs.target);
    target?.setChangeImageWith({
      direction: parsedArgs.direction,
      pattern: parsedArgs.pattern,
      fixPattern: parsedArgs.fixPattern,
    });
  });
  PluginManager.registerCommand(pluginName, command_unfixPattern, function (args) {
    const parsedArgs = parseArgs_unfixPattern(args);
    const target =
      parsedArgs.target === 1 ? this.character(parsedArgs.targetEventId) : this.character(parsedArgs.target);
    target?.unfixPattern();
  });
  function Game_Character_ChangeImageWithPatternMixIn(gameCharacter) {
    const _initMembers = gameCharacter.initMembers;
    gameCharacter.initMembers = function () {
      _initMembers.call(this);
      this._changeImageWith = this.changeImageWith();
      this._isPatternFixed = false;
    };
    gameCharacter.changeImageWith = function () {
      return (
        this._changeImageWith || {
          direction: 0,
          pattern: 1,
          fixPattern: false,
        }
      );
    };
    gameCharacter.setChangeImageWith = function (changeImageWith) {
      this._changeImageWith = changeImageWith;
    };
    gameCharacter.setChangeImageWithDirection = function (direction) {
      this._changeImageWith = this.changeImageWith();
      this._changeImageWith.direction = direction;
    };
    gameCharacter.setChangeImageWithPattern = function (pattern) {
      this._changeImageWith = this.changeImageWith();
      this._changeImageWith.pattern = pattern;
    };
    gameCharacter.setChangeImageWithFixPattern = function (fixPattern) {
      this._changeImageWith = this.changeImageWith();
      this._changeImageWith.fixPattern = fixPattern;
    };
    const _processMoveCommand = gameCharacter.processMoveCommand;
    gameCharacter.processMoveCommand = function (command) {
      _processMoveCommand.call(this, command);
      if (command.code === Game_Character.ROUTE_CHANGE_IMAGE) {
        if (this.changeImageWith().direction) {
          /**
           * 明示的に指定するため、向き固定を貫通する
           */
          const isDirectionFixed = this.isDirectionFixed();
          this.setDirectionFix(false);
          this.setDirection(this.changeImageWith().direction);
          this.setDirectionFix(isDirectionFixed);
        }
        this.setPattern(this.changeImageWith().pattern);
        if (this.changeImageWith().fixPattern) {
          this.fixPattern();
        }
      }
    };
    const _updatePattern = gameCharacter.updatePattern;
    gameCharacter.updatePattern = function () {
      if (this.isPatternFixed()) {
        return;
      }
      _updatePattern.call(this);
    };
    gameCharacter.isPatternFixed = function () {
      return this._isPatternFixed;
    };
    gameCharacter.fixPattern = function () {
      this._isPatternFixed = true;
    };
    gameCharacter.unfixPattern = function () {
      this._isPatternFixed = false;
    };
  }
  Game_Character_ChangeImageWithPatternMixIn(Game_Character.prototype);
})();
