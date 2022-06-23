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

      if (!exist) {
        let content = fs.readFileSync(BASE_PATH + file, 'utf-8');
        content = this.octal2ChineseFile(content, file);
        fs.writeFileSync(BASE_PATH + newFile, content);
      }
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

  /////////////////////////////////////////////////////////////////////////////////

  toJsonAll() {
    // src\B2.职场攻略\05\5.txt2
    // const files = readSync(BASE_PATH, ['src/**/*.txt2']);
    const files = readSync(BASE_PATH, ['src/B2.职场攻略/05/5.txt2']);

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let newFile = file.replace('.txt2', '.json');
      let exist = fs.existsSync(BASE_PATH + newFile);

      // if (!exist) {
      let content = fs.readFileSync(BASE_PATH + file, 'utf-8');
      content = this.toJsonFile(content, file);
      // fs.writeFileSync(BASE_PATH + newFile, content);
      // }
    }
  }

  toJsonFile(content, fileName) {
    if (fileName.includes('list')) {
      return this.toJsonList(content, fileName);
    } else {
      return this.toJsonCourse(content, fileName);
    }
  }

  toJsonList(content, fileName) {
    // let matches = content.match(/\n5: "(.*)"/g);
    // if (matches) {
    //   let result = /\n5: "(.*)"/g.exec(matches[0]);
    //   let courseName = result[1];
    //   // console.log('🚀 ~ extends ~ toJsonFile ~ courseName', courseName);
    // }
    // let threes = [];
    // let four = '';
    // let five = '';
    // let lines = content.split('\n');
    // for (let i = 0; i < lines.length; i++) {
    //   let line = lines[i];
    //   if (line.startsWith('3 {')) {
    //     threes.push(line);
    //   } else if (line.startsWith('4: 300')) {
    //     four = line;
    //   } else if (line.startsWith('5: "')) {
    //     five = line;
    //   } else {
    //     threes[threes.length - 1] += line;
    //   }
    // }
    // console.log(threes.length, five);
    // // return lines.join('\n');
  }

  toJsonCourse(content, fileName) {
    let threes = [];
    let four = '';
    let five = '';

    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.startsWith('3 {')) {
        threes.push(line + '\n');
      } else if (line.startsWith('4: 300')) {
        four = line;
      } else if (line.startsWith('5: "')) {
        five = line;
      } else {
        threes[threes.length - 1] += line + '\n';
      }
    }

    let result = /5: "(.*)"/g.exec(five);
    let courseName = result[1];

    console.log(threes.length, courseName);

    const threeToJson = (three) => {
      let tabType = 1;
      let threeTypes = [];

      let lines = three.split('\n');
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.startsWith('  1: ')) {
          let result = /  1: (\d)/g.exec(line);
          tabType = Number(result[1]);
        }
      }
    };

    for (let i = 0; i < threes.length; i++) {
      const three = threes[i];
      threeToJson(three);
    }

    // return lines.join('\n');
  }
};
