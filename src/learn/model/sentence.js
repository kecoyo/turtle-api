const Base = require('./base');

module.exports = class extends Base {
  // 添加句子
  async addSentence(sentence) {
    let insertId = await this.thenAdd(sentence, {
      name_en: sentence.name_en,
    });
    return insertId;
  }

  // 添加多个句子
  async addSentenceList(list = []) {
    let insertIds = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[0];
      let insertId = await this.addSentence(item);
      if (insertId) {
        insertIds.push(insertId);
      }
    }
    return insertIds;
  }
};
