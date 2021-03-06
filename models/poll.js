const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
  question: {
    type: String,
    index: true
  },
  answers: [{
    answer: String,
    votes: Number
  }],
  owner: {
    type: String
  },
  voted:
    []
});

const Poll = module.exports = mongoose.model('Poll', pollSchema);

module.exports.createPoll = (newPoll, callback) => {
  newPoll.save(callback);
}

module.exports.updatePoll = (Poll, callback) => {
  Poll.update(callback);
}
