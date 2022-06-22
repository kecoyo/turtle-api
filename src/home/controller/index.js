const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }

  listFilesAction() {
    const files = think.getdirFiles('./src');
    return this.success(files);
  }
};
