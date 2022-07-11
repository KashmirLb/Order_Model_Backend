export const generateAdminId = adminList => {

    let adminNumber = (adminList+1).toString()

    while(adminNumber.length!==3){
        adminNumber = "0"+adminNumber
    }
    adminNumber = "E"+adminNumber

    return adminNumber
}