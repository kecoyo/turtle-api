/* eslint-disable new-cap */
/**
 * string转为base64
 */
function stringToBase64(str) {
  return new Buffer.from(str).toString('base64');
}

exports.stringToBase64 = stringToBase64;

/**
 * base64转字符串
 */
function base64ToString(b64) {
  return new Buffer.from(b64, 'base64').toString();
}

exports.stringToBase64 = base64ToString;
