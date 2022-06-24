const fs = require('fs');
const path = require('path');
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

  async listAction() {
    let model = this.model('sentence');
    let list = await model.page(1, 200).countSelect();
    return this.success(list);
  }
};
