let config = {
  api: {
    protocol: 'http',
    host: 'taru.iam.upr.si',
    port: 7082,
    prefix: 'api'
  },
};

config.endpoint = config.api.protocol + '://' +
  config.api.host + ':' +
  config.api.port + '/' +
  config.api.prefix + '/';

module.exports = config;