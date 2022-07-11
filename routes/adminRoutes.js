import express from 'express'
import { checkAdmin, createAdmin, loginAdmin, searchList, addViewedOrder, obtainLastViewedOrders, 
    updateAdmin, obtainAdminList, resetPassword, activateDisableAdmin, removeFirstLogin } from '../controllers/adminController.js'
import checkAdminAuth from '../middleware/checkAdminAuth.js';

const router = express.Router();

// Log in admin

router.post("/login", loginAdmin)

// Create admin

router.post("/create-admin", createAdmin)

// Check admin

router.get("/check-admin", checkAdminAuth, checkAdmin)

// Obtain search list

router.get("/search-list", checkAdminAuth, searchList )

// Add viewed Order

router.put("/add-viewed-order", checkAdminAuth, addViewedOrder)

// Obtain last viewed orders

router.get("/obtain-last-viewed", checkAdminAuth, obtainLastViewedOrders)

// List Admins

router.get("/admin-list",checkAdminAuth, obtainAdminList)

// Update admin info

router.put("/update-admin", checkAdminAuth, updateAdmin)

// Reset admin password

router.put("/reset-password", checkAdminAuth, resetPassword)

// Activate / Disable admin

router.put("/activate-disable", checkAdminAuth, activateDisableAdmin)

// Remove first login

router.put("/remove-first-login", checkAdminAuth, removeFirstLogin)

export default router