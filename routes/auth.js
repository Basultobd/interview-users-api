const router = require('express').Router();
const controller = require('../controllers/auth');

/**
* @api POST /api/users/signup Create a new user
* @apiName Create a the first user
*
* @apiSuccess (201) OK {Object} jwt info
*/
router.post('/signup', controller.signUp);

/**
* @api POST /api/users/login
* @apiName DO the login process for user
*
* @apiSuccess (201) OK {Object} jwt info
*/
router.post('/login', controller.logIn);

module.exports = router;
