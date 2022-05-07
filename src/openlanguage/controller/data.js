const jeselvmo = require('jeselvmo');
const { readSync, ReadDirOptions } = require('readdir');
const fs = require('fs-extra');

const BASE_PATH = '../openlanguage/';

module.exports = class extends think.Controller {
  indexAction() {
    return this.success('Hello world!');
  }

  listFilesAction() {
    const files = readSync(`${BASE_PATH}src/`, ['**.txt']);
    return this.success(files);
  }

  octal2ChineseAction() {
    const files = readSync(BASE_PATH, ['src/**.txt']);

    let content = '';

    // eslint-disable-next-line no-unreachable-loop
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      content = fs.readFileSync(BASE_PATH + file, 'utf-8');
      content = this.octal2Chinese(content);

      break;
    }

    this.body = content;
  }

  octal2Chinese(str) {
    const matches = str.match(/(\\\d{3})+/g);
    if (matches) {
      matches.forEach((match) => {
        let encoded = '';
        let splits = match.split('\\');
        splits.forEach((code) => !code || (encoded += `%${parseInt(code, 8).toString(16)}`));
        str = str.replace(match, encoded);
      });
      str = decodeURIComponent(str);
    }
    return str;
  }
};
