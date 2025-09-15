// DarkPlasma_ConcurrentParty 1.4.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/08/14 1.4.0 イベントをパーティとして表示するプラグインコマンドを追加
 * 2025/08/09 1.3.0 パーティ分割状態を取得するプラグインコマンドを追加
 * 2025/07/13 1.2.0 分割したパーティの空欄表現を変更
 * 2025/07/12 1.1.0 分割したパーティをセーブできない不具合を修正
 *                  切り替えプラグインコマンドに自動フェード設定を追加
 * 2025/06/07 1.0.0 最初のバージョン
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Concurrent Party Systems
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

Version: 1.4.0
This system allows you to split a party and switch between players to progress
in parallel.

You can split a party using a plugin command.
You cannot split a party further while in split party mode.

A valid actor for a party split is an actor that meets the following criteria:
- Not included in another split party
- Included in the original party

A valid party is one that contains at least one valid actor.

@param nextPartyButton
@text Next switch button
@type select
@default pagedown
@option pageup
@option pagedown
@option shift
@option control
@option tab

@param previousPartyButton
@text Previous toggle button
@type select
@default pageup
@option pageup
@option pagedown
@option shift
@option control
@option tab

@param disableChangeSwitch
@text Switching prohibition switch
@type switch
@default 0

@param commonEvent
@text Common event when switching
@desc Specify the common event to be scheduled when switching parties.
@type common_event
@default 0

@command devideParty
@text Split the party
@desc Splits the party into the specified configuration. Does nothing if already split.
@arg parties
@text Party List
@desc Specifies a list of parties. Invalid parties will be ignored.
@type struct<Party>[]
@default []

@command nextParty
@text Switch to the next party
@desc Switches control to the next party. If you are in the last party, it switches to the first party.
@arg autoFadeOut
@text Auto Fade Out
@desc It will automatically fade out before switching.
@type boolean
@default true

@arg autoFadeIn
@text Auto Fade In
@desc Auto fade in after switch.
@type boolean
@default true

@command previousParty
@text Switch to the previous party
@desc Switches control to the previous party. From the first party, switches to the last party.
@arg autoFadeOut
@text Auto Fade Out
@desc It will automatically fade out before switching.
@type boolean
@default true

@arg autoFadeIn
@text Auto Fade In
@desc Auto fade in after switch.
@type boolean
@default true

@command joinAllMember
@text All members join together
@desc The split state will be reset and all members will reunite.

@command leaderId
@text Get the party leader
@desc Gets the ID of the actor who is the leader of the specified party.
@arg variableId
@text variable
@desc Select the variable to assign the actor ID to.
@type variable
@default 0

@arg partyIndex
@text Party Index
@desc Specifies the party index.
@type number
@default 0

@command partyIndex
@text Get the party index
@desc Retrieves the current party's index into the specified variable.
@arg variableId
@text variable
@type variable
@default 0

@command partyPosition
@text Get the party's location
@desc Gets the position of the specified party into the specified variable.
@arg mapIdVariableId
@text Map ID variable
@desc Select the variable to which you want to assign the map ID.
@type variable
@default 0

@arg xVariableId
@text X coordinate variable
@desc Select the variable to assign the X coordinate.
@type variable
@default 0

@arg yVariableId
@text Y coordinate variable
@desc Select the variable to assign the Y coordinate.
@type variable
@default 0

@arg directionVariableId
@text Orientation Variable
@desc Select the variable to assign the orientation to.
@type variable
@default 0

@arg partyIndex
@text Party Index
@desc Specifies the party index.
@type number
@default 0

@command isPartyDevided
@text Get the party split status
@desc Gets the party split status for the specified switch.
@arg switchId
@text switch
@desc If the party is split, turn on the designated switch.
@type switch
@default 0

@command displayEventAsParty
@text Viewing an event as a party
@desc If the specified party is on the same map, the specified event will be moved to those coordinates.
@arg eventName
@text Event Name
@desc Specify the name of the event you want to move to the party's coordinates. Even if there are multiple events with the same name, only one of them will be moved.
@type string

@arg partyIndex
@text Party Index
@desc Specifies the party index.
@type number
@default 0
*/

