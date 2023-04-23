const _ = require('lodash');
const Base = require('./base');

/**
 * 账号分类
 */
module.exports = class extends Base {
  /**
   * @api {get} /butler/category/list 获取分类列表
   * @apiGroup 账号分类
   *
   * @apiSuccess {Object[]} data  分类列表
   */
  async listAction() {
    // 分类列表
    const categorys = await this.model('category').where({ is_deleted: 0, status: 1 }).order('sort asc').select();

    // 统计每个分类下账号数量
    const groupList = await this.model('account')
      .where({ is_deleted: 0, status: 1 })
      .group('category_id')
      .field('category_id, count(*) as count')
      .select();

    // 将账号数量加入分类列表中
    const groupMap = _.keyBy(groupList, 'category_id');
    categorys.forEach((item) => {
      item.count = groupMap[item.id] ? groupMap[item.id].count : 0;
    });

    this.success(categorys);
  }

  /**
   * @api {get} /butler/category/detail 获取分类详情
   * @apiGroup 账号分类
   *
   * @apiParam {Number} id 分类ID
   *
   * @apiSuccess {Object} data  分类对象
   */
  async detailAction() {
    const { id } = this.get();
    const category = await this.model('category').where({ id }).find();
    if (think.isEmpty(category)) {
      return this.fail('object not found');
    }
    return this.success(category);
  }

  /**
   * @api {post} /butler/category/add 添加账号分类
   * @apiGroup 账号分类
   *
   * @apiParam {String} name  分类名称
   * @apiParam {String} icon  图标URL
   *
   * @apiSuccess {Number} data  新插入分类的ID
   *
   */
  async addAction() {
    const { name, icon } = this.post();

    try {
      // 获取新排序号
      const count = await this.model('category').where({ is_deleted: 0, status: 1 }).count();
      const sort = count + 1;

      // 插入
      const insertId = await this.model('category').add({ name, icon, sort });

      return this.success(insertId);
    } catch (err) {
      return this.fail(err.message);
    }
  }

  /**
   * @api {post} /butler/category/update  4.修改账号分类
   * @apiGroup 账号分类
   *
   * @apiParam {Number} id    分类ID
   * @apiParam {String} name  分类名称
   * @apiParam {String} icon  图标URL
   * @apiParam {Number} sort  排序号
   *
   * @apiSuccess {Number} data  影响的行数
   *
   */
  async updateAction() {
    const { id, name, icon, sort } = this.post();
    try {
      const affectedRows = await this.model('category').update({ id, name, icon, sort });
      return this.success(affectedRows);
    } catch (err) {
      return this.fail(err.message);
    }
  }

  /**
   * @api {post} /butler/category/delete 删除账号分类
   * @apiGroup 账号分类
   *
   * @apiParam {Number} id 分类ID
   *
   * @apiSuccess {Boolean} data 操作成功
   */
  async deleteAction() {
    const { id } = this.post();
    try {
      const affectedRows = await this.model('category').where({ id: id }).update({ is_deleted: 1 });
      return this.success(affectedRows);
    } catch (err) {
      return this.fail(err.message);
    }
  }

  /**
   * @api {post} /butler/category/saveList 保存账号分类列表
   * @apiGroup 账号分类
   *
   * @apiParam {Number[]} ids    分类ID
   *
   * @apiSuccess {Boolean} data  操作成功
   */
  async saveListAction() {
    const { ids } = this.post();

    try {
      // 更新列表排序
      const list = ids.map((id, i) => ({ id, sort: i + 1 }));
      await this.model('category').updateMany(list);

      // 修改删除的状态
      await this.model('category')
        .where({ is_deleted: 0, status: 1, id: ['NOTIN', ids] })
        .update({ status: 0 });

      this.success(true);
    } catch (err) {
      this.fail(err.message);
    }
  }
};
