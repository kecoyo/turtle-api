const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
  async indexAction() {
    const text = await this.fetch('https://baidu.com/').then((res) => res.text());
    return this.success(text);
  }

  // stream
  async streamAction() {
    const res = await this.fetch('https://assets-cdn.github.com/images/modules/logos_page/Octocat.png');
    const dest = fs.createWriteStream('./octocat.png');
    res.body.pipe(dest);
  }
};
