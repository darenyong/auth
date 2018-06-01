const express = require('express');
const router = express.Router();
// const request = require('superagent');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const audience='https://darenyong.com/jenkins';
const scope='read:jenkins';
const response_type='code';
const client_id=fs.readFileSync(path.join(__dirname, '..', '..', 'client_id'), 'utf-8');
const redirect_uri='https://darenyong.com/auth/callback';
const state='goofy';

const authUrl = 'https://darenyong.auth0.com/authorize?'
  + querystring.stringify({audience, scope, response_type, client_id, redirect_uri, state});

router.get('/callback', function (req, res, next) {
  res.json({msg: 'auth callback'});
});


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
    // if (uri === '/jenkins' && cookie !== 'myJwt') {
    if (uri === '/jenkins') {
      // const goto = `${proto}://${host}${uri}`;
      const goto = authUrl;

      console.log('redirect to', goto);

      // const domain = 'darenyong.com';
      // const secure = false;
      // const maxAge = 60000;
      // const httpOnly = false;
      // res.cookie('daren-auth-token', 'myJwt', { secure, maxAge, httpOnly });
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
