"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import useCart from './(store)/store'

export default function ProductCard (props)  {
    const { product } = props;
    const { id, price, title, image } = product

    const router = useRouter();

    const setProduct = useCart(state => state.setProduct);

    function onProductClick() {
        const newProduct = {
            id,
            title,
            price,
            image
        }
        setProduct({ newProduct })
        router.push('/product?price_id=' + id)
    }

    return (
        <div onClick={onProductClick} className='flex flex-col shadow bg-white hover:shadow-lg curson-point'>
            <img src={image} className='w-full h-full object-cover'/>
            <div className='flex flex-col gap-2 p-4'>
                <div className='flex items-center justify-between'>
                    <h3> {title} </h3>
                    <p> $ {price} </p>
                </div>
            </div>
        </div>
    )
}

