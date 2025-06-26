import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider"; // ✅ Import AuthContext

export const FavoritesContext = createContext();

const FavoriteProvider = ({ children }) => {
  const userId = localStorage.getItem("id");
  const { isAuthenticated } = useContext(AuthContext); // ✅ Use isAuthenticated
  const [favorites, setFavorites] = useState([]);

  // Fetch user's favorite items from backend
  const fetchFavorites = async () => {
    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`);
      const user = await res.json();
      setFavorites(user.favorites || []);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  // Add a product to favorites
  const addToFavorites = async (product) => {
    const isExist = favorites.find((item) => item.id === product.id);
    if (isExist) return;

    const updatedFavorites = [...favorites, product];
    try {
      await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: updatedFavorites }),
      });
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Add to favorites failed:", error);
    }
  };

  // Remove a product from favorites
  const removeFavorite = async (productId) => {
    const updatedFavorites = favorites.filter((item) => item.id !== productId);
    try {
      await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: updatedFavorites }),
      });
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Remove from favorites failed:", error);
    }
  };

  // Toggle favorite (add if not exist, remove if exist)
  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // Check if a product is already favorited
  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  // ✅ Refetch favorites when user logs in or id changes
  useEffect(() => {
    if (userId && isAuthenticated) {
      fetchFavorites();
    }
  }, [userId, isAuthenticated]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoriteProvider;
