const { readSync } = require('readdir');
const fs = require('fs-extra');

const BASE_PATH = '../openlanguage/';

module.exports = class extends think.Service {
  /**
   * 获取全部txt文件列表
   * @returns
   */
  getTxtFiles() {
    const files = readSync(`${BASE_PATH}src/`, ['**.txt']);
    return files;
  }

  octal2ChineseAll() {
    const files = readSync(BASE_PATH, ['src/**.txt']);

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let newFile = file.replace('.txt', '.txt2');
      let exist = fs.existsSync(BASE_PATH + newFile);

      // if (!exist) {
      let content = fs.readFileSync(BASE_PATH + file, 'utf-8');
      content = this.octal2ChineseFile(content, file);
      fs.writeFileSync(BASE_PATH + newFile, content);
      // }
    }
  }

  octal2ChineseFile(content, fileName) {
    console.log(fileName);
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      try {
        lines[i] = this.octal2ChineseStr(lines[i], fileName);
      } catch (err) {
        console.log('Error:', err.message, lines[i]);
      }
    }
    return lines.join('\n');
  }

  octal2ChineseStr(str, fileName) {
    str = str.replaceAll('%', '%25');
    const matches = str.match(/(\\\d{3})+/g);
    if (matches) {
      matches.forEach((match) => {
        let encoded = '';
        let splits = match.split('\\');
        splits.forEach((code) => !code || (encoded += `%${parseInt(code, 8).toString(16)}`));
        str = str.replace(match, encoded);
      });
      try {
        str = decodeURIComponent(str);
      } catch (err) {
        console.log('🚀 ~ extends ~ octal2ChineseStr ~ err', err.message, str);
      }
    }
    return str;
  }
};
