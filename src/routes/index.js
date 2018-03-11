const express = require('express');
const router = express.Router();

// home page
router.get('/', function (req, res, next) {
  const { headers, originalUrl, url } = req;
  log.info(`GET auth ${originalUrl} ${url}`, headers);
  res.json({title: 'auth hello'});
});

module.exports = router;
