const fs = require('fs');
const Base = require('./base');
const mime = require('mime-types');

module.exports = class extends Base {
  async indexAction() {
    const text = await this.fetch('https://baidu.com/').then(res => res.text());
    return this.success(text);
  }

  // 保存流
  async streamAction() {
    const res = await this.fetch('https://bkimg.cdn.bcebos.com/pic/30adcbef76094b36acafc592d29a6bd98d1001e9370f?x-bce-process=image/resize,m_lfit,w_536,limit_1');
    const dest = fs.createWriteStream('./temp/octocat.png');
    res.body.pipe(dest);
  }

  // 输出流
  async stream2Action() {
    const res = await this.fetch('https://bkimg.cdn.bcebos.com/pic/30adcbef76094b36acafc592d29a6bd98d1001e9370f?x-bce-process=image/resize,m_lfit,w_536,limit_1');
    this.ctx.type = mime.types.png;
    this.ctx.body = res.body;
  }

  // 下载流
  async stream3Action() {
    const res = await this.fetch('https://bkimg.cdn.bcebos.com/pic/30adcbef76094b36acafc592d29a6bd98d1001e9370f?x-bce-process=image/resize,m_lfit,w_536,limit_1');
    this.ctx.attachment('octocat.png');
    this.ctx.body = res.body;
  }
};
