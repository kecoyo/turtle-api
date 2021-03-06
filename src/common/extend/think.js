const path = require('path');
const fs = require('fs');
const md5 = require('md5');
const isDev = think.env === 'development';

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
   * 是否路径存在
   */
  exists(file) {
    return fs.existsSync(file);
  },

  /**
   * 复制文件
   */
  copyFile(src, dest) {
    this.mkdir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  },

  /**
   * 移动文件
   */
  moveFile(src, dest) {
    this.mkdir(path.dirname(dest));
    fs.renameSync(src, dest);
  },

  /**
   * 删除文件
   */
  deleteFile(file) {
    // 删除文件
    fs.unlinkSync(file);
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
   * 上传文件
   * @param {*} file
   * @param {*} typeDir
   */
  async uploadFile(file, typeDir = 'temp') {
    const fileName = file.name;
    const extName = path.extname(fileName).toLowerCase();

    const content = fs.readFileSync(file.path);
    const newFileName = think.md5(content) + extName;
    const newFilePath = path.join('upload', typeDir, newFileName.substr(0, 2), newFileName.substr(2));
    const newFile = path.join(think.WWW_PATH, newFilePath);

    this.moveFile(file.path, newFile);

    // 只有是生产环境才上传qiniu服务器上
    // if (!isDev) {
    await think.service('qiniu').putFile(newFilePath, newFile);
    // }

    return newFilePath;
  },

  /**
   * 检查用户授权，装饰器
   * @param {*} target
   * @param {*} name
   * @param {*} descriptor
   */
  checkAuth(target, name, descriptor) {
    const action = descriptor.value;
    descriptor.value = function () {
      const { user } = this.ctx.state;
      if (!user) {
        return this.ctx.throw('JWT 验证失败', 401);
      }
      return action.apply(this, arguments);
    };
    return descriptor;
  },
};
