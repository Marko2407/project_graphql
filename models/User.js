const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true

    },
    weight:{
        type: Number,
        default: 0
    },
    height:{
        type: Number,
        default: 0
    },
})
const User = mongoose.model('user', userSchema)
module.exports = User