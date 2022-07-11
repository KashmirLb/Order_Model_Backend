import Asset from "../models/Asset.js"
import User from "../models/User.js"
import { generateAssetId } from "../helpers/generateAssetId.js"


// Obtain a list of all items (assets)

const obtainItems = async (req, res) => {

    try {
        const items = await Asset.find()
            .select("customId name createdAt")
            .populate({path: "owner", select: "name lastName"})
            .populate({path: "orders", select: "customId status createdAt", options: {sort: '-createdAt'}, perDocumentLimit: 1})
        res.json(items)
    } catch (error) {   
        return res.status(404).json({msg: error.message})
    }
}

// Obtain details from a single item (asset)

const obtainItemData = async (req, res)=>{
    
    const item = await Asset.findById(req.params.id)
        .select("name description customId createdAt")
        .populate({path: "owner", select: "name lastName"})
        .populate({path: "orders", select: "customId status createdAt title description createdAt updatedAt", options: {sort: '-createdAt'}})

    res.json(item)
}

// Update a single item (asset)

const updateItem = async (req, res)=>{

    try{
        const item = await Asset.findById(req.body._id)
    
        item.name = req.body.name
        item.description = req.body.description
    
        await item.save()
    
        res.json({msg: "Item updated correctly", item})

    }
    catch(e){
        const error = new Error("Update failed")
        return res.status(401).json({msg: error.message})
    }

}

// Delete a single item (asset)

const deleteItem = async (req, res)=>{

    const item = await Asset.findById(req.body.id)

    await item.deleteOne()

    res.json({msg: "Item deleted"})
}

// Create a new item (asset)

const createItem = async (req, res) =>{

    try{
        const newItem = new Asset(req.body)

        const owner = await User.findById(newItem.owner)

        newItem.customId = generateAssetId(owner)

        owner.assets.push(newItem._id)
        
        await Promise.allSettled([await newItem.save(), await owner.save()])

        res.json({item: newItem._id, customId: newItem.customId})
    }
    catch(error){
        console.log(error)
    }
}


//// //// //// USER RELATED CONTROLLERS

// User obtains owned items (assets)

const userObtainItems = async(req, res) =>{
    try {
        const items = await Asset.find({
            owner: req.user._id
        })
            .select("customId name createdAt")
            .populate({path: "owner", select: "name lastName"})
            .populate({path: "orders", select: "customId status createdAt", options: {sort: '-createdAt'}, perDocumentLimit: 1})
        res.json(items)
    } catch (error) {   
        return res.status(404).json({msg: error.message})
    }
}


export {
    obtainItems,
    obtainItemData,
    updateItem,
    deleteItem,
    createItem,
    userObtainItems
}