const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const orderItem = require('../models/order-item')

router.get('/', async(req,res)=>{
    const orderList = await Order.find()

    if(!orderList){
        res.status(500).json({success:false})
    }
    res.status(200).json(orderList)
})
 
router.post('/',async (req,res)=>{
    const orderItemsIds = Promise.all (req.body.orderItems.map(async orderItem => {
        let newOrderItem = new orderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })

        newOrderItem = await newOrderItem.save()
        return newOrderItem._id
    }))
    let order = new Order({
        orderItems:orderItemsIds,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:req.body.totalPrice,
        user:req.body.user
    })
    order = await order.save()
    if(!order){
        return res.status(404).send('the category cannot be created!')
    }
    res.status(200).json({order})
})

module.exports = router