import jwt from "jsonwebtoken";
import User from '../models/User.js'

const checkAuth = async (req, res, next) => {
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select("-password -token -updatedAt -__v")
            
        } catch (error) {
            return res.status(400).json({msg: "Error finding user"})
        }
    }

    if(!token){
        const error = new Error('Invalid user Token')
        return res.status(401).json({msg: error.message})
    }

    next()
}

export default checkAuth