import express from 'express'
import { loginUser, obtainUserProfile, updateUser, resetPassword, deleteUser, createUser, 
    obtainUsers, userData, changePassword, changeContact, removeFirstLogin } from '../controllers/userController.js'
import checkAdminAuth from '../middleware/checkAdminAuth.js'
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router()

// Create user

router.post("/create-user", checkAdminAuth, createUser)

// User login

router.post("/user-login", loginUser)

// Obtain user profile

router.get("/profile",checkAuth, obtainUserProfile)

// Obtain all users

router.get("/user-list", checkAdminAuth, obtainUsers)

// Obtain user data

router.get("/user-data/:id", checkAdminAuth, userData)

// Update user info

router.put("/update-user", checkAdminAuth, updateUser)

// Reset Password

router.put("/reset-password", checkAdminAuth, resetPassword)

//Delete User

router.post("/delete-user", checkAdminAuth, deleteUser)

// User password change

router.put("/password-change", checkAuth, changePassword )

// User contact details change

router.put("/contact-change", checkAuth, changeContact)

// User deletes account

router.post("/delete-account", checkAuth, deleteUser)

// User remove first login

router.put("/remove-first-login", checkAuth, removeFirstLogin)

export default router