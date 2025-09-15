// DarkPlasma_SaveEquipSet 1.3.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/07/29 1.3.0 記録コマンドに装備セットインデックス設定追加
 * 2023/07/07 1.2.0 復元による装備可能判定のインターフェース追加
 * 2022/11/13 1.1.2 typescript移行
 *                  装備セットに含まれる空欄を復元できない不具合を修正
 * 2022/07/23 1.1.1 セーブデータを正しくロードできない不具合を修正
 *            1.1.0 記録装備セット数設定を追加
 * 2022/04/22 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Record the equipment set of party members
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

Version: 1.3.0
Provides plugin commands for recording and restoring party members' equipment
sets.

Equipment will be ignored and not restored if any of the following conditions
are true:
- The recorded set contains equipment that has been discarded.
- The recorded set contains equipment that cannot be equipped.

@param equipSetCount
@text Number of equipment sets that can be recorded
@desc Set the number of equipment sets that can be recorded for each actor. The more you increase this, the more data capacity will be required.
@type number
@default 1
@min 1

@command saveEquipSet
@text Record your gear set
@desc Records the current party member's equipment set to the specified index.
@arg index
@desc Specify an index starting from 0. If you specify a value greater than the number of sets that can be recorded, the command will be invalid.
@type number
@default 0

@command loadEquipSet
@text Restore your gear set
@desc Restores the equipment set stored in the specified index to the current party member.
@arg index
@desc Specify an index starting from 0. If you specify a value greater than the number of sets that can be recorded, the command will be invalid.
@type number
@default 0

@command saveActorEquipSetAt
@text Record the actor's gear set
@desc Records an equipment set at the specified index for the actor.
@arg actorId
@text actor
@desc Specifies the actor to record the equipment set for. If the actor is not in the party, the command will be disabled.
@type actor

@arg index
@desc Specify an index starting from 0. If you specify a value greater than the number of sets that can be recorded, the command will be invalid.
@type number
@default 0

@command loadActorEquipSetAt
@text Restores an actor's gear set
@desc Restores the equipment set from the specified index on the actor.
@arg actorId
@text actor
@desc Specifies the actor to restore the equipment set to. If the actor is not in the party, the command will be disabled.
@type actor

@arg index
@desc Specify an index starting from 0. If you specify an index that is not recorded, the command will be invalid.
@type number
@default 0

@command clearEquipSets
@text Delete all equipment sets
@desc Deletes all recorded equipment sets for current party members.

@command deleteActorEquipSetAt
@text Remove an actor's equipment set
@desc Removes the equipment set at the specified index from the actor.
@arg actorId
@text actor
@desc Specifies the actor to remove the equipment set from. If the actor is not in the party, the command will be disabled.
@type actor

@arg index
@type number
@default 0
*/

