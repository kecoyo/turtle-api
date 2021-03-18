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
    // const body = this.post();

    // think.logger.debug('headers:', headers);
    // think.logger.debug('body:', body);

    if (this.isPost && headers['x-gitee-token'] === 'kecoyo' && headers['x-gitee-event'] === 'Push Hook') {
      try {
        var cmd = 'git pull';
        const result = await think.exec(cmd);
        think.logger.info('exec command: ' + cmd + '\n\n' + result);
        return this.success(result);
      } catch (e) {
        think.logger.error(e);
        return this.fail(e.message);
      }
    }

    think.logger.warn('请求失败！');
    think.logger.warn(JSON.stringify(headers));
    // return this.fail('请求失败！', headers);
  }
};
