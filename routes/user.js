const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

router.get('/', async(req,res)=>{
    const userList = await User.find().select('-passwordHash')

    if(!userList){
        res.status(500).json({success:false})
    }
    res.status(200).json(userList)
})

router.get('/:id', async(req,res)=>{
    const userList = await User.find({_id:req.params.id}).select('-passwordHash')

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
    if(!user){
        return res.status(404).send('the user cannot be created!')
    }
    res.status(200).json({user})
})

router.post('/login',async (req,res)=>{
    const user = await User.findOne({email:req.body.email})

    if(!user){
        return res.status(400).json({msg:"user not found"})
    }

    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token = jwt.sign({
            userId:user.id
        },process.env.Jwt_Secret)
        res.status(200).json({user:user.email,token:token})
    }
    else{
        res.status(400).send('password is wrong!')
    }
   
})
 
module.exports = router