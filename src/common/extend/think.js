/* eslint-disable new-cap */
/* eslint-disable camelcase */
const path = require('path');
const fs = require('fs-extra');
const child_process = require('child_process');
const md5 = require('md5');

module.exports = {
  /**
   * www目录路径
   */
  WWW_PATH: path.join(think.ROOT_PATH, 'www/'),

  /**
   *
   * js function for hashing messages with MD5
   *
   * @param {string | Buffer | Array<number>} message a string or buffer to hash
   * @returns {string} the resultant MD5 hash of the given message
   */
  md5(message) {
    return md5(message);
  },

  /**
   * 复制文件或目录
   */
  copyFile(src, dest, options) {
    fs.copySync(src, dest, options);
  },

  /**
   * 移动文件或目录
   */
  moveFile(src, dest, options) {
    fs.moveSync(src, dest, options);
  },

  /**
   * 删除文件或目录
   */
  removeFile(file) {
    // 删除文件
    fs.removeSync(file);
  },

  /**
   * 读文件
   * options = null，返回Buffer，
   * options = 'utf8'，返回文本文件的内容
   */
  readFile(file, options) {
    return fs.readFileSync(file, options);
  },

  /**
   * 写文件
   */
  writeFile(file, data, options) {
    return fs.writeFileSync(file, data, options);
  },

  /**
   * 上传文件到upload目录，及上传到七牛对象存储服务器
   * @param {*} file
   * @param {*} typeDir
   */
  async uploadFile(file, typeDir = 'temp') {
    const fileName = file.name;
    const extName = path.extname(fileName).toLowerCase();

    const content = fs.readFileSync(file.path);
    const newFileName = this.md5(content) + extName;
    const newFilePath = path.join('upload', typeDir, newFileName.substr(0, 2), newFileName.substr(2));
    const newFile = path.join(think.WWW_PATH, newFilePath);

    this.moveFile(file.path, newFile, {
      overwrite: true,
    });

    const key = newFilePath.replace(/\\/g, '/');

    if (this.config('isUploadQiniu')) {
      await think.service('qiniu').putFile(key, newFile);
    }

    return key;
  },

  /**
   * 执行系统命令
   */
  exec(cmd) {
    return new Promise((resolve, reject) => {
      child_process.exec(cmd, (error, stdout) => {
        if (error) {
          return reject(new Error(error.message));
        }
        return resolve(stdout);
      });
    });
  },

  /**
   * string转为base64
   */
  stringToBase64(str) {
    return new Buffer.from(str).toString('base64');
  },

  /**
   * base64转字符串
   */
  base64ToString(str) {
    return new Buffer.from(str, 'base64').toString();
  },
};
