import express, { Router } from 'express'
import checkAdminAuth from '../middleware/checkAdminAuth.js'
import checkAuth from '../middleware/checkAuth.js'
import { createOrder, obtainOrders, obtainOrderData, updateOrder, obtainUserOrders } from '../controllers/orderController.js'

const router = express.Router()


//// //// ////  ADMIN RELATED ROUTES


// Create order

router.post("/create-order", checkAdminAuth, createOrder)

// Obtain all orders

router.post("/obtain-orders", checkAdminAuth, obtainOrders)

// Obtain single order data

router.get("/obtain-order-data/:id", checkAdminAuth, obtainOrderData)

// Update order

router.put("/update-order", checkAdminAuth, updateOrder)



//// //// ////  USER RELATED ROUTES

// Obtain list of orders

router.post("/obtain-user-orders", checkAuth, obtainUserOrders)

// Obtain order data

router.get("/user-obtain-order-data/:id", checkAuth, obtainOrderData)


export default router
