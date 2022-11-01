const express = require('express')
const router = express.Router()
const product = require('../models/Products')

router.get('/', async(req,res)=>{
    const productList = await product.find()

    if(!productList){
        res.status(500).json({success:false})
    }
    res.status(200).json(productList)
})

router.post('/count',async(req,res)=>{
    const Product = new product({
        name:req.body.name,
        image:req.body.image,
        countInStock:req.body.countInStock
    }) 
    Product.save().then((createdProduct =>{
        res.status(201).json(createdProduct)
    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success:false
        })
    })
})

module.exports = router