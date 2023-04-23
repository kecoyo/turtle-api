const _ = require('lodash');
const Base = require('./base');

/**
 * 图标分类
 */
module.exports = class extends Base {
  /**
   * @api {get} /butler/icon/list   1.获取图标分类列表
   * @apiGroup 图标分类
   *
   * @apiSuccess {Object[]} data  图标分类列表
   */
  async listAction() {
    const iconTypeList = await this.model('icon_type').field('id,name').where({ status: 1, is_deleted: 0 }).order('sort ASC, id ASC').select();

    const iconTypeMap = _.keyBy(iconTypeList, 'id');

    const iconList = await this.model('icon') //
      .field('id,type_id,url')
      .where({ status: 1, is_deleted: 0 })
      .order('sort ASC, id ASC')
      .select();

    iconList.forEach((icon) => {
      const iconType = iconTypeMap[icon.type_id];
      if (iconType) {
        (iconType.icons || (iconType.icons = [])).push(icon.url);
      }
    });

    return this.success(iconTypeList);
  }
};
