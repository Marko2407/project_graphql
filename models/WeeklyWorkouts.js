const mongoose = require('mongoose')

const WeeklyWorkoutSchema = new mongoose.Schema({
    day:{
        type: String
    },
    workouts:{
         type: Array
    }
   
})

const WeeklyWorkout = mongoose.model('weeklyWorkout', WeeklyWorkoutSchema)
module.exports = WeeklyWorkout