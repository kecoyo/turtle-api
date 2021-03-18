// default config
module.exports = {
  workers: 1,

  // imgUrl
  imgUrl: 'https://cdn.kecoyo.com/',

  // ...
  jwt: {
    secret: 'turtle-api-secret',
    expire: 60 * 60 * 24 * 3, // 单位：秒
  },
};
