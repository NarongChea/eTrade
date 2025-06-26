import { useContext } from "react";
import { ProductsCon } from "../context/ProductsContext";
import ProductCard from "./ProductCard";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router-dom";

const ProductsSection = () => {
    const {homeData} = useContext(ProductsCon)
    const {isAuthenticated} = useContext(AuthContext);
  return (
    <section className="bg-gray-50 p-8">
       
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
            Our Products
          </span>
          <h2 className="text-2xl font-bold mt-2">Explore our Products</h2>
        </div>
        <Link to={isAuthenticated ?  "/products" : "/login"}>
          <button className="border px-4 py-2 rounded hover:bg-gray-100">View All Products</button>
        </Link>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {homeData.slice(0,8).map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      </div>
    </section>
  );
};
export default ProductsSection