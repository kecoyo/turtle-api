const jwt = require('jsonwebtoken');

module.exports = class extends think.Service {
  /**
   * 签名生成token.
   */
  async sign(payload) {
    const { secret, expire } = think.config('jwt');
    const token = jwt.sign(payload, secret, { expiresIn: expire });
    think.logger.debug('token:', token);
    return token;
  }
};
