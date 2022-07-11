import mongoose from 'mongoose'


const commentSchema = mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin"
        },
        comment: {
            type: String,
            required: true
        },
        adminRead: {
            type: Boolean,
            default: false
        },
        userRead: {
            type: Boolean,
            default: false
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Comment = mongoose.model("Comment",commentSchema)
export default Comment