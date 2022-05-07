const webp = require('webp-converter');

exports.webp2jpg = function (src, dest) {
  return webp.dwebp(src, dest, '-o');
};
