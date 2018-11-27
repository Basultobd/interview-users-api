const bcrypt = require('bcryptjs');
const HTTPCodes = require('http-status-codes');
const config = require('../config');

const salt = 10;

/**
 * [Apply hash to password]
 * @param  {String} password [user passwrod]
 * @return {String} [promise that represents the password encrpyted]
 */
const hash = password => {
  return bcrypt.hash(password, salt)
  .catch(error => {
    const err = new Error('Failed in encrpyt password');
    err.statusCode = HTTPCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  });
};

/**
 * [Compare password and hashed password]
 * @param  {String} password [passwrod rto verify]
 * @param  {String} hash [password hashed]
 * @return {Promise} [promise that represents tha state of comparation]
 */
const compare = (password, hash) => {
  return bcrypt.compare(password, hash)
  .catch(error => {
    const err = new Error('Fails in password verification');
    err.statusCode = HTTPCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  });
};

module.exports = {
  hash,
  compare
};
