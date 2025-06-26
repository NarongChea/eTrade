import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartListProduct from "../components/CartListProduct";
import { CartContext } from "../context/CartProvider";
import { ProductsCon } from "../context/ProductsContext";
import { AuthContext } from "../context/AuthProvider";

const Cart = () => {
  const { carts, totalItems, totalPrice, totalAmount, setCarts,fetchCartItems } = useContext(CartContext);
  const { allProducts } = useContext(ProductsCon);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = currentUser?.id;
const navigate = useNavigate();
  const cartItemsWithDetails = (carts || [])
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  const handleCheckout = async () => {
    if (!userId || carts.length === 0) return;
    setLoading(true);

    try {
      const resUser = await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`);
      if (!resUser.ok) throw new Error("Failed to fetch user");

      const userData = await resUser.json();
      const newOrder = {
        id: Date.now(),
        items: carts,
        totalAmount,
        date: new Date().toISOString(),
      };

      const updatedOrders = userData.orders ? [...userData.orders, newOrder] : [newOrder];
      const updatedUser = {
        ...userData,
        cart: [],
        orders: updatedOrders,
      };

      const resUpdate = await fetch(`https://json-server-api-y6cs.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!resUpdate.ok) throw new Error("Failed to update user data");

      setCarts([]);
      setOrderReceipt(newOrder);
      setCurrentUser(updatedUser);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto mb-8">
      <div className="flex items-center gap-4 my-8">
        <Link to="/products">
          <button className="inline-flex items-center justify-center gap-2 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3">
            <i className="bx bx-arrow-back"></i> Continue Shopping
          </button>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Shopping Carts</h1>
      </div>

      {!orderReceipt ? (
        <div className="grid lg:grid-cols-3 gap-8 min-h-[48.7vh] ">
          <div className="lg:col-span-2">
            {totalItems ? (
              <div className="rounded-lg border bg-white shadow-sm min-h-[200px]">
                <div className="p-6 border-b">
                  <div className="text-xl font-semibold">
                    Cart Items ({totalItems})
                  </div>
                </div>
                <div>
                  <div className="divide-y divide-gray-200">
                    {cartItemsWithDetails.map((item) => (
                      <CartListProduct key={item.id} cart={item} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border bg-white text-gray-600 shadow-sm rounded-lg min-h-[200px] py-10">
                <i className="bx bx-cart text-6xl mb-4 text-gray-400"></i>
                <p className="text-lg font-semibold">Your cart is empty</p>
                <p className="text-sm text-gray-500">Looks like you haven’t added anything yet.</p>
                <Link
                  to="/products"
                  className="mt-4 px-5 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Go Shopping
                </Link>
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-16 rounded-lg border bg-white shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                {totalAmount !== totalPrice && (
                  <div className="flex justify-between text-blue-600 font-medium">
                    <span>Discount</span>
                    <span>
                      -${(totalPrice - totalAmount).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-4 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-md font-medium transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-2xl mx-auto mt-10 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-700">Invoice</h1>
              <p className="text-sm text-gray-500">Thanks for your order!</p>
            </div>
            <span className="text-sm text-gray-500">
              #{orderReceipt.id}
            </span>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <p><strong>Date:</strong> {new Date(orderReceipt.date).toLocaleString()}</p>
            <p><strong>Customer:</strong> {currentUser?.username || "Guest"}</p>
            <p><strong>Email:</strong> {currentUser?.email || "N/A"}</p>
          </div>

          <div className="border-t border-b py-4 my-6">
            <h2 className="text-lg font-semibold mb-3">Purchased Items</h2>
            <ul className="space-y-2">
              {orderReceipt.items.map((item) => {
                const product = allProducts.find((p) => p.id === item.id);
                return (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>{product?.name || "Product"} x {item.quantity}</span>
                    <span>${(product?.price * item.quantity).toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex justify-between text-lg font-bold text-gray-800">
            <span>Total Paid:</span>
            <span>${orderReceipt.totalAmount.toFixed(2)}</span>
          </div>

          
          <button
            onClick={async () => {
              setOrderReceipt(null);
              await fetchCartItems();
            }}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
