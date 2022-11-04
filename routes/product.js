const express = require('express')
const router = express.Router()
const product = require('../models/Products')
const Category = require('../models/category')
const mongoose = require('mongoose')
const { count } = require('../models/category')

router.get('/', async(req,res)=>{
    let filter = {}
    if(req.query.category){
         filter = {category:req.query.category.split(',')}  
    }
    const productList = await product.find().populate('category')

    if(!productList){
        res.status(500).json({success:false})
    }
    res.status(200).json(productList)
})

router.post('/',async(req,res)=>{
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(500).send('Invalid Category')
    let Product = new product({
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.image,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured

    }) 
    Product = await Product.save()
   
    if(!Product){
        return res.status(500).send('The product cannot be created')
    }

    res.status(201).json({Product})
})

router.get('/:id',async (req,res)=>{
    const Product = await product.findById({_id:req.params.id}).populate('category')

    if(!Product){
        res.status(500).json({success:false})
    }
    res.status(200).json({Product})
})

router.put('/:id',async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(500).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(500).send('Invalid Category')
    const Product = await product.findByIdAndUpdate({_id:req.params.id},{
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.image,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured
    },{new:true,runValidators:true})
    if(!Product){
        res.status(400).json('product cannot be updated')
    }
    res.status(201).json({Product})
})

router.delete('/:id',(req,res)=>{
    product.findByIdAndDelete({_id:req.params.id}).then(Product =>{
       if(Product){
           return res.status(200).json({success:true,message:'the product is deleted'})
       }else{
           return res.status(404).json({success:false,message:'product not found'})
       }
    }).catch(err =>{
       return res.status(400).json({success:false,error:err})
    })
   })

   router.get('/get/count',async(req,res)=>{ 
    const productCount = await product.countDocuments((count)=>count)

    if(!productCount){
        res.status(500).json({success:false})
    }
    res.send({productCount:productCount})
   })

   router.get('/get/featured/:count',async(req,res)=>{
    const count = Number(req.params.count) ? Number(req.params.count) : 0
    const products = await product.find({isFeatured:true}).limit(count)

    if(!products){
        res.status(500).json({success:false})
    }
    res.send({products})
   })

module.exports = router