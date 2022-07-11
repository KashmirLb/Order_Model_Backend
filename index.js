import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import itemRoutes from './routes/assetRoutes.js'
import cors from 'cors'

const app = express()

dotenv.config()

app.use(express.json())

connectDB();

const whitelist = [
    process.env.FRONTEND_URL
]

const corsOptions = {
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            callback(null,true)
        }
        else{
            callback(new Error("CORS error"))
        }
    }
}

app.use(cors(corsOptions))

// Routing

app.use("/api/admin", adminRoutes)
app.use("/api/user", userRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/comment", commentRoutes)
app.use("/api/item", itemRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=> console.log("Server connected on",PORT))