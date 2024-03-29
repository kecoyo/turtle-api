const path = require('path');
const jwt = require('koa-jwt');
const cors = require('@koa/cors');

const isDev = think.env === 'development';

module.exports = [
  {
    handle: cors,
    options: {},
  },
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev,
    },
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/,
    },
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev,
    },
  },
  {
    handle: jwt,
    options: {
      secret: think.config('jwt').secret,
      getToken: (ctx, opts) => ctx.header.authorization,
      passthrough: true,
      debug: isDev,
    },
  },
  {
    handle: 'payload',
    options: {
      keepExtensions: true,
      limit: '5mb',
    },
  },
  {
    handle: 'router',
    options: {},
  },
  'logic',
  'controller',
];
