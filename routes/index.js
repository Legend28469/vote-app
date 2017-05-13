const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');

// Get Index page
router.get('/', (req, res) => {
  Poll.find({}, (err, polls) => {
    if (err) res.send(err);
    res.render('index', { polls: polls.reverse(), user: req.user, url: `${req.protocol}://${req.get('host')}/poll/` });
  });
});

module.exports = router;
