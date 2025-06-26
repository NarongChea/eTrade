import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartProvider';
import { FavoritesContext } from '../context/FavoriteProvider';

const ProductListCard = ({ product, showStyle }) => {
  const { addToCart } = useContext(CartContext);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const isFavorited = favorites.some(fav => fav.id === product.id);

  return (
    <div className="group rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow">
      <div className={`p-4 ${showStyle === "list" ? "flex gap-3 items-center" : ""}`}>
        <div className="relative mb-2 bg-slate-100 rounded-sm">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`group-hover:scale-110 transition-all w-full ${
              showStyle === "grid" ? "h-48" : "h-36"
            } object-contain rounded-lg mix-blend-multiply`}
          />
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-600 text-white">
              {product.discount}% OFF
            </div>
          )}
          <button
            onClick={() => toggleFavorite(product)}
            className="absolute top-2 right-2 inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            style={{
              backgroundColor: isFavorited ? "#fee2e2" : "rgba(255,255,255,0.8)",
              color: isFavorited ? "red" : "inherit",
            }}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isFavorited ? "red" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <div className="mb-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors">
            {product.category}
          </div>
          <h3 className="mb-2 text-sm font-semibold text-gray-900">{product.name}</h3>
          <div className="mb-1 flex items-center">
            <div className="mr-1 flex text-yellow-400 text-sm">
              {Array.from({ length: 5 }).map((_, idx) => {
                const rate = product.rate;
                if (rate >= idx + 1) {
                  return <i key={idx} className="bx bxs-star"></i>;
                } else if (rate >= idx + 0.5) {
                  return <i key={idx} className="bx bxs-star-half"></i>;
                }
                return <i key={idx} className="bx bx-star"></i>;
              })}
            </div>
            <p className="text-sm text-gray-500">{product.rate.toFixed(1)}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {product.discount > 0 ? (
                <>
                  <span className="text-sm font-bold text-gray-900">
                    ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
                  </span>
                  <span className="ml-2 text-[11px] text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                to={`/products/${product.id}`}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                View
              </Link>
              <button
                onClick={() => addToCart(product.id, 1)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <i className="bx bx-cart"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListCard;