/*:ja
@plugindesc パーティメンバーの装備セットを記録する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@param equipSetCount
@desc アクターごとに記録可能な装備セットの数を設定します。増やすほどセーブデータ容量が増えます。
@text 記録可能な装備セット数
@type number
@default 1
@min 1

@command saveEquipSet
@text 装備セットを記録する
@desc 現在のパーティメンバーの装備セットを指定インデックスに記録します。
@arg index
@text インデックス
@desc 0を先頭とするインデックスを指定します。記録可能なセット数以上の値を指定するとコマンドが無効になります。
@type number
@default 0

@command loadEquipSet
@text 装備セットを復元する
@desc 指定インデックスに記録した装備セットを現在のパーティメンバーに復元します。
@arg index
@text インデックス
@desc 0を先頭とするインデックスを指定します。記録可能なセット数以上の値を指定するとコマンドが無効になります。
@type number
@default 0

@command saveActorEquipSetAt
@text アクターの装備セットを記録する
@desc アクターの指定インデックスに装備セットを記録します。
@arg actorId
@text アクター
@desc 装備セットを記録するアクターを指定します。パーティメンバーにいない場合はコマンドが無効になります。
@type actor
@arg index
@text インデックス
@desc 0を先頭とするインデックスを指定します。記録可能なセット数以上の値を指定するとコマンドが無効になります。
@type number
@default 0

@command loadActorEquipSetAt
@text アクターに装備セットを復元する
@desc アクターの指定インデックスから装備セットを復元します。
@arg actorId
@text アクター
@desc 装備セットを復元するアクターを指定します。パーティメンバーにいない場合はコマンドが無効になります。
@type actor
@arg index
@text インデックス
@desc 0を先頭とするインデックスを指定します。記録されていないインデックスを指定するとコマンドが無効になります。
@type number
@default 0

@command clearEquipSets
@text 装備セットを全て削除する
@desc 現在のパーティメンバーの記録した装備セットを全て削除します。

@command deleteActorEquipSetAt
@text アクターの装備セットを削除する
@desc アクターの指定インデックスの装備セットを削除します。
@arg actorId
@text アクター
@desc 装備セットを削除するアクターを指定します。パーティメンバーにいない場合はコマンドが無効になります。
@type actor
@arg index
@text インデックス
@type number
@default 0

@help
version: 1.3.0
パーティメンバーの装備セットを記録し、復元するプラグインコマンドを提供します。

以下に該当する場合、復元時にその装備は無視され、復元されません。
- 記録したセットの中に手放した装備がある
- 記録したセットの中に装備不可な装備がある
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_saveEquipSet(args) {
    return {
      index: Number(args.index || 0),
    };
  }

  function parseArgs_loadEquipSet(args) {
    return {
      index: Number(args.index || 0),
    };
  }

  function parseArgs_saveActorEquipSetAt(args) {
    return {
      actorId: Number(args.actorId || 0),
      index: Number(args.index || 0),
    };
  }

  function parseArgs_loadActorEquipSetAt(args) {
    return {
      actorId: Number(args.actorId || 0),
      index: Number(args.index || 0),
    };
  }

  function parseArgs_deleteActorEquipSetAt(args) {
    return {
      actorId: Number(args.actorId || 0),
      index: Number(args.index || 0),
    };
  }

  const command_saveEquipSet = 'saveEquipSet';

  const command_loadEquipSet = 'loadEquipSet';

  const command_saveActorEquipSetAt = 'saveActorEquipSetAt';

  const command_loadActorEquipSetAt = 'loadActorEquipSetAt';

  const command_clearEquipSets = 'clearEquipSets';

  const command_deleteActorEquipSetAt = 'deleteActorEquipSetAt';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    equipSetCount: Number(pluginParameters.equipSetCount || 1),
  };

  PluginManager.registerCommand(pluginName, command_saveEquipSet, function (args) {
    const parsedArgs = parseArgs_saveEquipSet(args);
    $gameParty.allMembers().forEach((actor) => actor.saveEquipSetAt(parsedArgs.index));
  });
  PluginManager.registerCommand(pluginName, command_loadEquipSet, function (args) {
    const parsedArgs = parseArgs_loadEquipSet(args);
    /**
     * 全員の装備を外してから、所持しているものの中で記録を復元する
     */
    $gameParty.allMembers().forEach((actor) => actor.clearEquipments());
    $gameParty.allMembers().forEach((actor) => actor.loadEquipSetAt(parsedArgs.index));
  });
  PluginManager.registerCommand(pluginName, command_saveActorEquipSetAt, function (args) {
    const parsedArgs = parseArgs_saveActorEquipSetAt(args);
    const actor = $gameParty.allMembers().find((actor) => actor.actorId() === parsedArgs.actorId);
    if (actor) {
      actor.saveEquipSetAt(parsedArgs.index);
    }
  });
  PluginManager.registerCommand(pluginName, command_loadActorEquipSetAt, function (args) {
    const parsedArgs = parseArgs_loadActorEquipSetAt(args);
    const actor = $gameParty.allMembers().find((actor) => actor.actorId() === parsedArgs.actorId);
    if (actor) {
      actor.loadEquipSetAt(parsedArgs.index);
    }
  });
  PluginManager.registerCommand(pluginName, command_clearEquipSets, function () {
    $gameParty.allMembers().forEach((actor) => actor.clearEquipSets());
  });
  PluginManager.registerCommand(pluginName, command_deleteActorEquipSetAt, function (args) {
    const parsedArgs = parseArgs_deleteActorEquipSetAt(args);
    const actor = $gameParty.allMembers().find((actor) => actor.actorId() === parsedArgs.actorId);
    if (actor) {
      actor.deleteEquipSetAt(parsedArgs.index);
    }
  });
  const KIND = {
    ITEM: 1,
    WEAPON: 2,
    ARMOR: 3,
  };
  class Game_EquipSlot {
    /**
     * @param {number} slotId
     * @param {MZ.Weapon | MZ.Armor} item
     */
    constructor(slotId, item) {
      this._slotId = slotId;
      this.initIdAndKind(item);
    }
    get slotId() {
      return this._slotId;
    }
    get item() {
      /**
       * 旧バージョンのセーブデータ救済
       */
      if (this._item || this._item === null) {
        this.initIdAndKind(this._item);
      }
      if (this._itemId === null) {
        return null;
      }
      switch (this._kind) {
        case KIND.WEAPON:
          return $dataWeapons[this._itemId];
        case KIND.ARMOR:
          return $dataArmors[this._itemId];
        default:
          throw Error(`不正なアイテム種別です: ${this._kind} ${this._itemId}`);
      }
    }
    initIdAndKind(item) {
      this._itemId = item ? item.id : null;
      this._kind = item
        ? (() => {
            if (DataManager.isWeapon(item)) {
              return KIND.WEAPON;
            } else if (DataManager.isArmor(item)) {
              return KIND.ARMOR;
            } else {
              return null;
            }
          })()
        : null;
      delete this._item;
    }
  }
  /**
   * @param {Game_Actor.prototype} gameActor
   */
  function Game_Actor_SaveEquipSetMixIn(gameActor) {
    gameActor.equipSets = function () {
      if (!this._equipSets) {
        this._equipSets = [];
      }
      /**
       * バージョン1.0.0からの互換
       */
      if (this._equipSet) {
        if (!this._equipSets[0]) {
          this._equipSets[0] = this._equipSet.map((slot) => slot);
        }
        delete this._equipSet;
      }
      return this._equipSets;
    };
    gameActor.canEquipByLoad = function (equipSlot) {
      return (
        !equipSlot.item ||
        ($gameParty.hasItem(equipSlot.item) && this.canEquip(equipSlot.item) && this.isEquipChangeOk(equipSlot.slotId))
      );
    };
    gameActor.equipSetAt = function (index) {
      return this.equipSets()[index];
    };
    gameActor.saveEquipSet = function () {
      this.saveEquipSetAt(0);
    };
    gameActor.saveEquipSetAt = function (index) {
      if (settings.equipSetCount > index) {
        this.equipSets()[index] = this.equips().map((equip, slotId) => new Game_EquipSlot(slotId, equip));
      }
    };
    gameActor.loadEquipSet = function () {
      this.loadEquipSetAt(0);
    };
    gameActor.loadEquipSetAt = function (index) {
      const equipSet = this.equipSetAt(index);
      if (settings.equipSetCount > index && equipSet) {
        equipSet
          .filter((equipSlot) => this.canEquipByLoad(equipSlot))
          .forEach((equipSlot) => this.changeEquip(equipSlot.slotId, equipSlot.item));
      }
    };
    gameActor.clearEquipSets = function () {
      this._equipSets = [];
    };
    gameActor.deleteEquipSetAt = function (index) {
      if (this.equipSetAt(index)) {
        delete this._equipSets[index];
      }
    };
  }
  Game_Actor_SaveEquipSetMixIn(Game_Actor.prototype);
  globalThis.Game_EquipSlot = Game_EquipSlot;
})();
