const express = require('express');
const router = express.Router();

// home page
router.get('/', function (req, res, next) {
  const { headers } = req;
  log.info('GET auth', headers);
  const proto = req.get('x-forwarded-proto');
  const host = req.get('x-forwarded-host');
  const uri = req.get('x-forwarded-uri');
  console.log('cookies', req.cookies);
  const cookie = req.cookies['daren-auth-token'];
  console.log('daren-auth-token', cookie);

  if (uri === '/jenkins' && cookie !== 'myJwt') {
    const domain = 'darenyong.com';
    const secure = true;
    const maxAge = 60;
    res.cookie('daren-auth-token', 'myJwt', { domain, secure, maxAge });
    const goto = `${proto}:\\${host}${uri}`;
    console.log('redirect to', goto);
    res.redirect(goto);
    return;
  }
  res.json({ title: 'auth hello', uri });
});

module.exports = router;
