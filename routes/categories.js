const express = require('express')
const category = require('../models/category')
const router = express.Router()
const Category = require('../models/category')

router.get('/', async(req,res)=>{
    const categoryList = await Categories.find()

    if(!categoryList){
        res.status(500).json({success:false})
    }
    res.status(200).json(categoryList)
})

router.post('/',async (req,res)=>{
    let category = new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })
    category = await category.save()
    if(!category){
        return res.status(404).send('the category cannot be created!')
    }
    res.status(200).json({category})
})

router.get('/:id',async(req,res)=>{
    const category = await Category.findById({_id:req.params.id})
    if(!category){
        res.status(500).json({message:'The category with given Id was not found'})
    }
    res.status(200).json({category})
})

router.patch('/:id',async(req,res)=>{
    const category = await Category.findByIdAndUpdate({_id:req.params.id},{
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    },{new:true,runValidators:true})
    if(!category){
        res.status(400).json({message:'The category not be createc'})
    }
})

router.delete('/:id',(req,res)=>{
 Category.findByIdAndDelete({_id:req.params.id}).then(category =>{
    if(category){
        return res.status(200).json({success:true,message:'the category is deleted'})
    }else{
        return res.status(404).json({success:false,message:'category not found'})
    }
 }).catch(err =>{
    return res.status(400).json({success:false,error:err})
 })
})

module.exports = router