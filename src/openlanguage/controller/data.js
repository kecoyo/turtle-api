const { readSync } = require('readdir');
const fs = require('fs-extra');
const { webp2jpg } = require('../utils/image-utils');

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
    const files = readSync(BASE_PATH, ['src/A1.中/**.txt']);

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

  // webp2jpgAction() {
  // const result = webp2jpg(`${BASE_PATH}/src/A0/01.webp`, `${BASE_PATH}/src/A0/01.jpg`);
  // console.log('🚀 ~ extends ~ webp2jpgAction ~ result', result);
  // this.body = 'success';
  // }


  base64ToStringAction () {
    this.body = base64ToString
  }

};
