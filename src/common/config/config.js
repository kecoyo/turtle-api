// default config
module.exports = {
  workers: 1, // 指定子进程的数量，默认为 `0`（当前 cpu 的个数）

  // imgUrl
  imgUrl: 'https://cdn.kecoyo.com/',

  // ...
  jwt: {
    secret: 'turtle-api-secret',
    expire: 60 * 60 * 24 * 3, // 单位：秒
  },

};
