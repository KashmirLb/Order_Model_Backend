export const generateOrderId = client =>{
    const { customId, orders } = client

    let orderId = (orders.length+1).toString()

    while(orderId.length!==2){
        orderId = "0"+orderId
    }

    let shortId = customId.substring(1)
    orderId = "R"+shortId+orderId

    return orderId
}