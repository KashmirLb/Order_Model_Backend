import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        customId:{
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            required: true,
            enum: ["Open", "Finished", "Closed"],
            default: "Open"
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        searchType:{
            type: String,
            default: "orders"
        },
        asset:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Asset"
            },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model("Order", orderSchema)
export default Order