const express = require('express');
const router = express.Router();

const Poll = require('../models/poll');

router.get('/poll/:url(*)', (req, res) => {
  const url = req.params.url;
  Poll.findOne({_id: url}, (err, poll) => {
    // if (err) res.send(err);
    if (poll) {
      const votes = [];
      for (var i in poll.answers) {
        // For some reason phantom undefineds were being added to the array
        if (poll.answers[i].votes !== undefined) {
          votes.push(poll.answers[i].votes);
        }
      }
      //console.log(votes);

      if (req.user) {
        if (poll.owner === req.user.username) {
          res.render('poll', { poll: poll, owner: true, votes: votes, url: `${req.protocol}://${req.get('host')}/poll/` });
        }
        else {
          res.render('poll', { poll: poll, owner: false, votes: votes, url: `${req.protocol}://${req.get('host')}/poll/` });
        }
      }
      else {
        res.render('poll', { poll: poll, owner: false, votes: votes, url: `${req.protocol}://${req.get('host')}/poll/` });
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
      answers.push({answer: req.body[answer], votes: 0});
    }
  }

  // Validate only question and first 2 answers
  req.checkBody('question', 'Question is required').notEmpty();
  req.checkBody('answer', 'At least 2 answers are required').notEmpty();
  req.checkBody('answer2', 'At least 2 answers are required').notEmpty();

  const errors = req.validationErrors();
  const formatted = [ ...new Set(answers) ];

  if (errors) {
    res.render('index', { errors: errors });
  }
  else if (formatted.length < 3) {
    req.flash('error_msg', 'Can\'t have two of the same answers');
    res.redirect('/');
  }
  else {
    // Remove first element from array as that's the question
    console.log(formatted[0].answer);
    formatted.shift();

    const newPoll = new Poll({
      question: question,
      answers: formatted,
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
