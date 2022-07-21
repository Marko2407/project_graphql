const mongoose = require('mongoose')

const weeklyActivitySchema = new mongoose.Schema({
    day:{
        type: String
    },
    dateCreated:{
        type: Date
    },
    activites:{
        type: Array
    }
})
const WeeklyActivity = mongoose.model('weeklyActivity', weeklyActivitySchema)
module.exports = WeeklyActivity