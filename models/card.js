const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types.ObjectId;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: ObjectId,
    required: true
  },
  likes: [
    {
    type: ObjectId,
    default: []
    }
  ],
  createAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('card', cardSchema);