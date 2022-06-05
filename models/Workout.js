const mongoose = require('mongoose')

const days = {
    Monday: "Monday" , Tuesday: "Tuesday", Wednesday: "Wednesday", Thursday : "Thursday", Friday: "Friday"
}


const WorkoutSchema = new mongoose.Schema({
    day:{
        type: String,
        enum: days,
        default: days.Monday
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    dateCreated:{
        type: String,
        default: new Date(Date.now).toLocaleDateString
    }
})

const Workout = mongoose.model('workout', WorkoutSchema)
module.exports = Workout