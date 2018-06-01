const express = require('express');
const router = express.Router();
const request = require('superagent');
const querystring = require('querystring');
const url = require('url');
const fs = require('fs');
const path = require('path');

const audience='https://darenyong.com/jenkins';
const scope='read:jenkins';
const response_type='code';
const client_id=fs.readFileSync(path.join(__dirname, '..', '..', 'client_id'), 'utf-8');
const client_secret=fs.readFileSync(path.join(__dirname, '..', '..', 'client_secret'), 'utf-8');
const redirect_uri='https://darenyong.com/auth/callback';
const state='goofy';

const authUrl = 'https://darenyong.auth0.com/authorize?'
  + querystring.stringify({audience, scope, response_type, client_id, redirect_uri, state});

router.get('/callback', function (req, res, next) {
  console.log('/callback req.url', req.originalUrl);

  const queryPart = req.originalUrl.substring( req.originalUrl.indexOf('?') + 1 );
  const parsed = querystring.parse(queryPart);
  console.log('query parsed', parsed);

  // TODO: check parsed.state as nounce to avoid replay attack

  const body = {
    grant_type: 'authorization_code',
    client_id,
    client_secret,
    code: parsed.code,
    redirect_uri
  };

  console.log('requesting token');
  request
    .post('https://darenyong.auth0.com/oauth/token')
    .set('content-type', 'application/json')
    .send(body)
    .then(oauth => {
      console.log('got token success', oauth.body);
      res.json({msg: 'auth callback success got token'});
    })
    .catch(err => {
      console.log('error getting token', err);
      res.status(400);
      res.send('error getting token');
    });
});


// home page
router.get('/', function (req, res, next) {
  const { headers } = req;
  // log.info('GET auth', headers);
  const proto = req.get('x-forwarded-proto');
  const host = req.get('x-forwarded-host');
  const uri = req.get('x-forwarded-uri');

  // const proto = 'http';
  // const host = 'localhost:8080';
  // const uri = '/';

  // console.log('cookies', req.cookies);
  // const cookie = req.cookies['daren-auth-token'];
  // console.log('daren-auth-token', cookie);
  if (uri.startsWith('/auth')) {
    console.log('detected uri startsWith /auth, bypass security');
    res.send('ok');
    return;
  }

  try {
    // if (uri === '/jenkins' && cookie !== 'myJwt') {
    if (uri === '/jenkins') {
      // const goto = `${proto}://${host}${uri}`;
      const goto = authUrl;
      console.log('redirect to auth', goto);

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
  res.json({ title: 'auth hello' });
});

module.exports = router;
