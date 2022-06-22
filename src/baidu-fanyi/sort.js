const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const content = fs.readFileSync(path.resolve('./src/baidu-fanyi/sort-data.txt'), 'utf-8');

let lines = content.split('\n');
lines = lines.map((line) => line.split('|'));
lines = _.sortBy(lines, '[0]');

let content2 = '';
for (const line of lines) {
  content2 += line[0] + ' ' + line[1] + '\n';
}

console.log('🚀 ~ content2', content2);
fs.writeFileSync(path.resolve('./src/baidu-fanyi/sort-data_output.txt'), content2, 'utf-8');
