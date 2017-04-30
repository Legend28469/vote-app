const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');

// Get Index page
router.post('/vote', (req, res) => {
  const id = req.body.id
  const name = req.user ? req.user.username : null;
  const ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;

  // const choice = req.body[0];
  const choice = req.body[Object.keys(req.body)[0]];

  // Use a username if logged in otherwise use an ip to prevent voting twice on the same poll
  const username = name !== null ? name : ip;

  Poll.find({ _id: id }, (err, poll) => {
    if (err) res.send(err);
    for (var i = 0; i < poll[0].answers.length; i++) {
      if (choice === poll[0].answers[i].answer) {
        console.log('Match');
      }
    }
    res.redirect('/');
  });
});

module.exports = router;
