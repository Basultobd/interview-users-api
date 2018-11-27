const HTTPCodes = require('http-status-codes');
const tokenizer = require('../services/token');
const encryption = require('../services/encryption');

/**
 * [Authenticate if the user token is valid]
 * @param {Object}   req  [request object]
 * @param {Object}   res  [response object]
 * @param {Function} next [function to go to next middleware function]
 */
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token){
    const err = new Error('No token provided');
    err.statusCode = HTTPCodes.UNAUTHORIZED;
    next(err);
  } else {
    tokenizer.verifyToken(token)
    .then(decoded => {
      res.locals.tokenDecoded = decoded;
      next();
    })
    .catch(err => {
      next(err);
    })
  }
};

/**
 * [Verify the role type]
 * @param {Object}   req  [request object]
 * @param {Object}   res  [response object]
 * @param {Function} next [function to go to next middleware function]
 */
const isAdmin = (req, res, next) => {
  const { role } = res.locals.tokenDecoded;
  if(role === 'admin'){
    next();
  } else {
    const err = new Error('Unauthorized for this operation');
    err.statusCode = HTTPCodes.UNAUTHORIZED;
    next(err);
  }
};

module.exports = {
  authenticate,
  isAdmin
};
