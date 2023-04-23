// default config
module.exports = {
  workers: 1, // 指定子进程的数量，默认为 `0`（当前 cpu 的个数）

  imgUrl: 'https://cdn.kecoyo.com/',

  jwt: {
    secret: 'turtle-butler-secret',
    expire: 60 * 60 * 24 * 3, // 单位：秒
  },

  // 七牛存储服务器配置
  qiniu: {
    accessKey: '********************',
    secretKey: '********************',
    bucket: '********************',
  },

  // 是否上传到七牛存储服务器
  isUploadQiniu: true,
};
