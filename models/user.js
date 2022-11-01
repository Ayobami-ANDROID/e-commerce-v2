const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:String,
    image:String,
    countInStock :{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('user',userSchema)