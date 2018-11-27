const HTTPCodes = require('http-status-codes');
const model = require('../models/user');

/**
 * [Use the model for fetch an user and send the response]
 * @param {Object}   req  [request object]
 * @param {Object}   res  [response object]
 * @param {Function} next [function to go to next middleware function]
 */
const fetchUser = (req, res, next) => {
  const { _id } =  req.params;
  return model.fetch(_id.toString())
  .then(userInfo => {
    console.log('Fetch op: ', userInfo);
    res.status(HTTPCodes.OK).send({
      _id: userInfo._id,
      role: userInfo.role,
      email: userInfo.email
    });
  })
  .catch(next);
};

/**
 * [Use the model for add new user and send the response]
 * @param {Object}   req  [request object]
 * @param {Object}   res  [response object]
 * @param {Function} next [function to go to next middleware function]
 */
const addUser = (req, res, next) => {
  const { role, email, password } = req.body;
  return model.add(role, email, password)
  .then(userInfo => {
    console.log('Add op: ', userInfo);
    res.status(HTTPCodes.CREATED).send(userInfo);
  })
  .catch(next);
};

/**
 * [Use the model for add many users in one call and send the response]
 * @param {Object}   req  [request object]
 * @param {Object}   res  [response object]
 * @param {Function} next [function to go to next middleware function]
 */
const addManyUsers = (req, res, next) => {
  const list = req.body;
  model.addMany(list)
  .then(usersInfo => {
    console.log('Add many op:' , usersInfo);
    res.status(HTTPCodes.OK).send(usersInfo)
  })
  .catch(next);
};
/**
 * [Use the model for update an user and send the response]
 * @param {Object}   req  [request object]
 * @param {Object}   res  [response object]
 * @param {Function} next [function to go to next middleware function]
 */
const updateUser = (req, res, next) => {
  const { _id } =  req.params;
  model.update(_id, req.body)
  .then(userInfo => {
    console.log('Update op: ', userInfo);
    res.status(HTTPCodes.OK).send(userInfo);
  })
  .catch(next);
};

/**
 * [Use the model for delete an user and send the response]
 * @param {Object}   req  [request object]
 * @param {Object}   res  [response object]
 * @param {Function} next [function to go to next middleware function]
 */
 const deleteUser = (req, res, next) => {
  const { _id } = req.params;
  model.remove(_id)
  .then(userInfo => {
    console.log('Delete op: ', userInfo);
    res.status(HTTPCodes.NO_CONTENT).send(userInfo);
  })
  .catch(next);
 };

/**
 * [Use the model for get all users and send the response]
 * @param {Object}   req  [request object]
 * @param {Object}   res  [response object]
 * @param {Function} next [function to go to next middleware function]
 */
const listUsers = (req, res, next) => {
  return model.list()
  .then(users => {
    const usersList = users.rows.map(user => {
      const { doc } = user;
      return {
        _id: doc._id,
        role: doc.role,
        email: doc.email,
        password: doc.password
      };
    });
    res.status(HTTPCodes.OK).send(usersList);
  })
  .catch(next);
};

module.exports = {
  fetchUser,
  addUser,
  addManyUsers,
  updateUser,
  deleteUser,
  listUsers
};
