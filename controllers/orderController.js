import { checkActiveOrders } from "../helpers/checkActiveOrders.js";
import { generateOrderId } from "../helpers/generateOrderId.js";
import Asset from "../models/Asset.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

//// //// //// ADMIN RELATED CONTROLLERS

// Create a new order

const createOrder = async (req,res) =>{

    try{
        const newOrder = new Order(req.body)
        const user = await User.findById(req.body.customer)
        const item = await Asset.findById(req.body.asset)

        newOrder.customId = generateOrderId(user)

        if(newOrder.status==="Open" || newOrder.status==="Finished"){
            user.activeOrder=true
        }
        user.orders.push(newOrder._id)
        item.orders.push(newOrder._id)
        
        await Promise.allSettled([await newOrder.save(), await user.save(), await item.save()])

        res.json({msg: `Order created correctly.`, order: newOrder._id})
    }
    catch(error){
        console.log(error)
    }
}

// Obtain a list of all orders in X time frame

const obtainOrders = async (req, res) => {

    const { frame } = req.body

    let startDate = new Date(Date.now())

    let endDate = new Date(Date.now())


    if(Array.isArray(frame)){
        startDate = new Date(frame[0])
        endDate = new Date(frame[1])
    }
    
        if(frame==="Day"){
            startDate.setDate(startDate.getDate() - 1)
        }
        if(frame==="Week"){
            startDate.setDate(startDate.getDate() - 7)
        }
        if(frame==="Month"){
            startDate.setMonth(startDate.getMonth() - 1)
        }
        if(frame==="Three Months"){
            startDate.setMonth(startDate.getMonth() - 3)
        }
        if(frame==="Six Months"){
            startDate.setMonth(startDate.getMonth() - 6)
        }
        if(frame==="All"){
            startDate = new Date('1970-01-01 00:00:00')
        }
    
    const orders = await Order.find({
        createdAt:{
            $gte: startDate,
            $lt: endDate
        }
    })
    .populate({path: "comments", select: "adminRead createdAt", options: {sort: '-createdAt'}})
    .select('-searchType -__v')
    .populate({path: 'customer' , select: 'name lastName customId'})
    .populate({path: 'asset' , select: 'name'})
    .sort('-createdAt')

    res.json(orders)
}

// Obtain data from single order

const obtainOrderData = async (req, res)=>{

    const order = await Order.findById(req.params.id)
    .select('customId title description status ')
    .populate({path: 'customer', select: 'name lastName'})
    .populate({path: 'asset', select: 'name customId'})
    .populate({path: 'comments', select: 'comment createdAt adminRead userRead', 
        populate: [{path: 'user', select: 'name lastName'}, {path: 'admin', select: 'name'}],
        options: {sort: '-createdAt'}, perDocumentLimit: 10})

    res.json(order)
}

// Update single order

const updateOrder = async (req, res) => {

    const prevOrder = await Order.findById(req.body._id)
    let commentAdded = {}

    if(prevOrder.status!==req.body.status){
        const newComment = new Comment({
            order: prevOrder._id,
            comment: `Your order is ${req.body.status}`
          })

        newComment.admin = req.admin._id
        newComment.adminRead = true
        prevOrder.comments.push(newComment._id)

        commentAdded = newComment
        await newComment.save()
    }

    prevOrder.description = req.body.description
    prevOrder.status = req.body.status

    await prevOrder.save()

    await checkActiveOrders(req.body.customer._id)

    if(Object.keys(commentAdded).length>0){
        
        res.json({msg: "Order updated", commentAdded })
    }
    else{
        res.json({msg: "Order updated" })
    }
}


//// //// //// USER RELATED CONTROLLERS

// Obtain orders assigned to user

const obtainUserOrders = async (req, res) =>{

    const { frame } = req.body

    let startDate = new Date(Date.now())

    let endDate = new Date(Date.now())


    if(Array.isArray(frame)){
        startDate = new Date(frame[0])
        endDate = new Date(frame[1])
    }
    
        if(frame==="Day"){
            startDate.setDate(startDate.getDate() - 1)
        }
        if(frame==="Week"){
            startDate.setDate(startDate.getDate() - 7)
        }
        if(frame==="Month"){
            startDate.setMonth(startDate.getMonth() - 1)
        }
        if(frame==="Three Months"){
            startDate.setMonth(startDate.getMonth() - 3)
        }
        if(frame==="Six Months"){
            startDate.setMonth(startDate.getMonth() - 6)
        }
        if(frame==="All"){
            startDate = new Date('1970-01-01 00:00:00')
        }
    
    const orders = await Order.find({
        createdAt:{
            $gte: startDate,
            $lt: endDate
        },
        customer: req.user._id
    })
    .populate({path: "comments", select: "userRead createdAt", options: {sort: '-createdAt'}})
    .select('-searchType -__v')
    .populate({path: 'customer' , select: 'name lastName customId'})
    .populate({path: 'asset' , select: 'name customId'})
    .sort('-createdAt')

    res.json(orders)

}

export {
    createOrder,
    obtainOrders,
    obtainOrderData,
    updateOrder,
    obtainUserOrders
}