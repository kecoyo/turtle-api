const _ = require('lodash');

/**
 * WebHook
 */
module.exports = class extends think.Controller {
  /**
   * @api {get} /api/webhook/push   1.git push webhook
   * @apiGroup 图标分类
   *
   * @apiSuccess {Object[]} data  图标分类列表
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *       {
   *         "id": 1,           // 分类ID
   *         "name": "应用类",   // 分类名称
   *         "icons": [         // 分类下图标列表
   *           "//cdn.kecoyo.com/upload/butler_icon/c8/de7389a98521305778402ba8afec13.png",
   *           "//cdn.kecoyo.com/upload/butler_icon/c8/de7389a98521305778402ba8afec13.png",
   *           ...
   *         ],
   *       },
   *       ...
   *     ]
   */
  async pushAction() {
    try {
      var cmd = 'git pull';
      const result = await think.exec(cmd);
      return this.success(result);
    } catch (e) {
      return this.fail(e.message);
    }
  }
};
