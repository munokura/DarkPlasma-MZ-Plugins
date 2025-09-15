// DarkPlasma_ExtraBalloon 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/06/19 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Increase the number of speech bubble icons beyond 15
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
Sets and displays balloon IDs 16 and above.

By default, IDs 1 through 15 are assigned to default balloon images.
To register balloons beyond the 16th row in the default image,
set the end ID to 16 or higher in the settings.

Up to 85 IDs can be assigned per image.

By assigning an ID and specifying it in the plugin command,
you can display balloons with IDs 16 and above.

When this setting is ON, an additional plugin,
DarkPlasma_NamedExtendBalloon
, will be generated when test play begins.
The plugin command for the generated plugin
can select and display balloons based on the name set in this plugin.

@param ballonIdRangeList
@text Balloon ID assignment
@type struct<BalloonIdRange>[]
@default ["{\"image\":\"Balloon\",\"startId\":\"1\",\"endId\":\"15\",\"nameList\":\"[\\\"びっくり\\\",\\\"はてな\\\",\\\"音符\\\",\\\"怒り\\\",\\\"ハート\\\",\\\"汗\\\",\\\"くしゃくしゃ\\\",\\\"沈黙\\\",\\\"電球\\\",\\\"Zzz\\\",\\\"ユーザー定義1\\\",\\\"ユーザー定義2\\\",\\\"ユーザー定義3\\\",\\\"ユーザー定義4\\\",\\\"ユーザー定義5\\\"]\"}"]

@param generateAdditionalPlugin
@text Generate additional plugins
@desc If ON, an additional plugin will be generated when test play is started.
@type boolean
@default false

@command showBalloon
@text Speech bubble display
@desc Specify the ID to display the balloon.
@arg id
@text Speech bubble ID
@type number
@default 1

@arg targetType
@text Target characters
@desc Select the target for balloon display.
@type select
@default player
@option Player
@value player
@option This event
@value thisEvent
@option Other events
@value otherEvent

@arg targetEventId
@text Target event ID
@desc If you select Other Events for a character, specify the event ID.
@type number
@default 1

@arg wait
@text Wait until completion
@desc If ON, it will wait until the balloon display is complete.
@type boolean
@default false
*/

