const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Filter = require('../models/Filter');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Filter
      .insert(req.body, req.user.userId)
      .then(filter => res.redirect('/filters'))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Filter
      .getFiltersByUserId(req.params.id, req.user.userId)
      .then(filter => res.send(filter))
      .catch(next);
  })
  
  .delete('/:id', ensureAuth, (req, res, next) => {
    Filter
      .remove(req.params.id, req.user.userId)
      .then(filter => res.send(filter))
      .catch(next);
  });
