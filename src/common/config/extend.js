const view = require('think-view');
const model = require('think-model');
const cache = require('think-cache');
const session = require('think-session');
const extendModel = require('../extend/model');

// 扩展 Model
const model2 = model(think.app);
model2.think.Model = extendModel(model2.think.Model);

module.exports = [
  view, // make application support view
  model2,
  cache,
  session
];
