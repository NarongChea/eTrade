import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductsCon } from "./ProductsContext";

export const CartContext = createContext();
import { AuthContext } from "./AuthProvider";

const CartProvider = ({ children }) => {
  const { allProducts } = useContext(ProductsCon);
  const [carts, setCarts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
const { isAuthenticated } = useContext(AuthContext);
  const userId = localStorage.getItem("id");

  const fetchCartItems = async () => {
    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`);
      if (!res.ok) throw new Error("User not found");
      const user = await res.json();

      const cart = user.cart || [];
      setCarts(cart);

      setTotalItems(cart.reduce((acc, item) => acc + item.quantity, 0));

      setTotalPrice(
        cart.reduce((acc, item) => {
          const product = allProducts.find((p) => p.id === item.id);
          if (!product) return acc;
          return acc + product.price * item.quantity;
        }, 0)
      );

      setTotalAmount(
        cart.reduce((acc, item) => {
          const product = allProducts.find((p) => p.id === item.id);
          if (!product) return acc;
          const price = product.price;
          const discount = product.discount || 0;
          const priceAfterDiscount = price - (price * discount) / 100;
          return acc + priceAfterDiscount * item.quantity;
        }, 0)
      );
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const addToCart = async (productId, qty) => {
    try {
      const resUser = await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`);
      if (!resUser.ok) throw new Error("User fetch failed");
      const userData = await resUser.json();

      let updatedCart = [...(userData.cart || [])];
      const index = updatedCart.findIndex((item) => item.id === productId);

      if (index !== -1) {
        // Product exists → increase quantity
        updatedCart[index].quantity += qty;
      } else {
        // Add new item with only ID and quantity
        updatedCart.push({
          id: productId,
          quantity: qty,
        });
      }

      // Save updated cart to the user
      await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });

      fetchCartItems(); // Refresh UI totals
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const updateCartItem = async (productId, newQty) => {
    try {
      const resUser = await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`);
      const user = await resUser.json();
      let updatedCart = [...(user.cart || [])];

      const index = updatedCart.findIndex((item) => item.id === productId);
      if (index !== -1) {
        updatedCart[index].quantity = newQty;

        await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: updatedCart }),
        });

        fetchCartItems();
      }
    } catch (err) {
      console.error("Update cart failed:", err);
    }
  };

  const removeCartItem = async (productId) => {
    try {
      const resUser = await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`);
      const user = await resUser.json();
      const updatedCart = (user.cart || []).filter((item) => item.id !== productId);

      await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });

      fetchCartItems();
    } catch (err) {
      console.error("Remove cart item failed:", err);
    }
  };

useEffect(() => {
  if (allProducts.length && userId && isAuthenticated) {
    fetchCartItems();
  }
}, [allProducts, userId, isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        carts,
        totalItems,
        totalPrice,
        totalAmount,
        addToCart,
        removeCartItem,
        updateCartItem,
        setCarts,
        fetchCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
