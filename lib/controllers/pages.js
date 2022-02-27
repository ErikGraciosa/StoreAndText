const { Router } = require('express');
const Filter = require('../models/Filter');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .get('/', (req, res) => {
    res.render('home');
  })

  .get('/filters', ensureAuth, async(req, res) => {
    const filters = await Filter.getFiltersByUserId(req.user.userId);
    res.render('filters', { filters });
  })

  .get('/about-us', (req, res) => {
    res.render('about-us');
  })
  
  .get('/signup', (req, res) => {
    const carriers = [
      'att',
      'boost',
      'cricket',
      'google',
      'tmobile',
      'uscellular',
      'verizon'
    ];
    res.render('signup', { carriers });
  })

  .get('/logout', async(req, res, next) => {
    try {
      res.clearCookie('session', { 
        httpOnly: true,
        path:'/',
        domain: process.env.REALO_DOMAIN
      });
      res.redirect('/');
    } catch(error){
      next(error);
    }
  })

  .get('/login', (req, res) => {
    res.render('login');
  });
