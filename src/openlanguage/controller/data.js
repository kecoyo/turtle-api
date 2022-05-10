const fs = require('fs-extra');
const { readSync } = require('readdir');

const BASE_PATH = '../openlanguage/';

module.exports = class extends think.Controller {
  // service
  dataService = think.service('data', 'openlanguage');

  indexAction() {
    return this.success('Hello world!');
  }

  listFilesAction() {
    const files = this.dataService.getTxtFiles();
    return this.success(files);
  }

  octal2ChineseAction() {
    this.dataService.octal2ChineseAll();
    return this.success(true);
  }

  webp2jpgAction() {
    think.webp2jpg(`${BASE_PATH}/src/A0/01.webp`, `${think.ROOT_PATH}/temp/01.jpg`);
    this.ctx.type = 'jpeg';
    this.ctx.body = fs.createReadStream(`${think.ROOT_PATH}/temp/01.jpg`);
  }

  base64ToStringAction() {
    const base64 =
      'aHR0cHM6Ly92My5vcGVubGFuZ3VhZ2UuY29tLzgwMmM1YTQ1ZjZkYmQ2NGU1NzFlYTljYzI4ODg1YzQyLzYyNmEzYTMyL3ZpZGVvL3Rvcy9jbi90b3MtY24tdmUtODEvYjQ5ZDgwYmExYzBjNDM1MmFhZWY2NGU3YmE4ZDAzNTEvP2NkPTAlN0MwJTdDMCU3QzAmYnI9MTMzJmJ0PTEzMyZjcz0wJmZ0PWUtMUFZMjJIamFsOU15Qk15cXNRMS1DNXFTWU1zS1RFRHRHcHU0ODZ5cTgmbWltZV90eXBlPWF1ZGlvX21wNCZxcz02JnJjPWFUdGxPMmxtWjJrME4yazhaems3T0VCcE0zUXpkblZ0ZUdWdmR6TXpOVFF6TTBBMFlEVXhZUzh2Tmk4eE5sOWhZR0JlWVNOeVlXRnBjVzVqWm1oZkxTMHpNaTl6Y3clM0QlM0QmbD0yMDIyMDQyODEzNTQ0MTAxMDEzODE2ODE5NDBBRDc1MzU4';
    this.body = think.base64ToString(base64);
  }
};
