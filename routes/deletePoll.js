const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');

// Get Index page
router.post('/deletePoll', ensureAuthenticated, (req, res) => {
  const id = req.body.id;

  Poll.findOne({_id: id}, (err, poll) => {
    if (err) throw err;
    if (poll.owner === req.user.username) {
      poll.remove();
    }
    res.redirect('/dashboard');
    /*Poll.find({owner: req.user.username}, (err, polls) => {
      if (err) res.send(err);
      res.render('dashboard', {polls: polls.reverse()});
    });*/
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
