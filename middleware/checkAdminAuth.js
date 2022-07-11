import jwt from "jsonwebtoken";
import Admin from '../models/Admin.js'

const checkAdminAuth = async (req, res, next) => {
    let token;

    if(
        
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.admin = await Admin.findById(decoded.id).select("-password -token -updatedAt -__v")
            
        } catch (error) {
            return res.status(400).json({msg: "Error finding admin token"})
        }
    }

    if(!token){
        const error = new Error('Invalid user Token')
        return res.status(401).json({msg: error.message})
    }
    if(!req.admin.active){
        const error = new Error('User inactive')
        return res.status(401).json({msg: error.message})
    }


    next()
}

export default checkAdminAuth