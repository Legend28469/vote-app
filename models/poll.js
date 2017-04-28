const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
  question: {
    type: String
  },
  answers: {
    type: Array
  },
  results: {
    type: Array
  },
  owner: {
    type: String
  }
});

const Poll = module.exports = mongoose.model('Poll', pollSchema);

module.exports.createPoll = (poll, owner, callback) => {

}
