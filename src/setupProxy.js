const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(createProxyMiddleware(
    '/service', {
    target: 'http://zzh.vaiwan.com',
    changeOrigin: true
  }));

  app.use(createProxyMiddleware(
    '/nccloud', {
    target: 'http://zzh.vaiwan.com',
    changeOrigin: true,
  }));

  app.use(createProxyMiddleware(
    '/cgi-bin', {
    target: 'https://qyapi.weixin.qq.com',
    changeOrigin: true
  }));
};

