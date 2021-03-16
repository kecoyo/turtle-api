const qiniu = require('qiniu');

module.exports = class extends think.Service {
  constructor() {
    super();
    var accessKey = 'R6qzlwVu3gfWY05dmxZKtTshgr5RWTjPbymx0-Lk';
    var secretKey = 'nxAedGNYipoqrVS4lI_1ofyZbr3N12b8re-_Duha';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var bucket = 'zaifumo';
    var config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z1; // 空间对应的机房
    var bucketManager = new qiniu.rs.BucketManager(mac, config);

    // 自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
    var putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket,
    });
    var uploadToken = putPolicy.uploadToken(mac);
    var formUploader = new qiniu.form_up.FormUploader(config);

    this.bucket = bucket;
    this.bucketManager = bucketManager;
    this.uploadToken = uploadToken;
    this.formUploader = formUploader;
  }

  promiseify(fn) {
    return function() {
      let args = Array.prototype.slice.call(arguments);
      return new Promise((resolve, reject) => {
        fn(...args, function(err, respBody, respInfo) {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.status === 200) {
            resolve(respBody);
          } else {
            reject(new Error(respBody.error));
          }
        });
      });
    };
  }

  stat(key) {
    const stat = this.bucketManager.stat.bind(this.bucketManager);
    return this.promiseify(stat)(this.bucket, key);
  }

  delete(key) {
    const del = this.bucketManager.delete.bind(this.bucketManager);
    return this.promiseify(del)(this.bucket, key);
  }

  move(srcKey, destKey, options) {
    const move = this.bucketManager.move.bind(this.bucketManager);
    return this.promiseify(move)(this.bucket, srcKey, this.bucket, destKey, options);
  }

  // 每个operations的数量不可以超过1000个，如果总数量超过1000，需要分批发送
  batchStat(keys) {
    const statOperations = keys.map(key => qiniu.rs.statOp(this.bucket, key));
    const batch = this.bucketManager.batch.bind(this.bucketManager);
    return this.promiseify(batch)(statOperations);
  }

  // 每个operations的数量不可以超过1000个，如果总数量超过1000，需要分批发送
  batchDelete(keys) {
    const statOperations = keys.map(key => qiniu.rs.deleteOp(this.bucket, key));
    const batch = this.bucketManager.batch.bind(this.bucketManager);
    return this.promiseify(batch)(statOperations);
  }

  putFile(key, file) {
    var putExtra = new qiniu.form_up.PutExtra();
    const putFile = this.formUploader.putFile.bind(this.formUploader);
    return this.promiseify(putFile)(this.uploadToken, key, file, putExtra);
  }
};
