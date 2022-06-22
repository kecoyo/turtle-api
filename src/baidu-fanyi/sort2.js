const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const content = fs.readFileSync(path.resolve('./src/baidu-fanyi/sort-data.txt'), 'utf-8');

let lines = content.split('\n');
lines = _.sortBy(lines);

let content2 = '';
for (const line of lines) {
  content2 += line + '\n';
}

console.log('🚀 ~ content2', content2);
fs.writeFileSync(path.resolve('./src/baidu-fanyi/sort-data_output.txt'), content2, 'utf-8');
