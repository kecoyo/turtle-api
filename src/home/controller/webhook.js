const _ = require('lodash');
/**
 * WebHook
 */
module.exports = class extends think.Controller {
  /**
   * @api {post} /api/webhook/push   1.git push webhook
   * @apiGroup WebHook
   *
   * @apiSuccess {Object[]} data  stdout
   *
   */
  async pushAction() {
    const headers = this.ctx.header;
    const body = this.post();

    // think.logger.debug('headers:', headers);
    // think.logger.debug('body:', body);

    let hookEvents = _.get(body, 'hook.events', '');
    let senderLogin = _.get(body, 'sender.login', '');
    let repositoryName = _.get(body, 'repository.name', '');

    if (this.isPost && senderLogin === 'kecoyo') {
      // turtle-api
      if (repositoryName === 'turtle-api') {
        try {
          const cmd = 'git pull';
          console.log('🚀 ~ extends ~ pushAction ~ cmd', cmd);
          const result = await think.exec(cmd);
          think.logger.info(`exec command: ${cmd}\n\n${result}`);
          return this.success(result);
        } catch (e) {
          think.logger.error(e);
          return this.fail(e.message);
        }
      }
    }
  }
};
