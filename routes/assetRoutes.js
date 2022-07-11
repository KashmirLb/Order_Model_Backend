import express from 'express'
import checkAdminAuth from '../middleware/checkAdminAuth.js'
import checkAuth from '../middleware/checkAuth.js'
import { obtainItems, obtainItemData, updateItem, deleteItem, createItem, userObtainItems } from '../controllers/assetController.js'

const router = express.Router()

//// //// ////  ADMIN RELATED ROUTES

// Obtain all items

router.get("/obtain-items", checkAdminAuth, obtainItems)

// Obtain one item

router.get("/item-data/:id", checkAdminAuth, obtainItemData)

// Update item

router.put("/update-item", checkAdminAuth, updateItem)

// Delete item

router.post("/delete-item", checkAdminAuth, deleteItem)

// Create item

router.post("/create-item", checkAdminAuth, createItem)



//// //// ////  USER RELATED ROUTES

// List of items of user

router.get("/user-obtain-items", checkAuth, userObtainItems)

// Obtain item data

router.get("/user-item-data/:id", checkAuth, obtainItemData)

export default router