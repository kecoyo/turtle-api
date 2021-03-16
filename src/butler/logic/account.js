module.exports = class extends think.Logic {
  listAction() {
    this.rules = {
      categoryId: {
        method: 'GET',
        required: true,
        int: true
      }
    };
  }

  detailAction() {
    this.rules = {
      id: {
        method: 'GET',
        required: true,
        int: true
      }
    };
  }
};
