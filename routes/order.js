const express = require('express')
const router = express.Router()
const Order = require('../models/order')
let OrderItem = require('../models/order-item')
const { populate } = require('../models/user')
require('dotenv').config()
const stripe = require('stripe')(process.env.Secret_Key)

router.get('/', async(req,res)=>{
    const orderList = await Order.find({}).populate('user','name').sort({'dateOrdered': -1})

    if(!orderList){
        res.status(500).json({success:false})
    }
    res.status(200).json(orderList)
})
 
router.post('/',async (req,res)=>{
    const orderItemsIds = Promise.all (req.body.orderItems.map(async orderItem => {
        let newOrderItem =  OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })

        newOrderItem = await newOrderItem.save()
        return newOrderItem._id
    }))

    const orderItemsIdsResolved = await orderItemsIds

const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) =>{
    const orderItem = await  OrderItem.findById(orderItemId).populate('product','price ')
    const totalPrice = orderItem.product.price*orderItem.quantity
    return totalPrice
}))

const totalPrice = totalPrices.reduce((a,b)=>a+b,0)

console.log(totalPrices)
const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice * 100,
    currency: 'NGN',
  });
console.log(paymentIntent)

    let order = new Order({
        orderItems:orderItemsIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:totalPrice,
        paymentIntentId:paymentIntent.client_secret, 
        user:req.body.user
    })
    order = await order.save()
    if(!order){
        return res.status(404).send('the category cannot be created!')
    }
    res.status(200).json({order,paymentIntentId:paymentIntent.client_secret})
})

router.get('/:id', async(req,res)=>{
    const order = await Order.findById({_id:req.params.id}).populate('user','name').populate({path:'orderItems',populate:'product'})

    if(!order){
        res.status(500).json({success:false})
    }
    res.status(200).json(order)
})

router.put('/:id',async(req,res)=>{
    const order = await Order.findByIdAndUpdate({_id:req.params.id},{
        status:req.body.status
    },{new:true,runValidators:true})
    if(!order){
        res.status(400).json({message:'The order not be updated'})
    }
    res.status(200).json({order})
})

router.delete('/:id',async(req,res)=>{
    Order.findByIdAndDelete({_id:req.params.id}).then(async order =>{
       if(order){
           await order.orderItems.map(async orderItem =>{
            await OrderItem.findByIdAndRemove(orderItem)
           })
           return res.status(200).json({success:true,message:'the category is deleted'})
       }else{
           return res.status(404).json({success:false,message:'category not found'})
       }
    }).catch(err =>{
       return res.status(400).json({success:false,error:err})
    })
   })
   
   router.get('/get/totalsales',async (req,res)=>{
         const totalSales = await Order.aggregate([
            {$group:{_id:null,totalSales:{$sum:'$totalPrice'}}}
         ])
         if(!totalSales){
            return res.status(400).send('The order sales cannot be generated')
         }
         res.status(200).json({totalSales:totalSales.pop().totalSales})
   })

   router.get('/get/count',async(req,res)=>{ 
    const orderCount = await Order.countDocuments((count)=>count)

    if(!orderCount){
        res.status(500).json({success:false})
    }
    res.send({orderCount:orderCount})
   })

   router.get('/get/userorders/:userid', async(req,res)=>{
    const userOrderList = await Order.find({user:req.params.userid}).populate({path:'orderItems',populate:{
        path:'product',populate:'category'}}).sort({'dateOrdered':-1})

    if(!userOrderList){
        res.status(500).json({success:false})
    }
    res.status(200).json(userOrderList)
})

module.exports = router