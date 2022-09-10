const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  day: {
    type: String,
  },
  steps: {
    type: Array,
    required: true,
    default: 0,
  },
  totalSteps: {
    type: Number,
    default: 0,
  },
  dateCreated: {
    type: Date,
    default: new Date(Date.now),
  },
});
const Activity = mongoose.model('activity', activitySchema)
module.exports = Activity