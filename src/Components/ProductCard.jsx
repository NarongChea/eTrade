import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router-dom";

const ProductCard = ({id, name, price, images, rate, discount, description }) => {
  const { isAuthenticated} = useContext(AuthContext);
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-sm hover:shadow-lg group transition-all">
      {/* Image Section */}
      <div className="relative flex justify-center">
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
        <img
          src={images[0]}
          alt={name}
          className=" h-64 transition-all group-hover:scale-[1.1] mix-blend-multiply"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{description}</p>

        {/* Star Rating */}
        <div className="flex items-center text-yellow-500 text-sm mb-2">
          {Array(5).fill().map((_, i) => {
  const full = i + 1 <= rate;
  const half = i + 0.5 === rate;
  return (
    <span key={i}>
      {full ? "★" : half ? "⯨" : "☆"}
    </span>
  );
})}

          <span className="ml-2 text-gray-600">({rate}/5)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold text-black">${(price * (1 - discount / 100)).toFixed(2)}</div>
          {discount > 0 && (
            <div className="line-through text-sm text-gray-400">${price.toFixed(2)}</div>
          )}
        </div>

        {/* Button */}
        <Link to={isAuthenticated ?  `/products/${id}` : "/login"}>
        <button className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
          View Details
        </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
