var sdkVersion = require('../package').version;
var Promise = require('bluebird');
var clientId;
var clientSecret;
var accessToken;
var refreshToken;
var schema = 'https';
var host = 'api.mercadopago.com';
var userAgent = 'MercadoPago Node.js SDK v' + sdkVersion + ' (node ' + process.version + '-' + process.arch +
  '-' + process.platform + ')';

var configurationsModule = module.exports = {
  sandbox: false,
  show_promise_error: true,
  cache_max_size: 100 * (1024 * 1024) // 100 Megabytes
};

/**
 * Set up configurations globally.
 * Do not allow override the client_id and the client_secret
 * @param {object} configurations
 */
configurationsModule.configure = function (configurations) {
  if (configurations === undefined || typeof configurations !== 'object') {
    throw new Error('You must provide an Object with the configurations');
  }

  if (configurations.client_id === undefined && configurations.client_secret === undefined &&
    configurations.access_token === undefined) {
    throw new Error('You must provide a method of authentication (client_id & client_secret or access_token)');
  }

  if ((configurations.client_id !== undefined && configurations.client_secret === undefined)
    || (configurations.client_id === undefined && configurations.client_secret !== undefined)) {
    throw new Error('You must provide client_id and client_secret');
  }

  if (configurations.client_id !== undefined && configurations.client_secret !== undefined
    && (clientId !== undefined || clientSecret !== undefined)) {
    throw new Error('Cant change client_id or client_secret because is already set');
  }

  clientId = clientId || configurations.client_id;
  clientSecret = clientSecret || configurations.client_secret;

  // Set accessToken
  accessToken = configurations.access_token || accessToken;
  // Use if to prevent false value
  this.sandbox = (configurations.sandbox !== undefined) ? configurations.sandbox : this.sandbox;
  this.show_promise_error = (configurations.show_promise_error !== undefined) ?
    configurations.show_promise_error : this.show_promise_error;

  if (!this.show_promise_error) {
    Promise.onPossiblyUnhandledRejection(function (/* error, promise */) { /* Do Nothing */ });
  }
};

/**
 * Get clientId
 * @returns {string}
 */
configurationsModule.getClientId = function () {
  return clientId;
};

/**
 * Get clientSecret
 * @returns {string}
 */
configurationsModule.getClientSecret = function () {
  return clientSecret;
};

/**
 * Set clientId
 * @param {string} id
 */
configurationsModule.setClientId = function (id) {
  clientId = id;
};

/**
 * Set clientSecret
 * @param {string} secret
 */
configurationsModule.setClientSecret = function (secret) {
  clientSecret = secret;
};


/**
 * Set accessToken
 * @param {string} token
 */
configurationsModule.setAccessToken = function (token) {
  accessToken = token;
  return this;
};

/**
 * Get accessToken
 * @returns {string}
 */
configurationsModule.getAccessToken = function () {
  return accessToken;
};

/**
 * Set refreshToken
 * @param token
 */
configurationsModule.setRefreshToken = function (token) {
  refreshToken = token;
  return this;
};

/**
 * Get refreshToken
 * @returns {*}
 */
configurationsModule.getRefreshToken = function () {
  return refreshToken;
};

/**
 * Get base URL to execute rest operations
 * @returns {string}
 */
configurationsModule.getBaseUrl = function () {
  return schema + '://' + host;
};

/**
 * Get userAgent
 * @returns {string}
 */
configurationsModule.getUserAgent = function () {
  return userAgent;
};

/**
 * Check NODE_ENV variable
 * @returns {boolean}
 */
configurationsModule.areTestsRunnning = function () {
  return process.env.NODE_ENV === 'test';
};