/*:ja
@plugindesc 吹き出しアイコンを15個を超えて増やす
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param ballonIdRangeList
@text フキダシID割当
@type struct<BalloonIdRange>[]
@default ["{\"image\":\"Balloon\",\"startId\":\"1\",\"endId\":\"15\",\"nameList\":\"[\\\"びっくり\\\",\\\"はてな\\\",\\\"音符\\\",\\\"怒り\\\",\\\"ハート\\\",\\\"汗\\\",\\\"くしゃくしゃ\\\",\\\"沈黙\\\",\\\"電球\\\",\\\"Zzz\\\",\\\"ユーザー定義1\\\",\\\"ユーザー定義2\\\",\\\"ユーザー定義3\\\",\\\"ユーザー定義4\\\",\\\"ユーザー定義5\\\"]\"}"]

@param generateAdditionalPlugin
@desc ONの場合、テストプレイ起動時に追加プラグインを生成します。
@text 追加プラグイン生成
@type boolean
@default false

@command showBalloon
@text フキダシ表示
@desc IDを指定してフキダシを表示します。
@arg id
@text フキダシID
@type number
@default 1
@arg targetType
@text 対象キャラクター
@desc フキダシ表示対象を選択します。
@type select
@option プレイヤー
@value player
@option このイベント
@value thisEvent
@option その他イベント
@value otherEvent
@default player
@arg targetEventId
@text 対象イベントID
@desc キャラクターにその他イベントを選択した場合、イベントIDを指定します。
@type number
@default 1
@arg wait
@text 完了までウェイト
@desc ONの場合、フキダシ表示完了までウェイトします。
@type boolean
@default false

@help
version: 1.0.0
フキダシID16以降を設定し、表示できるようにします。

デフォルト設定では、デフォルトフキダシ画像にID1から15が割り当てられています。
デフォルト画像に16行目以降のバルーンを登録する場合、
設定で終了IDを16以上の値にしてください。

1画像につき、85個までIDを割り当てることができます。

IDを割り当て、プラグインコマンドでそのIDを指定することで
ID16以降のフキダシを表示できます。

設定をONにすると、テストプレイ開始時に追加プラグイン
DarkPlasma_NamedExtendBalloon
が生成されます。
生成されたプラグインのプラグインコマンドでは、
本プラグインで設定した名前をベースにフキダシを選択して表示できます。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_showBalloon(args) {
    return {
      id: Number(args.id || 1),
      targetType: String(args.targetType || 'player'),
      targetEventId: Number(args.targetEventId || 1),
      wait: String(args.wait || false) === 'true',
    };
  }

  const command_showBalloon = 'showBalloon';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    ballonIdRangeList: JSON.parse(
      pluginParameters.ballonIdRangeList ||
        '[{"image":"Balloon","startId":"1","endId":"15","nameList":["びっくり","はてな","音符","怒り","ハート","汗","くしゃくしゃ","沈黙","電球","Zzz","ユーザー定義1","ユーザー定義2","ユーザー定義3","ユーザー定義4","ユーザー定義5"]}]'
    ).map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          image: String(parsed.image || 'Balloon'),
          startId: Number(parsed.startId || 0),
          endId: Number(parsed.endId || 0),
          nameList: JSON.parse(parsed.nameList || '[]').map((e) => {
            return String(e || '');
          }),
        };
      })(e || '{}');
    }),
    generateAdditionalPlugin: String(pluginParameters.generateAdditionalPlugin || false) === 'true',
  };

  const TARGET_TYPE = {
    PLAYER: 'player',
    THIS: 'thisEvent',
    OTHER: 'otherEvent',
  };

  const NAMED_EXTRA_BALLOON_PLUGIN = 'DarkPlasma_NamedExtraBalloon';

  PluginManager.registerCommand(pluginName, command_showBalloon, function (args) {
    const parsedArgs = parseArgs_showBalloon(args);
    const target = (() => {
      switch (parsedArgs.targetType) {
        case TARGET_TYPE.PLAYER:
          return this.character(-1);
        case TARGET_TYPE.THIS:
          return this.character(this._eventId);
        case TARGET_TYPE.OTHER:
          return this.character(parsedArgs.targetEventId);
      }
    })();
    if (target) {
      $gameTemp.requestBalloon(target, parsedArgs.id);
      if (parsedArgs.wait) {
        this.setWaitMode('balloon');
      }
    }
  });

  /**
   * 追加プラグインのためのラッパーコマンド登録
   */
  PluginManager.registerCommand(NAMED_EXTRA_BALLOON_PLUGIN, command_showBalloon, function (args) {
    PluginManager.callCommand(this, pluginName, command_showBalloon, args);
  });

  /**
   * @param {{nameList: string[], startId: number}} idRange
   * @return {string}
   */
  function generateOptionAndValue(idRange) {
    return idRange.nameList.map((name, index) => {
      return ` * @option ${name}
 * @value ${index + idRange.startId}`;
    });
  }

  /**
   * @param {Scene_Boot.prototype} sceneBoot
   */
  function Scene_Boot_ExtraBalloonMixIn(sceneBoot) {
    const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
    sceneBoot.onDatabaseLoaded = function () {
      _onDatabaseLoaded.call(this);
      if (Utils.isOptionValid('test') && Utils.isNwjs() && settings.generateAdditionalPlugin) {
        this.generateNamedExtraBalloonPlugin();
      }
    };

    sceneBoot.generateNamedExtraBalloonPlugin = function () {
      /**
       * ひとまず日本語のみ対応
       * 二重管理になっているので、多言語対応する際はこのあたりもうちょっとうまくやりたい
       */
      const command = `*:ja
 * @plugindesc フキダシアイコンを名前選択して表示する
 * @author DarkPlasma
 *
 * @target MZ
 *
 * @command ${command_showBalloon}
 * @text フキダシ表示
 * @desc フキダシ名を選択して表示します。
 * @arg id
 * @type select
${settings.ballonIdRangeList
  .map((idRange) => generateOptionAndValue(idRange))
  .flat()
  .join('\n')}
 * @arg targetType
 * @text 対象キャラクター
 * @desc フキダシ表示対象を選択します。
 * @type select
 * @option プレイヤー
 * @value ${TARGET_TYPE.PLAYER}
 * @option このイベント
 * @value ${TARGET_TYPE.THIS}
 * @option その他イベント
 * @value ${TARGET_TYPE.OTHER}
 * @default ${TARGET_TYPE.PLAYER}
 * @arg targetEventId
 * @text 対象イベントID
 * @desc キャラクターにその他イベントを選択した場合、イベントIDを指定します。
 * @type number
 * @default 1
 * @arg wait
 * @text 完了までウェイト
 * @desc ONの場合、フキダシ表示完了までウェイトします。
 * @type boolean
 * @default false
 * 
 * @base DarkPlasma_ExtraBalloon
 * 
 * @help
 * 本プラグインは DarkPlasma_ExtraBalloon.js によって生成されました。
 * DarkPlasma_ExtraBalloon.js で定義されたフキダシを
 * 名前を選択して表示するプラグインコマンドを提供します。
 */`;
      const fs = require('fs');
      /**
       * /を含めるとエディタのパースに引っかかってしまうため、ここで合成
       */
      fs.writeFileSync(`./js/plugins/DarkPlasma_NamedExtraBalloon.js`, `/${command}`);
    };
  }

  Scene_Boot_ExtraBalloonMixIn(Scene_Boot.prototype);

  /**
   * @param {Sprite_Balloon.prototype} spriteBalloon
   */
  function Sprite_Balloon_ExtraBalloonMixIn(spriteBalloon) {
    /**
     * ID割当を再定義するため上書き
     */
    spriteBalloon.loadBitmap = function () {
      /**
       * 初回は必ずID0で呼ばれる
       */
      if (this._balloonId === 0) {
        return;
      }
      const idRange = this.idRange();
      if (!idRange) {
        throw Error(`無効なフキダシID: ${this._balloonId}`);
      }
      this.bitmap = ImageManager.loadSystem(idRange.image);
      this.setFrame(0, 0, 0, 0);
    };

    const _setup = spriteBalloon.setup;
    spriteBalloon.setup = function (targetSprite, balloonId) {
      _setup.call(this, targetSprite, balloonId);
      this.loadBitmap();
    };

    spriteBalloon.idRange = function () {
      return settings.ballonIdRangeList.find(
        (idRange) => idRange.startId <= this._balloonId && this._balloonId <= idRange.endId
      );
    };

    spriteBalloon.startId = function () {
      return this.idRange().startId;
    };

    /**
     * ID拡張のため上書き
     */
    spriteBalloon.updateFrame = function () {
      const w = 48;
      const h = 48;
      const sx = this.frameIndex() * w;
      const sy = (this._balloonId - this.startId()) * h;
      this.setFrame(sx, sy, w, h);
    };
  }

  Sprite_Balloon_ExtraBalloonMixIn(Sprite_Balloon.prototype);
})();
