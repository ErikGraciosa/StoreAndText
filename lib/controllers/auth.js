const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const UserService = require('../services/UserService');

const attachCookie = (res, user) => {
  if(process.env.DOMAIN === undefined){
    res.cookie('session', UserService.authToken(user), {
      httpOnly: true,
      maxAge: 86400000,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  } else {
    res.cookie('session', UserService.authToken(user), {
      httpOnly: true,
      maxAge: 86400000,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.DOMAIN
    });
  }
};

module.exports = Router()
  .post('/signup', (req, res, next) => {
    UserService
      .create(req.body)
      .then(user => {
        attachCookie(res, user);
        res.redirect('/filters');
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    UserService
      .authorize(req.body)
      .then(user => {
        attachCookie(res, user);
        res.redirect('/filters');
      })
      .catch(next);
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  });
