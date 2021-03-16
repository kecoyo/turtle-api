module.exports = (Modal) =>
  class extends Modal {
    /**
     * 保存对象，添加或修改。
     * @param {*} obj
     */
    // async save(obj) {
    //   if (obj.id) {
    //     obj.updated_at = ['exp', 'CURRENT_TIMESTAMP()'];
    //     // eslint-disable-next-line no-unused-vars
    //     const affectedRows = await this.update(obj);
    //     return obj.id;
    //   } else {
    //     obj.created_at = ['exp', 'CURRENT_TIMESTAMP()'];
    //     obj.updated_at = ['exp', 'CURRENT_TIMESTAMP()'];
    //     const insertId = await this.add(obj);
    //     return insertId;
    //   }
    // }
    /**
     * 保存多个对象，添加或修改。
     * @param {*} list
     */
    async saveMany(list) {
      for (let i = 0; i < list.length; i++) {
        await this.save(list[i]);
      }
    }

    /**
     * 删除对象
     */
    async deleteOne(obj) {
      await this.where({ id: typeof obj === 'object' ? obj.id : obj })
        .setRelation(false)
        .delete();
    }

    /**
     * 删除对象列表
     */
    async deleteMany(list) {
      for (let i = 0; i < list.length; i++) {
        await this.deleteOne(list[i]);
      }
    }

    /**
     * 通过条件查询删除
     * @param {object} where
     */
    async deleteWhere(where) {
      await this.where(where).setRelation(false).delete();
    }

    /**
     * 删除对象
     */
    async remove(obj) {
      await this.where({ id: obj.id }).delete();
    }

    /**
     * 删除对象列表
     */
    async removeMany(list) {
      const ids = list.map((o) => o.id).join(',');
      const affectedRows = await this.where({ id: ['IN', ids] }).delete();
      return affectedRows;
    }

    /**
     * 通过条件查询删除
     * @param {object} where
     */
    async removeWhere(where) {
      const affectedRows = await this.where(where).delete();
      return affectedRows;
    }
  };
