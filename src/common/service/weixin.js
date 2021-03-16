const http = require('https');

module.exports = class extends think.Service {
  /**
   * 登录凭证校验。
   * @param {*} appId
   * @param {*} secret
   * @param {*} code
   * @param {*} grantType
   */
  async jscode2session(appid, secret, code, grantType = 'authorization_code') {
    const result = await new Promise((resolve, reject) => {
      const jscode2session = 'https://api.weixin.qq.com/sns/jscode2session';
      const url = `${jscode2session}?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=${grantType}`;
      var req = http.get(url, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          resolve(JSON.parse(chunk));
        });
      });
      req.on('error', function(e) {
        reject(e.message);
      });
      req.end();
    });
    return result;
  }
};
