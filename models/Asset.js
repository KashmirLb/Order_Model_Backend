import mongoose from 'mongoose'

const assetSchema = mongoose.Schema({
        name: {
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
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        searchType:{
            type: String,
            default: "items"
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            }
        ]
    },
    {
        timestamps: true
    }
)

const Asset = mongoose.model("Asset", assetSchema)
export default Asset