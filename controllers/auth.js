const tokenizer = require('../services/token');
const encryption = require('../services/encryption');
const HTTPCodes = require('http-status-codes');
const model = require('../models/user');

// Only use for the first admin
/**
 * [Sign up a new user and send token as a response]
 * @param {Object}   req  [request object]
 * @param {Object}   res  [response object]
 * @param {Function} next [function to go to next middleware function]
 */
const signUp = (req, res, next) => {
  const { role, email, password } = req.body;
  return model.add(role, email, password)
  .then(userInfo => {
    console.log('Add op: ', userInfo);
    const { id } = userInfo;
    return model.fetch(id);
  })
  .then(userInfo => {
    // payload
    console.log('Fetch op: ', userInfo);
    const { email, role } = userInfo;
    return tokenizer.generateToken(email, role);
  })
  .then(token => res.status(HTTPCodes.CREATED).send({ token, auth: true }))
  .catch(next);
};

/**
 * [Log in for existing user and send token as a response]
 * @param {Object}   req  [request object]
 * @param {Object}   res  [response object]
 * @param {Function} next [function to go to next middleware function]
 */
const logIn = (req, res, next) => {
  const { email, role, password } = req.body;
  return model.find(email)
  .then(usersInfo => {
    const { docs } = usersInfo;
    if(!docs.length) {
      return Promise.reject(customError('User not founded', HTTPCodes.NOT_FOUND));
    } else {
      const user = docs[0];
      const hash = user.password;
      return encryption.compare(password, hash);
    }
  })
  .then(areEqual => {
    if(areEqual){
      return tokenizer.generateToken(email, role);
    } else {
      return Promise.reject(customError('Passwords are not equal', HTTPCodes.UNAUTHORIZED));
    }
  })
  .then(token => res.status(HTTPCodes.OK).send({ token, auth: true }))
  .catch(next);
};

/**
 * [Return a custom error]
 * @param  {String} message    [error message]
 * @param  {Number} statusCode [error code]
 * @return {Object} [Object that represents the error]
 */
const customError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = {
  signUp,
  logIn
}
