const jwt = require('jsonwebtoken');
const HTTPCodes = require('http-status-codes');
const config = require('../config');

/**
 * [Generate jwt token]
 * @param  {String} _id [user id]
 * @return {Promise} [promise that represents the jwt token]
 */
const generateToken = (email, role) => {
  return new Promise((resolve, reject) => {
    const payload = { email, role };
    const data = { expiresIn: config.jwtDuration };
    jwt.sign(payload, config.jwtSecret, data, (error, token) => {
      if(error){
        const err = new Error('Fails in token creation');
        err.statusCode = HTTPCodes.INTERNAL_SERVER_ERROR;
        return reject(err);
      }
      return resolve(token);
    });
  });
};

/**
 * [Verify if the token is valid]
 * @param  {String} token [auth token]
 * @return {Promise} [promise that represents the decoded token (aka. is valid)]
 */
const verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (error, decoded) => {
      if(error){
        const err = new Error('Fails in token authentication');
        err.statusCode = HTTPCodes.UNAUTHORIZED;
        return reject(err);
      }
      return resolve(decoded);
    })
  });
};

module.exports = {
  generateToken,
  verifyToken
};
