const mongoose = require('mongoose')

const monthlyActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  week: {
    type: String,
  },
  dateRange: {
    type: String,
  },
  weeklyActivities: {
    type: Array,
  },
});
const MonthlyActivity = mongoose.model('monthlyActivity', monthlyActivitySchema)
module.exports = MonthlyActivity