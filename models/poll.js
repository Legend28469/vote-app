const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
  question: {
    type: String,
    index: true
  },
  answers: {
    type: Array
  },
  owner: {
    type: String
  }
});

const Poll = module.exports = mongoose.model('Poll', pollSchema);

module.exports.createPoll = (newPoll, callback) => {
  newPoll.save(callback);
}
