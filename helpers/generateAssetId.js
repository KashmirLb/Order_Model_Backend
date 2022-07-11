export const generateAssetId = client =>{
    const { customId, assets } = client

    let itemId = (assets.length+1).toString()

    while(itemId.length!==2){
        itemId = "0"+itemId
    }

    let shortId = customId.substring(1)
    itemId = "A"+shortId+itemId

    while(assets.some(asset=> asset.customId===itemId)){
       
        let lastTwo = Integer.parseInt(itemId.substring(4))+1
        let firstFour = itemId.substr(0, itemId.length-2)

        itemId=firstFour+lastTwo
    }

    return itemId
}