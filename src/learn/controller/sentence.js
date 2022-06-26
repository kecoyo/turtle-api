const fs = require('fs');
const path = require('path');
// const { pinyin, Pinyin } = require('pinyin');
const _ = require('lodash');
const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return 'OK';
  }

  async insertAction() {
    const content = fs.readFileSync(path.resolve(think.APP_PATH, 'learn/controller/data.txt'), 'utf-8');
    const lines = content.split('\n');

    let list = [];
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      line = line.split('|');

      if (line[0]) {
        let item = {
          name_en: line[0],
          name_zh: line[1],
        };
        list.push(item);
      }
    }

    let model = this.model('sentence');
    let insertIds = await model.addSentenceList(list);

    return this.success(insertIds);
  }

  async pinyinAction() {
    let { text = '' } = this.get();

    let py = new Pinyin();
    let pinyin_zh = py.segment(text);

    let pinyin_en = [];
    for (let j = 0; j < pinyin_zh.length; j++) {
      const word = pinyin_zh[j];
      const word_pinyin = pinyin(word, { segment: true, group: true });
      pinyin_en.push(word_pinyin);
    }
    pinyin_en = _.flattenDeep(pinyin_en);

    let data = {
      pinyin_en,
      pinyin_zh,
    };

    return this.success(data);
  }

  async pinyin2Action() {
    let { type = '' } = this.get();

    let model = this.model('sentence');
    let total = 0;
    let list = null;
    var py = new Pinyin();

    if (type === 'all') {
      list = await model.select();
    } else if (type === 'test') {
      list = await model.limit(50).select();
    } else {
      list = await model.where("pinyin is null or pinyin_zh is null or pinyin = '' or pinyin_zh = ''").select();
    }

    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      item.pinyin_zh = py.segment(item.name_zh);

      let pinyin_zhpy = [];
      for (let j = 0; j < item.pinyin_zh.length; j++) {
        const word = item.pinyin_zh[j];
        const word_pinyin = pinyin(word, { segment: true, group: true });
        pinyin_zhpy.push(word_pinyin);
      }
      item.pinyin = _.flattenDeep(pinyin_zhpy);

      let affectedRows = await model.where({ id: item.id }).update({
        pinyin: JSON.stringify(item.pinyin),
        pinyin_zh: JSON.stringify(item.pinyin_zh),
      });
      total += affectedRows;
    }

    return this.success(total);
  }

  async listAction() {
    let model = this.model('sentence');
    let list = await model.page(1, 20).countSelect();
    return this.success(list);
  }
};
