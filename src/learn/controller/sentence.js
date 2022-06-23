const fs = require('fs');
const path = require('path');
const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return 'OK';
  }

  // async insertAction() {
  //   const content = fs.readFileSync(path.resolve(think.APP_PATH, 'learn/controller/data.txt'), 'utf-8');
  //   const lines = content.split('\n');
  //   const model = this.model('sentence'); // controller 里实例化模型
  //   const insertIds = [];

  //   for (let i = 0; i < lines.length; i++) {
  //     let line = lines[i];
  //     line = line.split('|');

  //     if (line[0]) {
  //       let insertId = await model.add(
  //         {
  //           name_en: line[0],
  //           name_zh: line[1],
  //         },
  //         {
  //           replace: true,
  //         }
  //       );
  //       insertIds.push(insertId);
  //     }
  //   }

  //   return this.success(insertIds);
  // }
};
