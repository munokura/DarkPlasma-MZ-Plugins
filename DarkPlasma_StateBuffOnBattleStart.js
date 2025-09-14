// DarkPlasma_StateBuffOnBattleStart 3.3.1
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/01/29 3.3.1 oneOfの末尾に指定したステートIDが選ばれない不具合を修正
 * 2024/01/25 3.3.0 新形式の設定をサポート
 *                  旧形式の設定を非推奨化
 * 2022/10/18 3.2.1 強化・弱体が設定より1ターン長く持続する不具合を修正
 * 2022/10/10 3.2.0 FilterEquipに対応
 *            3.1.0 特徴化
 *                  typescript移行
 * 2022/07/18 3.0.0 スキルをメモタグの対象外に変更 ステートをメモタグの対象に変更
 *                  ランダム設定を追加
 *            2.0.3 リファクタ
 * 2021/07/05 2.0.2 MZ 1.3.2に対応
 * 2021/06/22 2.0.1 サブフォルダからの読み込みに対応
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc At the start of battle, a state/buff/weak is applied
@author DarkPlasma
@license MIT

@help
English Help Translator: munokura
Please check the URL below for the latest version of the plugin.
URL https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
-----

version: 3.3.1
By entering the specified tag in the memo field of any actor, job, equipment,
state, or enemy character,
you can add a state, buff, or debuff at the start of battle.

<stateOnBattleStart:
oneOf: Comma-separated list of state IDs
turn: Number of turns
rate: Probability (%)
>
Select and add one state ID from the list set with oneOf.
Multiple lines are allowed.
If turn is omitted, the original state's duration will be used.
If rate is omitted, 100 will be specified.

Example:
<stateOnBattleStart:
oneOf:2,3
turn:3
rate:100
oneOf:4
>
At the start of battle, one of state IDs 2 or 3 will be applied at 100% and
will last for 3 turns.
At the start of battle, state ID 4 will be applied at 100%.

<buffOnBattleStart:
oneOf: Comma-separated list of ability scores and buff levels
turn: Number of turns
rate: Probability (%)
>
Select one of the ability scores and buff levels set in oneOf to buff or
weaken.
Multiple lines are allowed.
If turn is omitted, 3 is assumed.
If rate is omitted, 100 is assumed.

Example:
<buffOnBattleStart:
oneOf: atk+1,def+2,mat+1,mdf+2,agi-1
>
Buffs one of the following: Attack power by one level, Defense power by two
levels, Magic power by one level, Magic defense by one level
Agility by one level weakened, lasting for three turns.

The following setting method is deprecated and will be removed in the next
version update.

<StateOnBattleStartId: 1>
Applies to the state at the start of battle.
1 is the ID set in the plugin parameters.
Multiple IDs can be specified, separated by commas.

<StateOnBattleStartRandom>
A random ID is selected from those specified in the StateOnBattleStartId memo
tag and applied.

<BuffOnBattleStartId: 1>
Applies a buff or debuff at the start of battle.
1 is the ID set in the plugin parameters.

<BuffOnBattleStartRandom>
A random ID is selected from those specified in the BuffOnBattleStartId memo
tag and applied.

This plugin requires the following plugin:
DarkPlasma_AllocateUniqueTraitId version:1.0.1
If using with the following plugin, add this below it.
DarkPlasma_AllocateUniqueTraitId
DarkPlasma_FilterEquip

@param stateOnBattleStart
@text Start of battle state
@type struct<StateOnBattleStart>[]
@default []

@param buffOnBattleStart
@text Strengthening/weakening at the start of battle
@type struct<BuffOnBattleStart>[]
@default []
*/

