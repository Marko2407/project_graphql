const mongoose = require('mongoose')

const weeklyActivitySchema = new mongoose.Schema({
    day:{
        type: String
    },
    activities:{
        type: Array
    }
})
const WeeklyActivity = mongoose.model('weeklyActivity', weeklyActivitySchema)
module.exports = WeeklyActivity