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

  const newAnswer = req.body.newAnswer !== undefined ? { answer: req.body.newAnswer, votes: 1 } : null;
  const choice = req.body[Object.keys(req.body)[0]];

  // If the length is 1 then that means they didn't select an answer
  if (Object.keys(req.body).length == 1) {
    req.flash('error_msg', 'You didn\'t select an option');
    res.redirect(`/poll/${id}`);
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

      if (poll[0].voted.includes(username)) {
        req.flash('error_msg', 'You have already voted on this');
        res.redirect(`/poll/${id}`);
        return;
      }

      // If a user is adding a new answer
      if (!poll[0].voted.includes(username)) {
        if (name !== null && newAnswer.answer.length > 0) {
          console.log("Here we are");
          for (var i in poll[0].answers) {
            if (newAnswer.answer === poll[0].answers[i].answer) {
              console.log("Found a dupe");
              req.flash('error_msg', 'This answer already exists');
              res.redirect(`/poll/${id}`);
              return;
            }
          }

          req.flash('success_msg', 'You have successfully voted');
          Poll.update({ _id: id},
            {'$push': {'answers': newAnswer }}, (err, logPush) => {
              if (err) throw err;
              console.log("VOTING ONCE!!")
            }
          );

          Poll.update({ _id: id},
            {'$push': {'voted': username }}, (err, logPush) => {
              if (err) throw err;
              console.log("WHAT THE PROBLEM IS!!")
            }
          );
        }
      }

      // If a user is just voting using existing answers
      if (newAnswer.answer.length < 1) {
        console.log(newAnswer);
        for (var i = 0; i < poll[0].answers.length; i++) {
          if (choice === poll[0].answers[i].answer) {
            const changeID = poll[0].answers[i]._id;
            if (poll[0].voted.includes(username)) {
              req.flash('error_msg', 'You have already voted on this');
            } else {

              // Poll ID -> Answer ID -> Use dot notation to access votes
              Poll.update({ _id: id, 'answers._id': changeID },
                {'$inc': {'answers.$.votes': 1 }}, (err, logInc) => {
                  if (err) throw err;
                  console.log("VOTING AGAIN")
                }
              );

              // Push the username or IP address to prevent voting more than once
              Poll.update({ _id: id},
                {'$push': {'voted': username }}, (err, logPush) => {
                  if (err) throw err;
                  console.log("HOT DAMN");
                }
              );
              req.flash('success_msg', 'You have successfully voted');
            }
          }
        }
      }
      res.redirect(`/poll/${id}`);
    });
  }
});

module.exports = router;
