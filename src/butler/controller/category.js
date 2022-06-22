const _ = require('lodash');

/**
 * 账号分类
 */
module.exports = class extends think.Controller {
  /**
   * @api {get} /butler/category/list   1.获取分类列表
   * @apiGroup 账号分类
   *
   * @apiSuccess {Object[]} data  分类列表
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *       {
   *         "id": 1017,  // 分类ID
   *         "name": "网站登录",  // 分类名称
   *         "icon": "//cdn.kecoyo.com/upload/butler_icon/ae/5884ca328c3e5c7eb3df7e4c55525a.png", // 分类图标URL
   *         "remark": "",  // 备注
   *         "sort": 1, // 排序号
   *         "create_at": "2021-01-25 00:03:35",  // 创建时间
   *         "status": 1, // 激活状态
   *         "is_deleted": 0, // 是否删除
   *         "count": 20,  // 分类下账号数
   *       },
   *       ...
   *     ]
   */
  async listAction() {
    const categorys = await this.model('category').where({ is_deleted: 0, status: 1 }).order('sort asc').select();

    // 分组统计count
    const groupList = await this.model('account')
      .where({ is_deleted: 0, status: 1 })
      .group('category_id')
      .field('category_id, count(*) as count')
      .select();

    // keyBy
    const countMap = _.keyBy(groupList, 'category_id');

    categorys.forEach((item) => {
      item.count = countMap[item.id] ? countMap[item.id].count : 0;
    });

    this.success(categorys);
  }

  /**
   * @api {get} /butler/category/detail   2.获取分类详情
   * @apiGroup 账号分类
   *
   * @apiParam {Number} id 分类ID
   *
   * @apiSuccess {Object} data  分类对象
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "id": 1017,  // 分类ID
   *       "name": "网站登录",  // 分类名称
   *       "icon": "//cdn.kecoyo.com/upload/butler_icon/ae/5884ca328c3e5c7eb3df7e4c55525a.png", // 分类图标URL
   *       "remark": "",  // 备注
   *       "sort": 1, // 排序号
   *       "create_at": "2021-01-25 00:03:35",  // 创建时间
   *       "status": 1, // 激活状态
   *       "is_deleted": 0, // 是否删除
   *     }
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
   * @api {post} /butler/category/add 3.添加账号分类
   * @apiGroup 账号分类
   *
   * @apiParam {String} name  分类名称
   * @apiParam {String} icon  图标URL
   * @apiParam {Number} sort  排序号
   *
   * @apiSuccess {Number} data  新插入分类的ID
   *
   */
  async addAction() {
    const { name, icon } = this.post();

    // 获取新排序号
    const list = await this.model('category').where({ is_deleted: 0, status: 1 }).order('sort asc').select();
    const sort = list.length + 1;

    // 插入
    const insertId = await this.model('category').add({ name, icon, sort });

    return this.success(insertId);
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
    const affectedRows = await this.model('category').update({ id, name, icon, sort });
    return this.success(affectedRows);
  }

  /**
   * @api {post} /butler/category/saveList  5.保存账号分类列表
   * @apiGroup 账号分类
   *
   * @apiParam {Number[]} ids    分类ID
   *
   * @apiSuccess {Boolean} data  操作成功
   */
  async saveListAction() {
    try {
      const { ids } = this.post();

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
