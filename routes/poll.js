const express = require('express');
const router = express.Router();

const Poll = require('../models/poll');

router.get('/poll/:url(*)', (req, res) => {
  const url = req.params.url;
  Poll.findOne({_id: url}, (err, poll) => {
    // if (err) res.send(err);
    if (poll) {
      if (req.user) {
        if (poll.owner === req.user.username) {
          res.render('poll', {poll: poll, owner: true});
        }
        else {
          res.render('poll', {poll: poll, owner: false});
        }
      }
      else {
        res.render('poll', {poll: poll, owner: false});
      }
    }
    else {
      req.flash('error_msg', 'That poll ID is not valid');
      res.redirect('/');
    }
  });
});

router.post('/poll', ensureAuthenticated, (req, res) => {
  const question = req.body.question;
  const answers = [];
  const owner = req.user.username;

  for (let answer in req.body) {
    if (req.body[answer] != '') {
      answers.push(req.body[answer]);
    }
  }

  // Validate only question and first 2 answers
  req.checkBody('question', 'Question is required').notEmpty();
  req.checkBody('answer', 'At least 2 answers are required').notEmpty();
  req.checkBody('answer2', 'At least 2 answers are required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.render('index', { errors: errors });
  }
  else {
    // Remove first element from array as that's the question
    answers.shift();

    const newPoll = new Poll({
      question: question,
      answers: answers,
      owner: owner
    });

    Poll.createPoll(newPoll, (err) => {
      if (err) throw err;

      req.flash('success_msg', 'New poll successfully created');
      res.redirect('/');
    });
  }
});

// To ensure people don't just change the login form action to /poll
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
