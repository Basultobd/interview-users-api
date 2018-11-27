const router = require('express').Router();

// Check service status
const health = require('./health');

// Import all resources acces routes
const user = require('./user');

// localhost:port/api/{version}/health
router.use('/health', health);

// localhost:port/api/{version}/users
router.use('/users', user);

module.exports = router;