/*:ja
@plugindesc 戦闘開始時にステート/強化/弱体にかかる
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@base DarkPlasma_AllocateUniqueTraitId
@orderAfter DarkPlasma_AllocateUniqueTraitId
@orderAfter DarkPlasma_FilterEquip

@param stateOnBattleStart
@text 戦闘開始時ステート
@type struct<StateOnBattleStart>[]
@default []

@param buffOnBattleStart
@text 戦闘開始時強化・弱体
@type struct<BuffOnBattleStart>[]
@default []

@help
version: 3.3.1
任意のアクター、職業、装備、ステート、敵キャラのメモ欄に
指定のタグを記述することで戦闘開始時にステート、強化、弱体がかかる特徴を追加します。

<stateOnBattleStart:
  oneOf:カンマ区切りのステートIDリスト turn:ターン数 rate:確率(％)
>
oneOfで設定したステートID一覧の中から、ひとつ選択して付加します。
複数行記述することもできます。
turnは省略すると元のステートの持続ターンが使用されます。
rateは省略すると100が指定されます。

記述例:
<stateOnBattleStart:
  oneOf:2,3 turn:3 rate:100
  oneOf:4
>
戦闘開始時にステートID2,3からどちらかひとつを100％付加し、3ターン持続します。
戦闘開始時にステートID4を100％付加します。

<buffOnBattleStart:
  oneOf:カンマ区切りの能力値名と強化段階リスト turn:ターン数 rate:確率(％)
>
oneOfで設定した能力値名と強化段階一覧の中から、
ひとつ選択して強化・弱体を付加します。
複数行記述することもできます。
turnは省略すると3が指定されます。
rateは省略すると100が指定されます。

記述例:
<buffOnBattleStart:
  oneOf:atk+1,def+2,mat+1,mdf+2,agi-1
>
攻撃力一段階強化、防御力二段階強化、魔法力一段階強化、魔法防御一段階強化
敏捷一段階弱体のうちどれかひとつを100％付加し、3ターン持続します。

以下の設定方法は非推奨です。次のバージョンアップで削除されます。

<StateOnBattleStartId: 1>
戦闘開始時にステートにかかります。
1はプラグインパラメータで設定したID
カンマ区切りで複数指定可能

<StateOnBattleStartRandom>
StateOnBattleStartIdメモタグで指定したIDの中から
ランダムに1つ選択してかかります。

<BuffOnBattleStartId: 1>
戦闘開始時に強化・弱体にかかります。
1はプラグインパラメータで設定したID

<BuffOnBattleStartRandom>
BuffOnBattleStartIdメモタグで指定したIDの中から
ランダムに1つ選択してかかります。

本プラグインの利用には下記プラグインを必要とします。
DarkPlasma_AllocateUniqueTraitId version:1.0.1
下記プラグインと共に利用する場合、それよりも下に追加してください。
DarkPlasma_AllocateUniqueTraitId
DarkPlasma_FilterEquip
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    stateOnBattleStart: JSON.parse(pluginParameters.stateOnBattleStart || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          id: Number(parsed.id || 0),
          stateId: Number(parsed.stateId || 1),
          turn: Number(parsed.turn || -1),
        };
      })(e || '{}');
    }),
    buffOnBattleStart: JSON.parse(pluginParameters.buffOnBattleStart || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          id: Number(parsed.id || 0),
          paramId: Number(parsed.paramId || 0),
          buffStep: Number(parsed.buffStep || 1),
          turn: Number(parsed.turn || 3),
        };
      })(e || '{}');
    }),
  };

  function hasTraits(data) {
    return 'traits' in data;
  }

  const localTraitId = 1;
  const old_stateOnBattleStartTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId, '戦闘開始時ステート');
  const old_buffOnBattleStartTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    localTraitId + 1,
    '戦闘開始時強化・弱体',
  );
  /**
   * 名前が口語的になるが、文字サイズを考えると仕方ない
   */
  const old_stateOnBattleStartRandomTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    localTraitId + 2,
    '開幕ランダムステート',
  );
  const old_buffOnBattleStartRandomTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    localTraitId + 3,
    '開幕ランダム強化・弱体',
  );
  const stateOnBattleStartTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 4, '戦闘開始時ステート');
  const buffOnBattleStartTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 5, '戦闘開始時強化・弱体');
  class StateOnBattleStart {
    constructor(id, stateId, turn) {
      this._id = id;
      this._stateId = stateId;
      this._turn = turn;
    }
    /**
     * @param {StateOnBattleStartSetting} object オブジェクト
     * @return {StateOnBattleStart}
     */
    static fromObject(object) {
      return new StateOnBattleStart(object.id, object.stateId, object.turn);
    }
    /**
     * @return {number}
     */
    get id() {
      return this._id;
    }
    /**
     * @return {number}
     */
    get stateId() {
      return this._stateId;
    }
    /**
     * @return {number}
     */
    get turn() {
      return this._turn;
    }
  }
  class BuffOnBattleStart {
    constructor(id, paramId, buffStep, turn) {
      this._id = id;
      this._paramId = paramId;
      this._buffStep = buffStep;
      this._turn = turn;
    }
    /**
     * @param {BuffOnBattleStartSetting} object オブジェクト
     * @return {BuffOnBattleStart}
     */
    static fromObject(object) {
      return new BuffOnBattleStart(object.id, object.paramId, object.buffStep, object.turn);
    }
    /**
     * @return {number}
     */
    get id() {
      return this._id;
    }
    /**
     * @return {number}
     */
    get paramId() {
      return this._paramId;
    }
    /**
     * @return {number}
     */
    get buffStep() {
      return this._buffStep;
    }
    /**
     * @return {number}
     */
    get turn() {
      return this._turn;
    }
  }
  const paramNames = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
  const $oneOfStatesOnBattleStarts = [];
  const $oneOfBuffsOnBattleStarts = [];
  class StateBuffOnBattleStartManager {
    constructor() {
      this._states = settings.stateOnBattleStart.map((object) => StateOnBattleStart.fromObject(object));
      this._buffs = settings.buffOnBattleStart.map((object) => BuffOnBattleStart.fromObject(object));
    }
    /**
     * IDから戦闘開始時ステートを取得する
     * @param {number[]} ids IDリスト
     * @return {StateOnBattleStart[]}
     */
    statesFromIds(ids) {
      return this._states.filter((state) => ids.includes(state.id));
    }
    /**
     * IDから戦闘開始時バフを取得する
     * @param {number[]} ids IDリスト
     * @return {BuffOnBattleStart[]}
     */
    buffsFromIds(ids) {
      return this._buffs.filter((buff) => ids.includes(buff.id));
    }
  }
  const stateBuffOnBattleStartManager = new StateBuffOnBattleStartManager();
  /**
   * @param {typeof DataManager} dataManager
   */
  function DataManager_StateBuffOnBattleStartMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (hasTraits(data)) {
        if (data.meta.StateOnBattleStartId) {
          String(data.meta.StateOnBattleStartId)
            .split(',')
            .map((id) => Number(id))
            .forEach((id) =>
              data.traits.push({
                code: data.meta.StateOnBattleStartRandom
                  ? old_stateOnBattleStartRandomTraitId.id
                  : old_stateOnBattleStartTraitId.id,
                dataId: id,
                value: 0,
              }),
            );
        }
        if (data.meta.BuffOnBattleStartId) {
          String(data.meta.BuffOnBattleStartId)
            .split(',')
            .map((id) => Number(id))
            .forEach((id) =>
              data.traits.push({
                code: data.meta.BuffOnBattleStartRandom
                  ? old_buffOnBattleStartRandomTraitId.id
                  : old_buffOnBattleStartTraitId.id,
                dataId: id,
                value: 0,
              }),
            );
        }
        if (data.meta.stateOnBattleStart) {
          String(data.meta.stateOnBattleStart)
            .split('\n')
            .filter((line) => line.contains('oneOf:'))
            .forEach((line) => {
              const tokens = /oneOf: ?(([0-9]+,?)+)/.exec(line);
              if (tokens) {
                const stateIds = tokens[1].split(',').map((id) => Number(id));
                const turnTokens = /turn: ?([0-9]+)/.exec(line);
                const turn = turnTokens ? Number(turnTokens[1]) : undefined;
                const rateTokens = /rate: ?([0-9]+)/.exec(line);
                const rate = rateTokens ? Number(rateTokens[1]) : 100;
                const oneOfStatesOnBattleStart = {
                  id: $oneOfStatesOnBattleStarts.length,
                  stateIds: stateIds,
                  turn: turn,
                  rate: rate,
                };
                $oneOfStatesOnBattleStarts.push(oneOfStatesOnBattleStart);
                data.traits.push({
                  code: stateOnBattleStartTraitId.id,
                  dataId: oneOfStatesOnBattleStart.id,
                  value: 0,
                });
              }
            });
        }
        if (data.meta.buffOnBattleStart) {
          String(data.meta.buffOnBattleStart)
            .split('\n')
            .filter((line) => line.contains('oneOf:'))
            .forEach((line) => {
              const tokens = /oneOf: ?(((mhp|mmp|atk|def|mat|mdf|agi|luk)[\+\-][1-9]+,?)+)/.exec(line);
              if (tokens) {
                const paramAndSteps = tokens[1]
                  .split(',')
                  .map((paramAndStep) => {
                    const step = /[\+\-][1-9]+/.exec(paramAndStep);
                    return {
                      paramName: paramNames.find((n) => paramAndStep.startsWith(n)),
                      buffStep: Number(step ? step[0] : 1),
                    };
                  })
                  .filter((paramAndStep) => !!paramAndStep.paramName);
                const turnTokens = /turn: ?([0-9]+)/.exec(line);
                const turn = turnTokens ? Number(turnTokens[1]) : 3;
                const rateTokens = /rate: ?([0-9]+)/.exec(line);
                const rate = rateTokens ? Number(rateTokens[1]) : 100;
                const oneOfBuffsOnBattleStart = {
                  id: $oneOfBuffsOnBattleStarts.length,
                  params: paramAndSteps,
                  turn: turn,
                  rate: rate,
                };
                $oneOfBuffsOnBattleStarts.push(oneOfBuffsOnBattleStart);
                data.traits.push({
                  code: buffOnBattleStartTraitId.id,
                  dataId: oneOfBuffsOnBattleStart.id,
                  value: 0,
                });
              }
            });
        }
      }
    };
  }
  DataManager_StateBuffOnBattleStartMixIn(DataManager);
  /**
   * @param {Game_Battler.prototype} gameBattler
   */
  function Game_Battler_StateBuffOnBattleStartMixIn(gameBattler) {
    const _onBattleStart = gameBattler.onBattleStart;
    gameBattler.onBattleStart = function (advantageous) {
      _onBattleStart.call(this, advantageous);
      /**
       * 戦闘開始時ステート
       */
      this.statesOnBattleStart().forEach((stateOnBattleStart) => {
        this.addState(stateOnBattleStart.stateId);
        /**
         * ターン数上書き
         */
        if (this.isStateAffected(stateOnBattleStart.stateId) && stateOnBattleStart.turn >= 0) {
          this._stateTurns[stateOnBattleStart.stateId] = stateOnBattleStart.turn;
        }
      });
      /**
       * 戦闘開始時の強化・弱体
       * 強化・弱体はターン終了時にターン数が1減り、次ターンの行動時に解除される
       * つまり、5ターン持続としてかけられた強化・弱体は次ターンから数えて5ターン目の行動時に解除される
       * 戦闘開始時にかけられたものは初ターンから数えるため、1減らしておく
       */
      this.buffsOnBattleStart().forEach((buffOnBattleStart) => {
        let buffStep = buffOnBattleStart.buffStep;
        while (buffStep > 0) {
          this.addBuff(buffOnBattleStart.paramId, buffOnBattleStart.turn - 1);
          buffStep--;
        }
        while (buffStep < 0) {
          this.addDebuff(buffOnBattleStart.paramId, buffOnBattleStart.turn - 1);
          buffStep++;
        }
      });
    };
    /**
     * 戦闘開始時ステート一覧
     */
    gameBattler.statesOnBattleStart = function () {
      const states = this.traits(stateOnBattleStartTraitId.id)
        .filter((trait) => $oneOfStatesOnBattleStarts[trait.dataId].rate > Math.randomInt(100))
        .map((trait) => {
          const stateIds = $oneOfStatesOnBattleStarts[trait.dataId].stateIds;
          const stateId = stateIds[Math.randomInt(stateIds.length)];
          const state = $dataStates[stateId];
          const turn =
            $oneOfStatesOnBattleStarts[trait.dataId].turn ||
            state.minTurns + Math.randomInt(1 + Math.max(state.maxTurns - state.minTurns, 0));
          return {
            stateId: stateId,
            turn: turn,
          };
        });
      /**
       * 特徴の付与されたオブジェクト内でランダムに選択する (旧形式)
       */
      const old_randomIds = this.traitObjects()
        .filter((object) => object.traits.some((trait) => trait.code === old_stateOnBattleStartRandomTraitId.id))
        .map((object) => {
          const traits = object.traits.filter((trait) => trait.code === old_stateOnBattleStartRandomTraitId.id);
          return traits[Math.randomInt(traits.length)].dataId;
        });
      return states.concat(
        stateBuffOnBattleStartManager.statesFromIds(
          this.traitsSet(old_stateOnBattleStartTraitId.id).concat(old_randomIds),
        ),
      );
    };
    /**
     * 戦闘開始時強化・弱体一覧
     */
    gameBattler.buffsOnBattleStart = function () {
      const buffs = this.traits(buffOnBattleStartTraitId.id)
        .filter((trait) => $oneOfBuffsOnBattleStarts[trait.dataId].rate > Math.randomInt(100))
        .map((trait) => {
          const paramIds = $oneOfBuffsOnBattleStarts[trait.dataId].params.map((param) =>
            paramNames.indexOf(param.paramName),
          );
          const index = Math.randomInt(paramIds.length);
          return {
            paramId: paramIds[index],
            buffStep: $oneOfBuffsOnBattleStarts[trait.dataId].params[index].buffStep,
            turn: $oneOfBuffsOnBattleStarts[trait.dataId].turn,
          };
        });
      const old_randomIds = this.traitObjects()
        .filter((object) => object.traits.some((trait) => trait.code === old_buffOnBattleStartRandomTraitId.id))
        .map((object) => {
          const traits = object.traits.filter((trait) => trait.code === old_buffOnBattleStartRandomTraitId.id);
          return traits[Math.randomInt(traits.length - 1)].dataId;
        });
      return buffs.concat(
        stateBuffOnBattleStartManager.buffsFromIds(
          this.traitsSet(old_buffOnBattleStartTraitId.id).concat(old_randomIds),
        ),
      );
    };
  }
  Game_Battler_StateBuffOnBattleStartMixIn(Game_Battler.prototype);
  function Scene_Equip_StateBuffOnBattleStartMixIn(sceneEquip) {
    const _EquipFilterBuilder = sceneEquip.equipFilterBuilder;
    sceneEquip.equipFilterBuilder = function (equips) {
      return _EquipFilterBuilder
        .call(this, equips)
        .withTrait(old_stateOnBattleStartTraitId.id)
        .withTrait(old_buffOnBattleStartTraitId.id)
        .withTrait(old_stateOnBattleStartRandomTraitId.id)
        .withTrait(old_buffOnBattleStartRandomTraitId.id);
    };
  }
  Scene_Equip_StateBuffOnBattleStartMixIn(Scene_Equip.prototype);
})();
