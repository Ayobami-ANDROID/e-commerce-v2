const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/', async(req,res)=>{
    const userList = await User.find()

    if(!userList){
        res.status(500).json({success:false})
    }
    res.status(200).json(userList)
})

router.post('/',async (req,res)=>{
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country
    })
   user  = await user.save()
    if(!category){
        return res.status(404).send('the user cannot be created!')
    }
    res.status(200).json({user})
})
 
module.exports = router