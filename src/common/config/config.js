// default config
module.exports = {
  workers: 1,

  // imgUrl: 'http://127.0.0.1:8360/',
  imgUrl: '//cdn.kecoyo.com/',

  // ...
  jwt: {
    secret: 'turtle-api-secret',
    expire: 60 * 60 * 24 * 3, // 单位：秒
  },
};
