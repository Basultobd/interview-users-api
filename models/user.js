const db = require('../db/connection');
const encryptor = require('../services/encryption');
const idGenerator = require('../services/idGenerator');

/**
 * [Generic function for build a user schema]
 * @param  {String} email  [user email]
 * @param  {String} role [user role]
 * @param  {String} password [user Password]
 * @return {Promise} [promise that represents object the user object]
 */
const userSchema = (_id, role, email, _password) => {
  return encryptor.hash(_password)
  .then(passwordEncrypted => (
    {
      _id,
      role,
      email,
      password: passwordEncrypted
    }
  ))
  .catch(error => Promise.reject(error));
};

/**
 * [fetch a user by id in db]
 * @param  {String} _id  [user id]
 * @return {Promise}  [promise that represents the result of fetch operation]
 */
const fetch = _id => {
  return db.get(_id)
  .catch(error => Promise.reject(customError(error.message, error.status)));
};

/**
 * [find a user using email]
 * In next implementations is recomended to
 * have a query building module and pass it
 * as param to this function
 * @param  {String} _email [user email]
 * @return {Promise} [promise that represents teh result of find operation]
 */
const find = _email => {
  return db.find({
    selector: { email: { $eq: _email }  }
  })
  .catch(error => Promise.reject(customError(error.message, error.status)));
}

/**
 * [add a user to db]
 * @param {String} role [user role]
 * @param {String} email [user email]
 * @param {String} password [user password]
 * @return {Promise} [promise that represents the result of add operation]
 */
const add = (role, email, password) => {
  return idGenerator.generateOne()
  .then(_id => userSchema(_id, role, email, password))
  .then(db.put)
  .catch(error => Promise.reject(customError(error.message, error.status)));
};

/**
 * [Add many users to db]
 * @param {Array} usersList [users list to insert]
 */
const addMany = usersList => {
  return idGenerator.generateMany(usersList.length)
  .then(idsList => Promise.all(
      usersList.map((user, index) => {
        const { role, email, password } = user;
        return userSchema(idsList[index], role, email, password);
      })
    )
  )
  .then(db.bulkDocs)
  .catch(error => Promise.reject(customError(error.message, error.status)));
}

/**
 * [Update a existing user]
 * @param {String} _id [user id]
 * @param {String} role [user role]
 * @param {String} email [user email]
 * @param {String} password [user password]
 * @return {Promise} [promise that represents the result of update operation]
 */
const update = (_id, { role, email, password }) => {
  return Promise.all([db.get(_id), userSchema(_id, role, email, password)])
  .then(results => {
    const [userInDB, userWithNewInfo] = results;
    // Merging elements with same properties
    const userUpdated = { ...userInDB, ...userWithNewInfo };
    return db.put(userUpdated);
  })
  .catch(error => Promise.reject(customError(error.message, error.status)));
};

/**
 * [Delete an existing user]
 * @param  {String} _id [user id]
 * @return {Promise} [promise that represents the result of delete operation]
 */
const remove = _id => {
  return db.get(_id)
  .then(db.remove)
  .catch(error => Promise.reject(customError(error.message, error.status)));
};

/**
 * [Return a list of all users]
 * @return {Promise} [promise that represents the result of get all operation]
 */
const list = () => {
  return db.allDocs({ include_docs: true })
  .catch(error => Promise.reject(customError(error.message, error.status)));
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
  fetch,
  find,
  add,
  addMany,
  update,
  remove,
  list
};
