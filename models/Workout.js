const mongoose = require('mongoose')

const WorkoutSchema = new mongoose.Schema({
    day:{
        type: String
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    dateCreated:{
        type: Date,
        default: new Date(Date.now)
    }
})

const Workout = mongoose.model('workout', WorkoutSchema)
module.exports = Workout