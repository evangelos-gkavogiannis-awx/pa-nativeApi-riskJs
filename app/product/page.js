"use client"
import useCart from "../(store)/store"
import { getProductData } from "../productsStore"; // Import getProductData from your hardcoded data
import { useEffect } from 'react';

export default function ProductPage(props) {
    const { searchParams } = props;
    const { price_id } = searchParams
    const product = useCart(state => state.product)
    const addItemToCart = useCart(state => state.addItemToCart)
    const setProduct = useCart(state => state.setProduct);
    console.log(product)
    console.log(searchParams)
    console.log("pao")

    // if (!product?.name) {
    //     window.location.href = '/'
    // }

    useEffect(() => {
        if (!product || product.id !== price_id) {
            // Get the product data from the hardcoded array using getProductData
            const fetchedProduct = getProductData(price_id);

            // Check if the product exists
            if (fetchedProduct) {
                // Set the product in Zustand store
                setProduct({ newProduct: fetchedProduct });
            } else {
                console.error("Product not found for id: " + price_id);
            }
        }
    }, [price_id, product, setProduct]);

    // Check if the product exists before destructuring
    if (!product) {
        return <p>Loading product...</p>;  // Display a loading message or handle redirection if product is missing
    }

     // Destructure the product only when it exists
    const { id, title, price, image } = product;

    function handleAddToCart() {
        console.log('PRICE ID: ', price_id)
        const newItem = {
            quantity: 1,
            price,
            title
        }
        addItemToCart({ newItem })
    }

    return (
        <div className="flex flex-col p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-[1000px] mx-auto">
                <div className="md:p-2 md:shadow">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex md:flex-col md:items-start text-xl  items-center justify-between gap-2">
                        <h3>{title}</h3>
                        <p className="md:text-base">${price}</p>
                    </div>
                    <p className="text-sm flex-1">{title}</p>
                    <button onClick={handleAddToCart} className="bg-slate-700 text-white hover:bg-slate-500 cursor-pointer ml-auto px-4 py-2">Add to Cart</button>
                </div>
            </div>
        </div>
    )
}