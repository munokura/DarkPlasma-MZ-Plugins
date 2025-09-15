// DarkPlasma_RandomTroop 1.1.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/12/19 1.1.0 種別による敵キャラデータ一覧取得インターフェース追加
 * 2023/10/24 1.0.2 ランダム出現フラグのキャッシュが戦闘ごとにクリアされない不具合を修正
 *            1.0.1 DarkPlasma_EnemyBookとの依存関係を明記
 * 2023/08/21 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Randomized enemy group composition
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

version: 1.1.0
Enemy Group Battle Event Settings
By setting plugin commands on the first page,
the enemy group composition will be randomly determined based on your
settings.

You can specify any number of slots, and the appearance check will be
performed for the specified number.
When a slot is determined to appear,
one enemy character will appear randomly from the enemy character list
included in that slot.

You can also specify an enemy type in the enemy character's memo field
and add that type to the slot.
The default memo tag for enemy type is enemyType.

Example:
<enemyType:SlimeLv1>

You can specify multiple types, separated by commas.
<enemyType:SlimeLv1,SlimeLv2>

If using with the following plugins, add this above them.
DarkPlasma_EnemyBook

@param autoPositionWidth
@text Auto-place width
@desc Sets the width threshold for moving forward and backward during automatic placement. If the total width of the enemy character images is larger than this, the enemy placement will be spread forward and backward.
@type number
@default 816

@param enemyTypeTag
@text Enemy type tag
@desc Specifies the note tag name to determine the enemy type.
@type string
@default enemyType

@command randomTroop
@text Random Configuration Settings
@desc When used on the first page of an enemy group battle event, it will randomly determine the group composition upon encounter.
@arg troop
@text Lottery slot settings
@desc Set any number of lottery slots.
@type struct<RandomTroopEnemy>[]
*/

