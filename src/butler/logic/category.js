module.exports = class extends think.Logic {
  detailAction() {
    this.rules = {
      id: { method: 'GET', required: true, int: true },
    };
  }

  addAction() {
    this.rules = {
      name: { method: 'POST', required: true, string: true, trim: true },
      icon: { method: 'POST', required: true, string: true, trim: true },
    };
  }

  updateAction() {
    this.rules = {
      id: { method: 'POST', required: true, int: true },
      name: { method: 'POST', required: true, string: true, trim: true },
      icon: { method: 'POST', required: true, string: true, trim: true },
      sort: { method: 'POST', required: true, int: true },
    };
  }

  deleteAction() {
    this.rules = {
      id: { method: 'GET', required: true, int: true },
    };
  }
};
