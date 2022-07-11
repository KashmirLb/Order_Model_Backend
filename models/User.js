import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true
        },
        customId: {
            type: String,
            required: true,
            trim:true,
            unique: true
        },
        password:{
            type: String,
            required:true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            unique: true
        },
        phoneNumber:{
            type: String,
        },
        createdBy: {
            type: String,
            required: true
        },
        firstLogin: {
            type: Boolean,
            required: true,
            default: true
        },
        searchType:{
            type: String,
            default: "users"
        },
        assets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Asset",
            }
        ],
        orders:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            }
        ],
        activeOrder:{
            type: Boolean,
            default: false,
            required: true
        },
        comments:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            }
        ],
        token: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const userCountSchema = mongoose.Schema({
    count: {
        type: Number
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.checkPassword = async function(formPassword) {
    return await bcrypt.compare(formPassword, this.password)
}

const User = mongoose.model("User", userSchema)
const UserCount = mongoose.model("UserCount", userCountSchema, "User")

export default User
export {
    UserCount
}