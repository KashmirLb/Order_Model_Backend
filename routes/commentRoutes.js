import express from 'express'
import checkAdminAuth from '../middleware/checkAdminAuth.js'
import { obtainComments, adminReadComment, userCreatesComment, adminCreatesComment, userReadComment, userObtainComments } from '../controllers/commentController.js'
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router()

//// //// ////  ADMIN RELATED ROUTES

// Obtain comments

router.post("/obtain-comments", checkAdminAuth, obtainComments)

// Set comment to read by admin

router.put("/admin-read", checkAdminAuth, adminReadComment)

// Admin creates comment

router.post("/admin-creates", checkAdminAuth, adminCreatesComment)



//// //// ////  USER RELATED ROUTES

router.put("/user-read", checkAuth, userReadComment)

// User creates a comment

router.post("/user-creates", checkAuth, userCreatesComment)

// User obtains comments

router.post("/user-obtain-comments", checkAuth, userObtainComments)




export default router
