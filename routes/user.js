const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const user = require('../models/user')
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

router.post('/register',async (req,res)=>{
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
            userId:user.id,
            isAdmin:user.isAdmin
        },process.env.Jwt_Secret)
        res.status(200).json({user:user.email,token:token})
    }
    else{
        res.status(400).send('password is wrong!')
    }
})

router.put('/:id',async (req,res)=>{
    const userExist = await User.findById({_id:req.params.id})
    let newPassword
    if(req.body.password){
        newPassword= bcrypt.hashSync(req.body.password,10)
    }
    else{
        newPassword = userExist.passwordHash
    }
    let user = new User.findByIdAndUpdate({_id:req.params.id},{
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.newPassword,
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country
    },{new:true,runValidators:true})
   user  = await user.save()
    if(!user){
        return res.status(404).send('the user cannot be created!')
    }
    res.status(200).json({user})
})

router.get('/get/count',async(req,res)=>{ 
    const userCount = await User.countDocuments((count)=>count)

    if(!userCount){
        res.status(500).json({success:false})
    }
    res.send({userCount:userCount})
   })


router.delete('/:id',(req,res)=>{
    User.findByIdAndDelete({_id:req.params.id}).then(user =>{
        if(user){
            return res.status(200).json({success:true,message:'the category is deleted'})
        }else{
            return res.status(404).json({success:false,message:'category not found'})
        }
     }).catch(err =>{
        return res.status(400).json({success:false,error:err})
     })
})
 
module.exports = router