/*:ja
@plugindesc 並行パーティシステム
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param nextPartyButton
@text 次へ切り替えボタン
@type select
@option pageup
@option pagedown
@option shift
@option control
@option tab
@default pagedown

@param previousPartyButton
@text 前へ切り替えボタン
@type select
@option pageup
@option pagedown
@option shift
@option control
@option tab
@default pageup

@param disableChangeSwitch
@text 切り替え禁止スイッチ
@type switch
@default 0

@param commonEvent
@desc パーティ切り替え時に予約するコモンイベントを指定します。
@text 切り替え時コモンイベント
@type common_event
@default 0

@command devideParty
@text パーティを分割する
@desc 指定した構成でパーティを分割します。すでに分割されている場合は何もしません。
@arg parties
@desc パーティ一覧を指定します。有効でないパーティは無視します。
@text パーティ一覧
@type struct<Party>[]
@default []

@command nextParty
@text 次のパーティに切り替える
@desc 次のパーティへ操作を切り替えます。最後のパーティからは最初のパーティに切り替えます。
@arg autoFadeOut
@desc 切り替え前に自動でフェードアウトします。
@text 自動フェードアウト
@type boolean
@default true
@arg autoFadeIn
@desc 切り替え後に自動フェードインします。
@text 自動フェードイン
@type boolean
@default true

@command previousParty
@text 前のパーティに切り替える
@desc 前のパーティへ操作を切り替えます。最初のパーティからは最後のパーティに切り替えます。
@arg autoFadeOut
@desc 切り替え前に自動でフェードアウトします。
@text 自動フェードアウト
@type boolean
@default true
@arg autoFadeIn
@desc 切り替え後に自動フェードインします。
@text 自動フェードイン
@type boolean
@default true

@command joinAllMember
@text 全員合流する
@desc 分割状態をリセットし、全メンバーで合流します。

@command leaderId
@text パーティリーダーを取得する
@desc 指定したパーティのリーダーであるアクターのIDを取得します。
@arg variableId
@desc アクターIDを代入する変数を選択します。
@text 変数
@type variable
@default 0
@arg partyIndex
@desc パーティのインデックスを指定します。
@text パーティインデックス
@type number
@default 0

@command partyIndex
@text パーティインデックスを取得する
@desc 指定した変数に現在のパーティのインデックスを取得します。
@arg variableId
@text 変数
@type variable
@default 0

@command partyPosition
@text パーティの位置を取得する
@desc 指定した変数に指定したパーティの位置を取得します。
@arg mapIdVariableId
@desc マップIDを代入する変数を選択します。
@text マップID変数
@type variable
@default 0
@arg xVariableId
@desc X座標を代入する変数を選択します。
@text X座標変数
@type variable
@default 0
@arg yVariableId
@desc Y座標を代入する変数を選択します。
@text Y座標変数
@type variable
@default 0
@arg directionVariableId
@desc 向きを代入する変数を選択します。
@text 向き変数
@type variable
@default 0
@arg partyIndex
@desc パーティのインデックスを指定します。
@text パーティインデックス
@type number
@default 0

@command isPartyDevided
@text パーティ分割状態を取得する
@desc 指定したスイッチにパーティの分割状態を取得します。
@arg switchId
@desc パーティ分割状態なら指定スイッチをONにします。
@text スイッチ
@type switch
@default 0

@command displayEventAsParty
@text イベントをパーティとして表示する
@desc 指定パーティが同一マップに存在する場合、指定イベントをその座標に移動します。
@arg eventName
@desc パーティの座標に移動したいイベントの名前を指定します。同名イベントが複数あるってもその中のひとつだけ移動します。
@text イベント名
@type string
@arg partyIndex
@desc パーティのインデックスを指定します。
@text パーティインデックス
@type number
@default 0

@help
version: 1.4.0
パーティを分割し、操作を切り替えて並行で進むシステムを提供します。

プラグインコマンドでパーティを分割することができます。
分割パーティモード中、更にパーティを分割することはできません。

パーティ分割で指定できる有効なアクターとは、以下を満たすアクターです。
- 他の分割パーティに含まれていない
- 分割前のパーティに含まれている

有効なパーティとは、有効なアクターが1人以上含まれるパーティを指します。
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    nextPartyButton: String(pluginParameters.nextPartyButton || `pagedown`),
    previousPartyButton: String(pluginParameters.previousPartyButton || `pageup`),
    disableChangeSwitch: Number(pluginParameters.disableChangeSwitch || 0),
    commonEvent: Number(pluginParameters.commonEvent || 0),
  };

  function parseArgs_devideParty(args) {
    return {
      parties: args.parties
        ? JSON.parse(args.parties).map((e) => {
            return e
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    actorIds: parsed.actorIds
                      ? JSON.parse(parsed.actorIds).map((e) => {
                          return Number(e || 0);
                        })
                      : [],
                    location: (() => {
                      const location = JSON.parse(parsed.location);
                      return {
                        mapId: Number(location.mapId),
                        x: Number(location.x),
                        y: Number(location.y),
                      };
                    })(),
                    direction: Number(parsed.direction || 2),
                  };
                })(e)
              : { actorIds: [], location: { mapId: 1, x: 0, y: 0 }, direction: 2 };
          })
        : [],
    };
  }

  function parseArgs_nextParty(args) {
    return {
      autoFadeOut: String(args.autoFadeOut || true) === 'true',
      autoFadeIn: String(args.autoFadeIn || true) === 'true',
    };
  }

  function parseArgs_previousParty(args) {
    return {
      autoFadeOut: String(args.autoFadeOut || true) === 'true',
      autoFadeIn: String(args.autoFadeIn || true) === 'true',
    };
  }

  function parseArgs_leaderId(args) {
    return {
      variableId: Number(args.variableId || 0),
      partyIndex: Number(args.partyIndex || 0),
    };
  }

  function parseArgs_partyIndex(args) {
    return {
      variableId: Number(args.variableId || 0),
    };
  }

  function parseArgs_partyPosition(args) {
    return {
      mapIdVariableId: Number(args.mapIdVariableId || 0),
      xVariableId: Number(args.xVariableId || 0),
      yVariableId: Number(args.yVariableId || 0),
      directionVariableId: Number(args.directionVariableId || 0),
      partyIndex: Number(args.partyIndex || 0),
    };
  }

  function parseArgs_isPartyDevided(args) {
    return {
      switchId: Number(args.switchId || 0),
    };
  }

  function parseArgs_displayEventAsParty(args) {
    return {
      eventName: String(args.eventName || ``),
      partyIndex: Number(args.partyIndex || 0),
    };
  }

  const command_devideParty = 'devideParty';

  const command_nextParty = 'nextParty';

  const command_previousParty = 'previousParty';

  const command_joinAllMember = 'joinAllMember';

  const command_leaderId = 'leaderId';

  const command_partyIndex = 'partyIndex';

  const command_partyPosition = 'partyPosition';

  const command_isPartyDevided = 'isPartyDevided';

  const command_displayEventAsParty = 'displayEventAsParty';

  PluginManager.registerCommand(pluginName, command_devideParty, function (args) {
    if ($gameParty.isDevided()) {
      return;
    }
    const parsedArgs = parseArgs_devideParty(args);
    const devidedParties = parsedArgs.parties
      .map((party) => {
        const devidedParty = new Game_DevidedParty();
        party.actorIds
          .map((actorId) => $gameActors.actor(actorId))
          .filter((actor) => !!actor && actor.index() >= 0)
          .forEach((actor) => devidedParty.addMember(actor));
        devidedParty.setPosition({
          mapId: party.location.mapId,
          x: party.location.x,
          y: party.location.y,
          direction: party.direction,
        });
        return devidedParty;
      })
      .filter((party) => party.isValid());
    if (devidedParties.length > 1) {
      $gameParty.devidePartyInto({
        parties: devidedParties,
        currentIndex: 0,
      });
    }
  });
  PluginManager.registerCommand(pluginName, command_nextParty, function (args) {
    $gameParty.changeToNextParty(parseArgs_nextParty(args));
  });
  PluginManager.registerCommand(pluginName, command_previousParty, function (args) {
    $gameParty.changeToPreviousParty(parseArgs_previousParty(args));
  });
  PluginManager.registerCommand(pluginName, command_joinAllMember, function () {
    $gameParty.joinAllDevidedParties();
  });
  PluginManager.registerCommand(pluginName, command_leaderId, function (args) {
    const parsedArgs = parseArgs_leaderId(args);
    if ($gameParty.isDevided()) {
      const party = $gameParty.devidedParty(parsedArgs.partyIndex);
      if (party) {
        $gameVariables.setValue(parsedArgs.variableId, party.leader()?.actorId() || 0);
      }
    }
  });
  PluginManager.registerCommand(pluginName, command_partyIndex, function (args) {
    const parsedArgs = parseArgs_partyIndex(args);
    if ($gameParty.isDevided()) {
      const index = $gameParty.currentPartyIndex();
      if (index !== undefined) {
        $gameVariables.setValue(parsedArgs.variableId, index);
      }
    }
  });
  PluginManager.registerCommand(pluginName, command_partyPosition, function (args) {
    const parsedArgs = parseArgs_partyPosition(args);
    if ($gameParty.isDevided()) {
      const party = $gameParty.devidedParty(parsedArgs.partyIndex);
      if (party) {
        $gameVariables.setValue(parsedArgs.mapIdVariableId, party.position.mapId);
        $gameVariables.setValue(parsedArgs.xVariableId, party.position.x);
        $gameVariables.setValue(parsedArgs.yVariableId, party.position.y);
        $gameVariables.setValue(parsedArgs.directionVariableId, party.position.direction);
      }
    }
  });
  PluginManager.registerCommand(pluginName, command_isPartyDevided, function (args) {
    const paresdArgs = parseArgs_isPartyDevided(args);
    $gameSwitches.setValue(paresdArgs.switchId, $gameParty.isDevided());
  });
  PluginManager.registerCommand(pluginName, command_displayEventAsParty, function (args) {
    const parsedArgs = parseArgs_displayEventAsParty(args);
    if ($gameParty.isDevided()) {
      const party = $gameParty.devidedParty(parsedArgs.partyIndex);
      if (party?.position.mapId === $gameMap.mapId()) {
        const event = $gameMap.events().find((e) => e.event().name === parsedArgs.eventName);
        event?.locate(party.position.x, party.position.y);
        event?.setDirection(party.position.direction);
      }
    }
  });
  function Game_Temp_ConcurrentPartyMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._changePartyQueue = [];
    };
    gameTemp.enqueueChangePartyProcess = function (process) {
      this._changePartyQueue.push(process);
    };
    gameTemp.dequeueChangePartyProcess = function () {
      return this._changePartyQueue.shift();
    };
  }
  Game_Temp_ConcurrentPartyMixIn(Game_Temp.prototype);
  function Game_Screen_ConcurrentPartyMixIn(gameScreen) {
    gameScreen.isFadeBusy = function () {
      return this._fadeInDuration > 0 || this._fadeOutDuration > 0;
    };
  }
  Game_Screen_ConcurrentPartyMixIn(Game_Screen.prototype);
  function Game_Party_ConcurrentPartyMixIn(gameParty) {
    gameParty.devidePartyInto = function (devidedParties) {
      this._devidedParties = devidedParties;
      this.currentParty()?.transferTo(0);
    };
    gameParty.devidedParties = function () {
      return this._devidedParties;
    };
    gameParty.devidedParty = function (index) {
      if (!this._devidedParties) {
        return undefined;
      }
      return this._devidedParties.parties[index];
    };
    gameParty.currentParty = function () {
      return this._devidedParties ? this.devidedParty(this._devidedParties.currentIndex) : undefined;
    };
    gameParty.currentPartyIndex = function () {
      return this._devidedParties ? this._devidedParties.currentIndex : undefined;
    };
    gameParty.changeToNextParty = function (param) {
      if (this._devidedParties) {
        this.currentParty()?.updatePosition();
        this._devidedParties.currentIndex =
          (this._devidedParties.currentIndex + 1) % this._devidedParties.parties.length;
        this.onPartyChanged(param);
      }
    };
    gameParty.changeToPreviousParty = function (param) {
      if (this._devidedParties) {
        this.currentParty()?.updatePosition();
        this._devidedParties.currentIndex =
          (this._devidedParties.currentIndex + this._devidedParties.parties.length - 1) %
          this._devidedParties.parties.length;
        this.onPartyChanged(param);
      }
    };
    gameParty.onPartyChanged = function (param) {
      if (param.autoFadeOut) {
        $gameTemp.enqueueChangePartyProcess('fadeOut');
      }
      $gameTemp.enqueueChangePartyProcess('transfer');
      if (settings.commonEvent) {
        $gameTemp.enqueueChangePartyProcess('commonEvent');
      }
      if (param.autoFadeIn) {
        $gameTemp.enqueueChangePartyProcess('fadeIn');
      }
    };
    gameParty.joinAllDevidedParties = function () {
      this._devidedParties = undefined;
      $gamePlayer.refresh();
    };
    gameParty.isDevided = function () {
      return !!this.devidedParties();
    };
    const _allMembers = gameParty.allMembers;
    gameParty.allMembers = function () {
      return this.isDevided() ? this.currentParty().allMembers() : _allMembers.call(this);
    };
    const _swapOrder = gameParty.swapOrder;
    gameParty.swapOrder = function (index1, index2) {
      if (this.isDevided()) {
        this.currentParty()?.swapOrder(index1, index2);
      } else {
        _swapOrder.call(this, index1, index2);
      }
    };
    const _addActor = gameParty.addActor;
    gameParty.addActor = function (actorId) {
      _addActor.call(this, actorId);
      const actor = $gameActors.actor(actorId);
      if (actor && this.isDevided() && !this.currentParty()?.includesActor(actor)) {
        this.currentParty()?.addMember(actor);
      }
    };
    const _removeActor = gameParty.removeActor;
    gameParty.removeActor = function (actorId) {
      const actor = $gameActors.actor(actorId);
      if (actor && this.isDevided()) {
        this.currentParty()?.removeMember(actor);
      }
      _removeActor.call(this, actorId);
    };
  }
  Game_Party_ConcurrentPartyMixIn(Game_Party.prototype);
  class Game_DevidedParty {
    constructor() {
      this._members = [];
      this._position = {
        mapId: 0,
        x: 0,
        y: 0,
        direction: 0,
      };
    }
    get position() {
      return this._position;
    }
    isValid() {
      return this._members.length > 0;
    }
    setPosition(position) {
      this._position = position;
    }
    updatePosition() {
      this._position.mapId = $gameMap.mapId();
      this._position.x = $gamePlayer.x;
      this._position.y = $gamePlayer.y;
      this._position.direction = $gamePlayer.direction();
    }
    addMember(actor) {
      this._members.push(actor);
    }
    setMember(actor, index) {
      this._members[index] = actor;
    }
    removeMember(actor) {
      this._members = this._members.filter((member) => member?.actorId() !== actor.actorId());
    }
    includesActor(actor) {
      return this._members.some((member) => member?.actorId() === actor.actorId());
    }
    actor(index) {
      return this._members[index];
    }
    leader() {
      return this._members.find((actor) => actor);
    }
    allMembers() {
      return this._members.filter((actor) => !!actor);
    }
    allMembersWithSpace() {
      return this._members;
    }
    transferTo(fadeType) {
      $gamePlayer.reserveTransfer(
        this.position.mapId,
        this.position.x,
        this.position.y,
        this.position.direction,
        fadeType,
      );
    }
    swapOrder(index1, index2) {
      const temp = this._members[index1];
      this._members[index1] = this._members[index2];
      this._members[index2] = temp;
      $gamePlayer.refresh();
    }
  }
  function Scene_Map_ConcurrentPartyMixIn(sceneMap) {
    const _update = sceneMap.update;
    sceneMap.update = function () {
      _update.call(this);
      if (!SceneManager.isSceneChanging()) {
        this.updateCallChangeParty();
      }
      this.updateChangePartyQueue();
    };
    sceneMap.updateCallChangeParty = function () {
      if (this.isChangePartyEnabled()) {
        if (this.isChangeToNextPartyCalled()) {
          $gameParty.changeToNextParty({ autoFadeOut: true, autoFadeIn: true });
        } else if (this.isChangeToPreviousPartyCalled()) {
          $gameParty.changeToPreviousParty({ autoFadeOut: true, autoFadeIn: true });
        }
      }
    };
    sceneMap.updateChangePartyQueue = function () {
      if (this.isChangePartyProcessBusy()) {
        return;
      }
      this._changePartyProcess = $gameTemp.dequeueChangePartyProcess();
      switch (this._changePartyProcess) {
        /**
         * イベントコマンドのフェードイン・アウトから制御できるように、
         * $gameScreenのフェード機構を用いる
         */
        case 'fadeOut':
          $gameScreen.startFadeOut(this.fadeSpeed());
          break;
        case 'fadeIn':
          $gameScreen.startFadeIn(this.fadeSpeed());
          break;
        case 'transfer':
          $gameParty.currentParty()?.transferTo(2);
          break;
        case 'commonEvent':
          if (settings.commonEvent) {
            $gameTemp.reserveCommonEvent(settings.commonEvent);
          }
          break;
      }
    };
    sceneMap.isChangePartyEnabled = function () {
      return !$gamePlayer.isMoving() && !$gameMap.isEventRunning();
    };
    sceneMap.isChangeToNextPartyCalled = function () {
      return Input.isTriggered(settings.nextPartyButton);
    };
    sceneMap.isChangeToPreviousPartyCalled = function () {
      return Input.isTriggered(settings.previousPartyButton);
    };
    sceneMap.isChangePartyProcessBusy = function () {
      switch (this._changePartyProcess) {
        case 'fadeOut':
        case 'fadeIn':
          return $gameScreen.isFadeBusy();
        case 'transfer':
          return $gamePlayer.isTransferring();
        case 'commonEvent':
          return $gameTemp.isCommonEventReserved() || $gameMap.isEventRunning();
      }
      return false;
    };
  }
  Scene_Map_ConcurrentPartyMixIn(Scene_Map.prototype);
  globalThis.Game_DevidedParty = Game_DevidedParty;
})();
