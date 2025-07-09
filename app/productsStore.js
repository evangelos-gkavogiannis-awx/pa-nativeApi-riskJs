const productsArray = [
    {
        id: "price_1LnUTFDM1jwCEz8OGoOSXiSM",
        title: "Motherboard",
        price: 124.99,
        image:"/images/motherboard.png"
    },
    {
        id: "price_1LnUTxDM1jwCEz8OAqHYTwKQ",
        title: "Airpods",
        price: 109.99,
        image:"/images/airpods.png"
    },
    {
        id: "price_1LnUUoDM1jwCEz8OvxIcJ7to",
        title: "Iphone Case",
        price: 39.99,
        image:"/images/case.png"
    }
];

function getProductData(id) {
    let productData = productsArray.find(product => product.id === id);

    if (productData == undefined) {
        console.log("Product data does not exist for ID: " + id);
        return undefined;
    }

    return productData;
}

function getProducts() {
    return productsArray;
}

export { productsArray, getProductData, getProducts };