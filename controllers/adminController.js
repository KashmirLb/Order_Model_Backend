import bcrypt from 'bcrypt'
import { generateAdminId } from "../helpers/generateAdminId.js"
import generateJWT from "../helpers/generateJWT.js"
import Admin from "../models/Admin.js"
import User from "../models/User.js"
import Order from "../models/Order.js"
import Asset from "../models/Asset.js"

// Create admin account

const createAdmin = async (req,res) => {

    const { name, lastName, email } = req.body

    const nameExists = await Admin.findOne({name: name, lastName: lastName}) 
    const emailExists = await Admin.findOne({email}) 

    if(nameExists || emailExists){
        const error = new Error("User already exists")
        return res.status(401).json({msg: error.message})
    }

    try{
        const allAdmins = await Admin.count({})
      
        const newAdmin = new Admin(req.body)

        newAdmin.adminId = generateAdminId(allAdmins)

        newAdmin.save()

        res.json({msg: `Admin ${newAdmin.name} ${newAdmin.lastName} created with ID: ${newAdmin.adminId}`})
    }
    catch(error){
        console.log(error)
    }
}

// Authenticate admin

const loginAdmin = async (req, res) => {

    const { username, password } = req.body

    const adminUser = await Admin.findOne({adminId: username})

    if(!adminUser){
        const error = new Error("User does not exist")
        return res.status(404).json({msg: error.message})
    }
    if(!adminUser.active){
        const error = new Error('User inactive')
        return res.status(401).json({msg: error.message})
    }

    if( await adminUser.checkPassword(password)){

        const { name, lastName, email, adminId, _id, createdAt, firstLogin } = adminUser

        res.json({
            name,
            lastName,
            email,
            adminId,
            _id,
            createdAt,
            firstLogin,
            token: generateJWT(_id)
        })
    }
    else{
        const error = new Error("Incorrect password")
        return res.status(401).json({msg: error.message})
    }
}

// Admin profile

const checkAdmin = async (req, res) => {

    try {
        const { admin } = req
        res.json( admin )
    } catch (error) {
        console.log(error)
        res.json(error)
    }
   
}

// Get Search List

const searchList = async (req, res) => {
    const users = await User.find({}).select("customId name lastName searchType").populate({path: "assets", select: "customId name"})
    const orders = await Order.find({}).select("customId searchType")
    const items = await Asset.find({}).select("customId searchType")

    const searchList = [...users, ...orders, ...items]

    res.json(searchList)
}

// Add viewed order to last viewed order list

const addViewedOrder = async (req, res)=>{

    const admin = await Admin.findById(req.admin._id)
    const order = await Order.findById(req.body.id)

    if(admin.lastViewedOrders[admin.lastViewedOrders.length-1]?._id.equals(order._id)){
        res.json({msg: "Already added"})
    }
    else{
        admin.lastViewedOrders = admin.lastViewedOrders.filter(selectOrder => !selectOrder._id.equals(order._id))
        
        admin.lastViewedOrders.push(order._id)
    
        if(admin.lastViewedOrders.length>10){
            admin.lastViewedOrders.shift()
        }
    
        await admin.save()
        res.json({msg: "order added"})
    }
}

// Obtain last viewed orders

const obtainLastViewedOrders = async (req, res)=>{

    const admin = await Admin.findById(req.admin._id)
        .populate({path: 'lastViewedOrders', select: 'customId title updatedAt', 
                populate: [{path: 'customer', select: 'name lastName'}, {path: 'asset', select: 'name customId'}]})

    res.json({orders: admin.lastViewedOrders})
}

// Obtain list of existing admins

const obtainAdminList = async (req,res)=>{
    const adminList = await Admin.find({})
        .select('name lastName adminId active')

    res.json(adminList)
}

// Update admin details

const updateAdmin = async (req, res)=>{

    const { name, lastName, email } = req.body

    const nameExists = await Admin.findOne({name, lastName}) 
    const emailExists = await Admin.findOne({email}) 

    if((nameExists && req.body.adminId!==nameExists.adminId ) || (emailExists && req.body.adminId!==emailExists.adminId)){
        const error = new Error("User already exists")
        return res.status(401).json({msg: error.message})
    }

    const prevAdmin = await Admin.findById(req.body._id)

    prevAdmin.name = name
    prevAdmin.lastName = lastName
    prevAdmin.email = email

    await prevAdmin.save()

    res.json({msg: "Admin updated"})
}

// Reset admin password

const resetPassword = async (req, res) =>{

    const admin = await Admin.findById(req.body._id)
  
    admin.password = req.body.password
    admin.firstLogin = req.body.firstLogin

    admin.save()

    res.json({msg: `Password for ${admin.adminId} has been reset`})

}

// Disable or activate admin account

const activateDisableAdmin = async (req,res)=>{
    const admin = await Admin.findById(req.body._id)

    admin.active = !admin.active
    
    await admin.save()

    res.json({msg: `Admin ${admin.adminId} is now ${admin.active ? "active" : "disabled"}`})
}

// Remote first login option from admin account

const removeFirstLogin = async (req, res)=>{
    const admin = await Admin.findById(req.admin._id)

    admin.firstLogin = false

    await admin.save()

    res.json({msg: "First login removed"})
}

export {
    createAdmin,
    loginAdmin,
    checkAdmin,
    searchList,
    addViewedOrder,
    obtainLastViewedOrders,
    updateAdmin,
    obtainAdminList,
    resetPassword,
    activateDisableAdmin,
    removeFirstLogin
}