const express = require('express');
const router = express.Router();

// home page
router.get('/', function (req, res, next) {
  const { headers } = req;
  log.info(`GET auth r: ${JSON.stringify(req)}`, headers);
  res.json({title: 'auth hello'});
});

module.exports = router;