/*:ja
@plugindesc 敵グループ構成のランダム化
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@orderBefore DarkPlasma_EnemyBook

@param autoPositionWidth
@desc 自動配置の際、前後に動かす際の横幅の閾値を設定します。敵キャラ画像の横幅合計がこれより大きい場合、敵配置を前後にバラけさせます。
@text 自動配置横幅
@type number
@default 816

@param enemyTypeTag
@desc 敵種別を判定するためのメモタグ名を指定します。
@text 敵種別タグ
@type string
@default enemyType

@command randomTroop
@text ランダム構成設定
@desc 敵グループバトルイベントの1ページ目で使用すると、遭遇時にグループ構成をランダムに決定します。
@arg troop
@text 抽選枠設定
@desc 任意の数の抽選枠を設定します。
@type struct<RandomTroopEnemy>[]

@help
version: 1.1.0
敵グループのバトルイベント設定
1ページ目でプラグインコマンドを設定することにより、
設定内容に応じて遭遇時に敵グループの構成をランダムに決定します。

抽選枠を任意の数指定することができ、指定した数だけ出現判定を行います。
ある抽選枠が出現する判定となった場合、
その抽選枠に含まれる敵キャラリストの中から
ランダムで1体の敵キャラが出現します。

敵種別を敵キャラのメモ欄で指定し、
その種別を抽選枠に追加することも可能です。
敵種別のメモタグはデフォルト設定では enemyType となっています。

例:
<enemyType:スライム族LV1>

種別はカンマ区切りで複数指定することも可能です。
<enemyType:スライム族LV1,スライム族LV2>

下記プラグインと共に利用する場合、それよりも上に追加してください。
DarkPlasma_EnemyBook
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function isEnemy(data) {
    return $dataEnemies && $dataEnemies.includes(data);
  }

  function parseArgs_randomTroop(args) {
    return {
      troop: JSON.parse(args.troop || '[]').map((e) => {
        return ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            name: String(parsed.name || ``),
            enemyIds: JSON.parse(parsed.enemyIds || '[]').map((e) => {
              return Number(e || 0);
            }),
            tag: String(parsed.tag || ``),
            rate: Number(parsed.rate || 100),
          };
        })(e || '{}');
      }),
    };
  }

  const command_randomTroop = 'randomTroop';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    autoPositionWidth: Number(pluginParameters.autoPositionWidth || 816),
    enemyTypeTag: String(pluginParameters.enemyTypeTag || `enemyType`),
  };

  const PLUGIN_COMMAND_CODE = 357;
  PluginManager.registerCommand(pluginName, command_randomTroop, function (args) {});
  function DataManager_RandomTrooMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (isEnemy(data)) {
        data.typeTags = String(data.meta[settings.enemyTypeTag] || '')
          .split(',')
          .filter((tag) => !!tag)
          .map((tag) => tag.trim());
      }
    };
    dataManager.enemiesWithTag = function (tag) {
      return $dataEnemies.filter((enemy) => enemy?.typeTags.includes(tag));
    };
  }
  DataManager_RandomTrooMixIn(DataManager);
  function Game_Troop_RandomTroopMixIn(gameTroop) {
    const _setup = gameTroop.setup;
    gameTroop.setup = function (troopId) {
      this._troopId = troopId;
      this._isRandomTroop = undefined;
      if (this.isRandomTroop()) {
        const _makeUniqueNames = this.makeUniqueNames;
        this.makeUniqueNames = () => {};
        /**
         * PictureCommonCall.jsなど、setupをフックするプラグインとの競合回避用に呼ぶだけ呼んでおく
         */
        _setup.call(this, troopId);
        /**
         * ランダム出現の場合は通常の遭遇結果を無視し、敵グループ編成を再構築する
         */
        this._enemies = [];
        this.processRandomTroop();
        this.makeUniqueNames = _makeUniqueNames;
      } else {
        _setup.call(this, troopId);
      }
    };
    gameTroop.processRandomTroop = function () {
      const randomTroopCommand = this.randomTroopCommand();
      if (randomTroopCommand) {
        const args = parseArgs_randomTroop(randomTroopCommand.parameters[3]);
        args.troop
          .filter((enemy) => enemy.rate > Math.randomInt(100))
          .forEach((enemy) => {
            const candidates = enemy.enemyIds.concat(DataManager.enemiesWithTag(enemy.tag).map((data) => data.id));
            this._enemies.push(new Game_Enemy(candidates[Math.randomInt(candidates.length)], 0, 0));
          });
        this.makeUniqueNames();
      }
    };
    gameTroop.randomTroopCommand = function () {
      return $dataTroops[this._troopId].pages[0].list.find((command) => {
        return command.code === PLUGIN_COMMAND_CODE && command.parameters[1] === command_randomTroop;
      });
    };
    gameTroop.isRandomTroop = function () {
      if (this._isRandomTroop === undefined) {
        this._isRandomTroop = this.randomTroopCommand() !== undefined;
      }
      return this._isRandomTroop;
    };
  }
  Game_Troop_RandomTroopMixIn(Game_Troop.prototype);
  function Game_Enemy_RandomTroopMixIn(gameEnemy) {
    gameEnemy.setScreenPosition = function (x, y) {
      this._screenX = x;
      this._screenY = y;
    };
  }
  Game_Enemy_RandomTroopMixIn(Game_Enemy.prototype);
  function Scene_Battle_RandomTroopMixIn(sceneBattle) {
    const _start = sceneBattle.start;
    sceneBattle.start = function () {
      _start.call(this);
      if ($gameTroop.isRandomTroop()) {
        this._spriteset.repositionEnemies();
      }
    };
  }
  Scene_Battle_RandomTroopMixIn(Scene_Battle.prototype);
  function Spriteset_Battle_RandomTroopMixIn(spritesetBattle) {
    spritesetBattle.repositionEnemies = function () {
      if ($gameSystem.isSideView()) {
        this.repositionEnemiesForSideView();
      } else {
        this.repositionEnemiesForFrontView();
      }
    };
    spritesetBattle.repositionEnemiesForFrontView = function () {
      const depth = Math.round(Graphics.boxHeight * 0.15); // エネミーのいる列によって生じる奥行き表現をするためのY補正用数値
      const base_y = Math.round(Graphics.boxHeight * 0.98);
      this._enemySprites.forEach((sprite) => sprite.updateBitmap());
      this._enemySprites.reverse();
      // 全スプライトの表示横幅合計
      const whole_x = this._enemySprites
        .map((sprite) => Math.ceil((sprite.bitmap?.width || 0) * sprite.scale.x))
        .reduce((accumlator, current) => accumlator + current, 0);
      const line = Math.floor(whole_x / settings.autoPositionWidth) + 1; // 横列数
      let maxx = 0;
      let minx = Infinity;
      const enemyCount = this._enemySprites.length; // エネミーの数
      const enemyPerLine = Math.ceil(enemyCount / line); // 列あたりのエネミーの数
      this._enemySprites.forEach((sprite, index) => {
        const currentEnemyLine = Math.ceil((index + 1) / enemyPerLine); // 注目しているエネミーの列
        let x = Math.floor(
          (Graphics.boxWidth * (index % enemyPerLine)) / (enemyPerLine * 1.2) +
            (Graphics.boxWidth * currentEnemyLine) / (enemyPerLine * 1.2 * line),
        );
        let y = base_y - depth - Math.ceil(depth * Math.pow(0.7, currentEnemyLine));
        sprite.setHome(x, y);
        if (maxx === 0 || minx === Infinity) {
          maxx = x;
          minx = x;
        }
        if (maxx < x) {
          maxx = x;
        }
        if (minx > x) {
          minx = x;
        }
      });
      const shiftx = (maxx + minx) / 2 - Graphics.boxWidth / 2;
      this._enemySprites.forEach((sprite) => {
        sprite.shiftXLeft(shiftx);
        // 計算した座標をセットする
        sprite.feedbackPositionToEnemy();
      });
    };
    spritesetBattle.repositionEnemiesForSideView = function () {
      this._enemySprites.forEach((sprite) => sprite.updateBitmap());
      // 全座標同一なので、スプライトIDが大きい順にならんでいる。逆順のほうが直感的であるため、reverse
      this._enemySprites.reverse();
      // 画面分割数
      const enemyCount = this._enemySprites.length;
      let partitionCount = 1; // 画面分割数
      let line = 1; // 行・列数
      while (partitionCount < enemyCount) {
        line++;
        partitionCount = Math.pow(line, 2);
      }
      // どのセルに配置するか決める
      let positionCells = [];
      if (enemyCount === 2) {
        // 2匹の場合、右上と左下
        positionCells = [1, 2];
      } else if (enemyCount === 5) {
        // 5匹の場合、鳳天舞の陣
        positionCells = [0, 2, 4, 6, 8];
      } else if (enemyCount === 6) {
        // 6匹の場合、ホーリーウォール
        positionCells = [0, 2, 3, 5, 6, 8];
      } else {
        // それ以外の場合は左上から順に詰める
        positionCells = [...Array(enemyCount).keys()];
      }
      this._enemySprites.forEach((sprite, index) => {
        sprite.repositionForSideView(line, positionCells[index]);
        sprite.feedbackPositionToEnemy();
      });
    };
  }
  Spriteset_Battle_RandomTroopMixIn(Spriteset_Battle.prototype);
  function Sprite_Enemy_RandomTroopMixIn(spriteEnemy) {
    spriteEnemy.shiftXLeft = function (shiftX) {
      this._homeX -= shiftX;
      this.updatePosition();
    };
    spriteEnemy.feedbackPositionToEnemy = function () {
      if (this._enemy) {
        this._enemy.setScreenPosition(this._homeX, this._homeY);
      }
    };
    spriteEnemy.repositionForSideView = function (lineCount, positionCellIndex) {
      const cellSizeX = 580 / lineCount;
      const cellSizeY = (Graphics.boxHeight * 2) / 3 / lineCount;
      const partitionCellX = positionCellIndex % lineCount;
      const partitionCellY = Math.floor(positionCellIndex / lineCount);
      // 縦並びの場合、若干横軸をずらす
      // ただし、枠をはみ出ないようにする
      const offsetX = Math.min(
        Math.ceil(((this.bitmap?.height || 0) * this.scale.y) / 2) * (partitionCellY / lineCount),
        cellSizeX / 2,
      );
      // Y軸は画像縦サイズの半分だけ下げる
      // 横並びの場合、若干縦軸をずらす
      // ただし、枠をはみ出ないようにする
      const offsetY = Math.min(
        Math.ceil(((this.bitmap?.height || 0) * this.scale.y) / 2) * (1 + partitionCellX / lineCount),
        cellSizeY / 2,
      );
      this._homeX = cellSizeX * partitionCellX + cellSizeX / 2 + offsetX;
      this._homeY = cellSizeY * partitionCellY + cellSizeY / 2 + offsetY;
    };
  }
  Sprite_Enemy_RandomTroopMixIn(Sprite_Enemy.prototype);
})();
