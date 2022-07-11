import Comment from "../models/Comment.js"
import User from "../models/User.js"
import Order from "../models/Order.js"

//// //// //// ADMIN RELATED CONTROLLERS

// Obtain all comments in X time frame

const obtainComments = async (req,res) =>{

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
    
    const comments = await Comment.find({
        createdAt:{
            $gte: startDate,
            $lt: endDate
        },
        user: { $exists: true}
    })
    .populate({path: 'order' , select: 'customId'})
    .select('-updatedAt -userRead -__v')
    .populate({path: 'user' , select: 'name lastName customId'})

    res.json(comments)
}

// Set "adminRead" to true, admin has read the comment

const adminReadComment = async (req, res) =>{
    const { id } = req.body
    const comment = await Comment.findById(id)

    if(!comment){
        const error = new Error("Cannot find comment")
        return res.status(404).json({msg: error.message})
    }
    try {
        comment.adminRead = true
        await comment.save()

    } catch (error) {
        console.log(error)
    }
    res.json({msg: "Comment has been set to read by admin"})
}

// Admin creates a new comment

const adminCreatesComment = async (req, res) =>{
    try {
        const newComment = new Comment(req.body)
        const commentOrder = await Order.findById(req.body.order)
        
        newComment.admin = req.admin._id
        newComment.adminRead = true
        commentOrder.comments.push(newComment._id)
        
        await Promise.allSettled([await newComment.save(), await commentOrder.save()])
        res.json(newComment)
        
        
    } catch (error) {
        console.log(error)
    }
}



//// //// ////  USER RELATED ROUTES

// Set "userRead" to true, user has read the new comment

const userReadComment = async (req, res)=> {
    const { id } = req.body
    const comment = await Comment.findById(id)
    
    if(!comment){
        const error = new Error("Cannot find comment")
        return res.status(404).json({msg: error.message})
    }
    try {
        comment.userRead = true
        await comment.save()
        
    } catch (error) {
        console.log(error)
    }
    res.json({msg: "Comment has been set to read by user"})
}

// User posts a new comment

const userCreatesComment = async (req, res)=>{
   
    try {
        const newComment = await new Comment(req.body)
        const commentCreator = await User.findById(req.user._id)
        const commentOrder = await Order.findById(req.body.order)

        newComment.userRead = true
        newComment.user = commentCreator
        commentCreator.comments.push(newComment._id)
        commentOrder.comments.push(newComment._id)

        await Promise.allSettled([ await commentCreator.save(), await newComment.save(), await commentOrder.save()])

        res.json({comment: newComment, user: commentCreator})
        
    } catch (error) {
        console.log(error)
    }
}

// Obtain all comments from admins in user's orders

const userObtainComments = async (req, res)=>{
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
    
    const user = await User.findById(req.user._id)
    const comments = await Comment.find({
        createdAt:{
            $gte: startDate,
            $lt: endDate
        },
        order:{ $in: user.orders},
        admin: { $exists: true}
    })
    .populate({path: 'order' , select: 'customId'})
    .select('-updatedAt -adminRead -__v')
    .populate({path: 'admin', select: 'name'})

    res.json(comments)
}

export {
    obtainComments,
    adminReadComment,
    userCreatesComment,
    adminCreatesComment,
    userReadComment,
    userObtainComments
}