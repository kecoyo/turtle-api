const _ = require('lodash');

/**
 * 账号
 */
module.exports = class extends think.Controller {
  /**
   * 获得当前Modeal对象
   */
  getModel() {
    return this.model('account');
  }

  /**
   * @api {get} /butler/account/list   1.获取账号列表
   * @apiGroup 账号
   *
   * @apiParam {Number} categoryId  账号分类ID
   *
   * @apiSuccess {Object[]} data  账号列表
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *       {
   *         "id": 3668,  // 账号ID
   *         "category_id": 1017,  // 账号分类ID
   *         "name": "个人征信",  // 账号名称
   *         "icon": "//cdn.kecoyo.com/upload/butler_icon/ae/5884ca328c3e5c7eb3df7e4c55525a.png", // 账号图标URL
   *         "properties": [],  // 属性
   *         "pictures": [],    // 照片
   *         "remark": "",  // 备注
   *         "sort": 1, // 排序号
   *         "create_at": "2021-01-25 00:03:35",  // 创建时间
   *         "status": 1, // 激活状态
   *         "is_deleted": 0, // 是否删除
   *         "subtitle": "kecoyo",  // 第一个属性值
   *       },
   *       ...
   *     ]
   */
  async listAction() {
    const { categoryId } = this.get();

    const accounts = await this.model('account')
      .where({ is_deleted: 0, status: 1, category_id: categoryId })
      .order('sort asc')
      .select();

    // 解析属性和照片
    accounts.forEach((account) => {
      this.parseAccount(account);

      // 第一属性值作为子标题
      if (account.properties.length > 0) {
        account.subtitle = account.properties[0].value;
      } else {
        account.subtitle = '';
      }
    });

    return this.success(accounts);
  }

  /**
   * @api {get} /butler/account/detail   2.获取账号详情
   * @apiGroup 账号
   *
   * @apiParam {Number} id 账号ID
   *
   * @apiSuccess {Object} data  账号对象
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "id": 3668,  // 账号ID
   *       "category_id": 1017,  // 账号分类ID
   *       "name": "个人征信",  // 账号名称
   *       "icon": "//cdn.kecoyo.com/upload/butler_icon/ae/5884ca328c3e5c7eb3df7e4c55525a.png", // 账号图标URL
   *       "properties": [],  // 属性
   *       "pictures": [],    // 照片
   *       "remark": "",  // 备注
   *       "sort": 1, // 排序号
   *       "create_at": "2021-01-25 00:03:35",  // 创建时间
   *       "status": 1, // 激活状态
   *       "is_deleted": 0, // 是否删除
   *     }
   */
  async detailAction() {
    const { id } = this.get();

    const account = await this.model('account').where({ id }).find();

    if (think.isEmpty(account)) {
      return this.fail('data not found');
    }

    this.parseAccount(account);

    return this.success(account);
  }

  /**
   * @api {get} /butler/account/add   3.添加账号
   * @apiGroup 账号
   *
   * @apiParam {Number} category_id     所属分类ID
   * @apiParam {String} name            账号名称
   * @apiParam {String} icon            账号图标
   * @apiParam {Object[]} properties    属性列表
   * @apiParam {Object[]} pictures      照片列表
   * @apiParam {String} remark          备注
   *
   * @apiSuccess {Object} data  新账号id
   */
  async addAction() {
    const { account } = this.post();
    this.stringifyAccount(account);
    account.id = await this.model('account').add({
      ..._.pick(account, ['category_id', 'name', 'icon', 'pictures', 'properties', 'remark']),
    });
    return this.success(account.id);
  }

  /**
   * @api {get} /butler/account/update   4.修改账号
   * @apiGroup 账号
   *
   * @apiParam {Number} id              账号ID
   * @apiParam {String} name            账号名称
   * @apiParam {String} icon            账号图标
   * @apiParam {Object[]} properties    属性列表
   * @apiParam {Object[]} pictures      照片列表
   * @apiParam {String} remark          备注
   *
   * @apiSuccess {Object} data  操作成功
   */
  async updateAction() {
    const { account } = this.post();
    this.stringifyAccount(account);
    await this.model('account')
      .where({ id: account.id })
      .update({
        ..._.pick(account, ['name', 'icon', 'pictures', 'properties', 'remark']),
      });
    return this.success(true, '操作成功');
  }

  /**
   * @api {post} /butler/account/saveList  5.保存列表
   * @apiGroup 账号
   *
   * @apiParam {Number} categoryId    当前分类ID
   * @apiParam {Number[]} ids    全部账号id列表，按顺序排序，并把不在列表中的移除。
   *
   * @apiSuccess {Boolean} data  操作成功
   */
  async saveListAction() {
    try {
      const { categoryId, ids } = this.post();

      // 更新列表排序
      const list = ids.map((id, i) => ({ id, sort: i + 1 }));
      await this.model('account').updateMany(list);

      // 修改状态为禁用，不可见
      await this.model('account')
        .where({ is_deleted: 0, status: 1, category_id: categoryId, id: ['NOTIN', ids] })
        .update({ status: 0 });

      this.success(true, '保存成功');
    } catch (err) {
      this.fail(err.message);
    }
  }

  /**
   * @api {post} /butler/account/uploadPicture  6.上传图片
   * @apiGroup 账号
   *
   * @apiParam {File} file 要上传图片
   *
   * @apiSuccess {Boolean} data  图片URL
   */
  async uploadPictureAction() {
    try {
      const { file } = this.file();
      const filePath = await think.uploadFile(file, 'account_picture');
      this.success(this.config('imgUrl') + filePath);
    } catch (error) {
      this.fail(error.message);
    }
  }

  stringifyAccount(account) {
    account.properties = JSON.stringify(account.properties || []);
    account.pictures = (account.pictures || []).map((pic) => pic.url).join('|');
  }

  parseAccount(account) {
    account.properties = JSON.parse(account.properties || '[]');
    account.pictures = account.pictures ? account.pictures.split('|') : [];
    account.pictures = account.pictures.map((url) => ({ url, upload: true }));
  }
};
