const router = require('express').Router();
const HTTPCodes = require('http-status-codes');

router.get('/', (req, res) => {
  res.status(HTTPCodes.OK).send({ ok: 'success' });
});

module.exports = router;
