const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');

// Get Index page
router.post('/vote', (req, res) => {
  const id = req.body.id;
  const name = req.user ? req.user.username : null;
  const ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;

  // const choice = req.body[0];
  const choice = req.body[Object.keys(req.body)[0]];

  // If the length is 1 then that means they didn't select an answer
  if (Object.keys(req.body).length == 1) {
    req.flash('error_msg', 'You didn\'t select an option');
    res.redirect('/');
  } else {
    // Use a username if logged in otherwise use an ip to prevent voting twice on the same poll
    const username = name !== null ? name : ip;

    /*
      Really needs to be cleaned up
      First find the id of the answer (I'm sure there's an easier way)
      Then apply that id to the update call
      In the update call. We first pass the Poll ID and then the answer ID which was found in changeID
      Then use The increment function (built-in) to increment votes by one
      We access votes by using $ and dot notation for the below model setup

      answers: [{
        answer: String,
        votes: Number
      }]
    */

    Poll.find({ _id: id }, (err, poll) => {
      if (err) res.send(err);

      for (var i in poll[0].answers) {
        if (choice === poll[0].answers[i].answer) {
          const changeID = poll[0].answers[i]._id;

          Poll.update({ _id: id, 'answers._id': changeID },
            {'$inc': {'answers.$.votes': 1 }}, (err, logInc) => {
              if (err) throw err;
            }
          );

          // Push the username or IP address to prevent voting more than once
          Poll.update({ _id: id, 'answers._id': changeID },
            {'$push': {'answers.$.voted': username }}, (err, logPush) => {
              if (err) throw err;
            }
          );
          res.redirect('/');
        }
      }
    });
  }
});

module.exports = router;
