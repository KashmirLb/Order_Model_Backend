import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const adminSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        adminId: {
            type: String,
            required: true,
            trim:true,
         
        },
        password:{
            type: String,
            required:true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },
        lastViewedOrders:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            }
        ],
        firstLogin:{
            type: Boolean,
            default: true
        },
        token: {
            type: String
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

adminSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

adminSchema.methods.checkPassword = async function(formPassword) {
    return await bcrypt.compare(formPassword, this.password)
}

const Admin = mongoose.model("Admin", adminSchema)

export default Admin