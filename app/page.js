import Image from "next/image";
import { getProducts } from "./productsStore";
import ProductCard from "./ProductCard";

export default function Home() {

  // Fetch the products
  const products = getProducts();

  // Log the products to the console
  console.log('Available products:', products);

  return (
    <main className="p-4 flex flex-col">
      <div className="max-w-[1000px] w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product, productIndex) => {
          return (
            <ProductCard key={productIndex} product={product}/>
          )
        })}
      </div>
    </main>
  );
}
