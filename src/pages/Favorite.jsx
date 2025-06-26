import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../context/FavoriteProvider";
import { ProductsCon } from "../context/ProductsContext";

const Favorite = () => {
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const { allProducts } = useContext(ProductsCon);

  // Only show favorite items that still exist in the product list
  const validFavorites = favorites.filter((fav) =>
    allProducts.some((prod) => prod.id == fav.id)
  );
  favorites.forEach(fav => console.log(typeof fav.id, fav.id));
allProducts.forEach(prod => console.log(typeof prod.id, prod.id));
  return (
    <div className="max-w-6xl min-h-[62.1vh] mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Favorites</h2>

      {validFavorites.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          You have no favorite items yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {validFavorites.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative">
                <img
                  src={Array.isArray(product.images) ? product.images[0] : product.images}
                  alt={product.name}
                  className="h-48 w-full object-contain p-4 mix-blend-multiply"
                />
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-white text-red-500"
                >
                  <i className="bx bxs-heart text-xl"></i>
                </button>
              </div>

              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
                  {product.category}
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-1">
                  {product.name}
                </h3>

                <div className="flex items-center text-yellow-400 text-sm mb-1">
                  {Array.from({ length: 5 }).map((_, i) =>
                    product.rate >= i + 1 ? (
                      <i key={i} className="bx bxs-star"></i>
                    ) : product.rate >= i + 0.5 ? (
                      <i key={i} className="bx bxs-star-half"></i>
                    ) : (
                      <i key={i} className="bx bx-star"></i>
                    )
                  )}
                  <span className="text-gray-600 ml-1 text-xs">
                    {product.rate ? product.rate.toFixed(1) : "0.0"}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3">
                  {product.discount > 0 ? (
                    <div className="text-sm text-gray-800 font-semibold">
                      <span>
                        $
                        {(
                          product.price -
                          (product.price * product.discount) / 100
                        ).toFixed(2)}
                      </span>
                      <span className="ml-2 line-through text-gray-400 text-xs">
                        ${product.price}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-800 font-semibold">
                      ${product.price}
                    </div>
                  )}

                  <Link
                    to={`/products/${product.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
