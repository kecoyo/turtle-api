const _ = require('lodash');

/**
 * 图标分类
 */
module.exports = class extends think.Controller {
  /**
   * @api {get} /butler/icon/list   1.获取图标分类列表
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
  async listAction() {
    const iconTypeList = await this.model('icon_type')
      .field('id,name')
      .where({ status: 1, is_deleted: 0 })
      .order('sort ASC, id ASC')
      .select();

    const iconTypeMap = _.keyBy(iconTypeList, 'id');

    const iconList = await this.model('icon') //
      .field('id,type_id,url')
      .where({ status: 1, is_deleted: 0 })
      .order('sort ASC, id ASC')
      .select();

    iconList.forEach((icon) => {
      let iconType = iconTypeMap[icon.type_id];
      if (iconType) {
        (iconType.icons || (iconType.icons = [])).push(icon.url);
      }
    });

    return this.success(iconTypeList);
  }
};
