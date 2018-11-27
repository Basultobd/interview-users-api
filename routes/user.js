const router = require('express').Router();
const HTTPCodes = require('http-status-codes');
const controller = require('../controllers/users');
const { authenticate, isAdmin } = require('../middleware/auth');

// Use auth API
const auth = require('./auth');
router.use('/', auth);

/**
* @api GET users/:id
* @apiName Fetch a user
* @apiPermission admin - user
*
* @apiSuccess (200) OK {Object} mixed user info
*/
router.get('/:_id', authenticate, controller.fetchUser);

/**
* @api GET users/
* @apiName  Get the list of users
* @apiPermission admin - user
*
* @apiSuccess (200) OK {Object} users list
*/
router.get('/', authenticate, controller.listUsers);

/**
* @api POST users/
* @apiName Create a user
* @apiPermission admin
*
* @apiSuccess (201) OK {Object} mixed user info
*/
router.post('/', authenticate, isAdmin, controller.addUser);

/**
* @api POST users/_bulk
* @apiName Create multiple users
* @apiPermission admin
*
* @apiSuccess (201) OK {Object} mixed user info
*/
router.post('/_bulk', authenticate, isAdmin, controller.addManyUsers);

/**
* @api PUT /api/users/:id
* @apiName Update a user
* @apiPermission admin
*
* @apiSuccess (200) OK {Object} mixed user info
*/
router.put('/:_id', authenticate, isAdmin, controller.updateUser);

/**
* @api DELETE /api/users/:id
* @apiName Delete a user
* @apiPermission admin
*
* @apiSuccess (204) NO_CONTENT
*/
router.delete('/:_id', authenticate, isAdmin, controller.deleteUser);

// Error handler - The destination of next() functions
router.use((err, req, res, next) => {
  if(!err.statusCode) err.statusCode = HTTPCodes.INTERNAL_SERVER_ERROR;
  const customError = {
    message: err.message,
    statusCode: err.statusCode,
  };
  if(err.errors) customError.errors = err.errors;
  console.log(`Status code: ${err.statusCode} - Message: ${err.message}`);
  res.status(err.statusCode).send(customError);
})

module.exports = router;
