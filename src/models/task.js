const mongoose = require('mongoose')
const User = require('./user')

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    completed: {
        type: Boolean,
        default:false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task