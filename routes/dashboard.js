const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');

// Get Index page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Poll.find({owner: req.user.username}, (err, polls) => {
    if (err) res.send(err);
    res.render('dashboard', {polls: polls.reverse(), url: `${req.protocol}://${req.get('host')}/poll/`});
  });
});

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

module.exports = router;
