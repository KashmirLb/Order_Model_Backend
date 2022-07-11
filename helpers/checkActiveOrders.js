import User from "../models/User.js"

export const checkActiveOrders = async id =>{

    const user = await User.findById(id)

    const checkActiveOrder = user.orders.some(order=> order.status==="Open" || order.status==="Finished")

    if(checkActiveOrder){
        user.activeOrder = true
        await user.save()
    }
    else{
        user.activeOrder = false
        await user.save()
    }
}