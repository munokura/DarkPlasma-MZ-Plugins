// DarkPlasma_LimitSParam 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/07/21 1.0.0 最初のバージョン
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Set the limit for special ability scores
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
Sets the limit for special ability scores.

If using with the following plugin, add it below.
DarkPlasma_AddSParamTrait

@param statusLimit
@text Limit
@desc Set the limit value for each status.
@type struct<StatusLimit>
@default {"tgr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","grd":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","rec":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","pha":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","mcr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","tcr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","pdr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","mdr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","fdr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","exr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}"}
*/

/*:ja
@plugindesc 特殊能力値の限界値を設定する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@orderAfter DarkPlasma_AddSParamTrait

@param statusLimit
@desc 各ステータスの限界値を設定します。
@text 限界値
@type struct<StatusLimit>
@default {"tgr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","grd":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","rec":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","pha":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","mcr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","tcr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","pdr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","mdr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","fdr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","exr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}"}

@help
version: 1.0.0
特殊能力値の限界値を設定します。

下記プラグインと共に利用する場合、それよりも下に追加してください。
DarkPlasma_AddSParamTrait
*/

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    statusLimit: pluginParameters.statusLimit
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            tgr: parsed.tgr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.tgr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            grd: parsed.grd
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.grd)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            rec: parsed.rec
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.rec)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            pha: parsed.pha
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.pha)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            mcr: parsed.mcr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.mcr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            tcr: parsed.tcr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.tcr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            pdr: parsed.pdr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.pdr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            mdr: parsed.mdr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.mdr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            fdr: parsed.fdr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.fdr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            exr: parsed.exr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.exr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          };
        })(pluginParameters.statusLimit)
      : {
          tgr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          grd: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          rec: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          pha: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          mcr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          tcr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          pdr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          mdr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          fdr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          exr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
        },
  };

  const SPARAM_KEYS = ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr'];
  function Game_BattlerBase_LimitSParamMixIn(gameBattlerBase) {
    const _sparam = gameBattlerBase.sparam;
    gameBattlerBase.sparam = function (paramId) {
      const value = _sparam.call(this, paramId);
      const limitSetting = this.sparamLimitSetting(paramId);
      if (limitSetting.enableLowerLimit) {
        if (limitSetting.enableUpperLimit) {
          return value.clamp(limitSetting.lowerLimit, limitSetting.upperLimit);
        } else {
          return Math.max(limitSetting.lowerLimit, value);
        }
      } else {
        if (limitSetting.enableUpperLimit) {
          return Math.min(limitSetting.upperLimit, value);
        }
      }
      return value;
    };
    gameBattlerBase.sparamLimitSetting = function (paramId) {
      return settings.statusLimit[SPARAM_KEYS[paramId]];
    };
  }
  Game_BattlerBase_LimitSParamMixIn(Game_BattlerBase.prototype);
})();
