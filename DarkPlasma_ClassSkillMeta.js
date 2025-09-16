// DarkPlasma_ClassSkillMeta 1.0.1
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/03/17 1.0.1 TypeScript移行
 * 2021/10/10 1.0.0 公開
 */

/*:
@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
@plugindesc Register metadata in the memo field for the skills acquired by a profession
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
You can now register metadata in the memo field of a job's acquired skills,
just like other data.

For example, if you enter <a:AAA> in the memo field for a skill,
$dataClasses[class ID].learnings[acquired skill index].meta.a will be set to
"AAA".

Boolean values are also set using the same specifications as other data
metadata.
*/

/*:ja
@plugindesc 職業の習得スキルのメモ欄にメタデータを登録する
@author DarkPlasma
@license MIT

@target MZ
@url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release

@help
version: 1.0.1
職業の習得するスキル一覧のメモ欄に、
他の各種データ同様にメタデータを登録できるようにします。

例えば、習得するスキルのメモ欄に <a:AAA> と記述すると
$dataClasses[クラスID].learnings[習得スキルindex].meta.a に
"AAA" が設定されます。
booleanに関しても、その他各種データのメタデータ同様の仕様で設定されます。
*/

(() => {
  'use strict';

  const _DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function (object) {
    _DataManager_onLoad.call(this, object);
    if (object === $dataClasses) {
      object
        .filter((clazz) => clazz)
        .forEach((clazz) => {
          this.extractArrayMetadata(clazz.learnings);
        });
    }
  };
})();
