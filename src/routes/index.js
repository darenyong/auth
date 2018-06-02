const express = require('express');
const router = express.Router();
const request = require('superagent');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const cookieName = 'daren-auth-token';

// needed to request code
const audience = 'https://darenyong.com/jenkins';
const scope = 'read:jenkins';
const response_type = 'code';
const client_id = fs.readFileSync(path.join(__dirname, '..', '..', 'client_id'), 'utf-8');
const redirect_uri = 'https://darenyong.com/auth/callback';
const state = 'goofy';

// needed to request token
const client_secret = fs.readFileSync(path.join(__dirname, '..', '..', 'client_secret'), 'utf-8');

const authUrl = 'https://darenyong.auth0.com/authorize?'
  + querystring.stringify({ audience, scope, response_type, client_id, redirect_uri, state });

const setCookie = (res, token) => {
  console.log('setting new cookie');
  const secure = false;
  const maxAge = 60000;
  const httpOnly = false;
  res.cookie(cookieName, token, { secure, maxAge, httpOnly });
};

router.get('/callback', function (req, res, next) {
  try {
    log.info('got auth code, exchange for token');

    const queryPart = req.originalUrl.substring(req.originalUrl.indexOf('?') + 1);
    const parsed = querystring.parse(queryPart);
    console.log('callback query parsed', parsed);

    // TODO: check parsed.state as nounce to avoid replay attack

    const body = {
      grant_type: 'authorization_code',
      client_id,
      client_secret,
      code: parsed.code,
      redirect_uri
    };

    request
      .post('https://darenyong.auth0.com/oauth/token')
      .set('content-type', 'application/json')
      .send(body)
      .then(oauth => {
        setCookie(res, oauth.body.access_token);
        console.log('redirecting back to original requested url');
        res.redirect('https://darenyong.com')
      })
      .catch(err => {
        log.error('error in /oath/token request', err);
        res.status(500);
        res.send('error in /oath/token request');
      });
  } catch (err) {
    log.error('error exchanging code for token', err);
    res.status(500);
    res.send('error exchanging code for token');
  }
});

// home page - all auth requests land here
router.get('/', function (req, res, next) {
  try {
    // const { headers } = req;
    // log.info('GET auth', headers);
    const proto = req.get('x-forwarded-proto');
    const host = req.get('x-forwarded-host');
    const uri = req.get('x-forwarded-uri');

    // example:
    // const proto = 'http';
    // const host = 'localhost:8080';
    // const uri = '/';

    if (uri.startsWith('/auth')) {
      console.log('request for', uri, 'bypass security');
      res.send('ok');
      return;
    }

    const cookie = req.cookies[cookieName];
    console.log('cookie', cookie);
    if (cookie) { // validate the cookie
      const expired = false;
      if (expired) {
        // TODO: renew
      }
      const validCookie = true;
      if (validCookie) {
        // cookie ok, not expired, then successful auth
        res.send('cookie ok, auth success');
        return;
      }
    }
    log.info('no cookie or invalid cookie, force login');
    res.redirect(authUrl);
  } catch (err) {
    log.error('error checking for cookie', err);
    res.status(500);
    res.send('error checking for cookie');
  }
});

module.exports = router;
