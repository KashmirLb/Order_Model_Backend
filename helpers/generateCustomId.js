import { UserCount } from "../models/User.js"

export const generateCustomId = async () => {

    const count = await UserCount.find({})

    let userNumber = (count[0].count+1).toString()

    while(userNumber.length!==3){
        userNumber = "0"+userNumber
    }
    userNumber = "C"+userNumber

    count[0].count = count[0].count+1
    await count[0].save()

    return userNumber
}