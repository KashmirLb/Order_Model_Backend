import generateJWT from "../helpers/generateJWT.js"
import User from "../models/User.js"
import Asset from "../models/Asset.js"
import Order from "../models/Order.js"
import Comment from "../models/Comment.js"
import { generateCustomId } from "../helpers/generateCustomId.js"
import { generateAssetId } from "../helpers/generateAssetId.js"

//Create user account

const createUser = async (req, res) => {

    const { name, lastName, email, items } = req.body

    const nameExists = await User.findOne({name}) 
    const lastNameExists = await User.findOne({lastName}) 
    const emailExists = await User.findOne({email}) 

    if(nameExists&&lastNameExists || emailExists){
        const error = new Error("User already exists")
        return res.status(401).json({msg: error.message})
    }

    try{      
        const newUser = new User(req.body)

        newUser.customId = await generateCustomId()
        newUser.createdBy = req.admin.adminId

        let allItems = []
        items.map( item =>{
            const newItem = new Asset(item)

            newItem.customId = generateAssetId(newUser)
            newItem.owner = newUser._id

            newUser.assets.push(newItem._id)
            allItems.push(newItem)
        })

        await Promise.allSettled([await newUser.save(), await Asset.insertMany(allItems)])

        

        res.json({user: newUser._id})
    }
    catch(error){
        console.log(error)
    }
}

// User login

const loginUser = async (req, res) => {

    const { username, password } = req.body

    const userExists = await User.findOne({customId: username})

    if(!userExists){
        const error = new Error("User does not exist")
        return res.status(404).json({msg: error.message})
    }

    if( await userExists.checkPassword(password)){
        const { name, lastName, email, customId, _id, createdAt, phoneNumber, firstLogin } = userExists

        res.json({
            name,
            lastName,
            email,
            customId,
            _id,
            createdAt,
            phoneNumber,
            firstLogin,
            token: generateJWT(_id)
        })
    }
    else{
        const error = new Error("Incorrect password")
        return res.status(401).json({msg: error.message})
    }
}

// User profile details

const obtainUserProfile = async (req, res) => {
    const { user } = req
    res.json(user)
}

// Obtain all users

const obtainUsers = async (req, res) => {

    const users = await User.find()
    .select("customId name lastName activeOrder")
    .populate({path: "comments", select: "createdAt adminRead", options: {sort: '-createdAt'}, perDocumentLimit: 1})
    .populate({path: "orders", select: "status"})

    res.json(users)
}

// Get User Data

const userData = async (req, res) => {

    const user = await User.findById(req.params.id).select('-password -firstlogin -searchType -updatedAt -__v -createdAt')
    .populate({path: 'assets', select:'customId name'})
    .populate({path: 'orders', select:'-asset -comments -customer -__v' })
    .populate({path:'comments', select: '-updatedAt -user -userRead -__v', populate:{ path: 'order', select: 'customId'}, options:{ sort: '-createdAt'}})

    if(!user){
        const error = new Error("User does not exist")
        return res.status(404).json({msg: error.message})
    }

    res.json(user)
}

// Update user details

const updateUser = async (req,res) =>{

    const { name, lastName, email, phoneNumber } = req.body

    const nameExists = await User.findOne({name, lastName}) 
    const emailExists = await User.findOne({email}) 

    if((nameExists && req.body.customId!==nameExists.customId ) || (emailExists && req.body.customId!==emailExists.customId)){
        const error = new Error("User already exists")
        return res.status(401).json({msg: error.message})
    }

    const prevUser = await User.findById(req.body._id)

    prevUser.name = name
    prevUser.lastName = lastName
    prevUser.email = email
    prevUser.phoneNumber = phoneNumber

    await prevUser.save()

    res.json({msg: "User updated"})
}

// Reset password

const resetPassword = async (req, res)=>{

    try{
        const user = await User.findById(req.body._id)

        user.password = req.body.password
        user.firstLogin = true
    
        await user.save()
    
        res.json({msg: "Password reset"})

    }catch(e){
        const error = new Error("Could not reset password")
        return res.status(401).json({msg: error.message})
    }
}

// Delete user

const deleteUser = async (req,res)=>{

    const user = await User.findById(req.body.id)

    const items = await Asset.find({owner: user._id})
    const orders = await Order.find({customer: user._id})

    const comments = await Comment.find({order: {$in: orders}})

    await Comment.deleteMany({_id: {$in: comments}})
    await Asset.deleteMany({_id: {$in: items}})
    await Order.deleteMany({_id: {$in: orders}})
    await user.deleteOne()

    res.json({msg: "User deleted"})
}

// User changes password

const changePassword = async (req, res)=>{
    const user = await User.findById(req.user._id)

    user.password = req.body.password

    user.save()

    res.json({msg: "Password has been changed"})
}

// User changes contact details

const changeContact = async (req, res)=>{
    const user = await User.findById(req.user._id)

    user.email = req.body.email
    user.phoneNumber = req.body.phoneNumber

    user.save()

    res.json({msg: "Contact details changed"})
}

// Remove 'First login' option from user

const removeFirstLogin = async (req, res) =>{
    const user = await User.findById(req.user._id)

    user.firstLogin = false

    await user.save()

    res.json({msg: "First login removed"})
}

export {
    createUser,
    loginUser,
    obtainUserProfile,
    updateUser,
    resetPassword,
    deleteUser,
    obtainUsers,
    userData,
    changePassword,
    changeContact,
    removeFirstLogin
}