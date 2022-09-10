const mongoose = require('mongoose')

const WorkoutSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    day: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: new Date(Date.now)
    },
    reps: {
        type: Number,
        required: true,
        default: 1
    },
    series: {
        type: Number,
        required: true,
        default: 1
    },
})
const Workout = mongoose.model('workout', WorkoutSchema)
module.exports = Workout