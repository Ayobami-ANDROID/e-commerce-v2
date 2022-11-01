const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    name:String,
    image:String,
    countInStock :{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('order',orderSchema)