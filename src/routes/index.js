const express = require('express');
const router = express.Router();

// home page
router.get('/', function (req, res, next) {
  const { headers } = req;
  log.info('GET auth', headers);
  const proto = req.get('x-forwarded-proto');
  const host = req.get('x-forwarded-host');
  const uri = req.get('x-forwarded-uri');

  // const proto = 'http';
  // const host = 'localhost:8080';
  // const uri = '/';

  console.log('cookies', req.cookies);
  const cookie = req.cookies['daren-auth-token'];
  console.log('daren-auth-token', cookie);

  try {
    if (uri === '/' && cookie !== 'myJwt') {
      const goto = `${proto}://${host}${uri}`;
      console.log('redirect to', goto);

      const domain = 'darenyong.com';
      const secure = false;
      const maxAge = 60000;
      const httpOnly = false;
      res.cookie('daren-auth-token', 'myJwt', { secure, maxAge, httpOnly });
      res.redirect(goto);
      return;
    }
  } catch (err) {
    console.log('error ***', err);
  }

  console.log('respond with auth hello');
  res.json({ title: 'auth hello', uri, cookie });
});

module.exports = router;
