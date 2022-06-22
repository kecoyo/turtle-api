const fs = require('fs');
const path = require('path');
const request = require('./request');

function addWord({ fanyi_src, fanyi_dst }) {
  const data = {
    fanyi_src: fanyi_src,
    direction: 'en2zh',
    gid: '2236490',
    bdstoken: '8f2d401e4b5986fad353469af4df4e1f',
    fanyi_dst: fanyi_dst,
    dict: '',
    dict_json: '',
  };

  return request.post('https://fanyi.baidu.com/pcnewcollection?req=add', data);
}

async function main() {
  const content = fs.readFileSync(path.resolve('./src/baidu-fanyi/2.txt'), 'utf-8');

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const strs = line.split('|');
    const res = await addWord({ fanyi_src: strs[0], fanyi_dst: strs[1] });
    console.log(line, res);
  }
}

main();
