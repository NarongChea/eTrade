import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { ProductsCon } from "../context/ProductsContext";

const DashboardOrders = () => {
  const { currentUser } = useContext(AuthContext);
  const { allProducts } = useContext(ProductsCon);

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Track which order's items are expanded (only one at a time)
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    // Fetch users and flatten their orders into one list with user info
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((usersData) => {
        setUsers(usersData);
        const allOrders = usersData.flatMap((user) =>
          (user.orders || []).map((order) => ({
            ...order,
            userId: user.id,
            username: user.username,
          }))
        );
        setOrders(allOrders);
      })
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  // Toggle expanded order: open if closed, close if open
  const toggleOrderItems = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Orders Dashboard</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100 border-b">
            <tr className="text-left text-gray-600 uppercase text-sm">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;

              return (
                <React.Fragment key={order.id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm">#{order.id}</td>
                    <td className="p-3">{order.username || "Unknown"}</td>
                    <td className="p-3 font-semibold">${order.totalAmount?.toFixed(2)}</td>
                    <td className="p-3">
                      {new Date(order.date).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleOrderItems(order.id)}
                        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        {isExpanded ? "Hide Items" : "Show Items"}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="p-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-gray-700 text-sm">
                            <thead>
                              <tr className="border-b border-gray-300">
                                <th className="py-2 px-3">Product Name</th>
                                <th className="py-2 px-3">Quantity</th>
                                <th className="py-2 px-3">Price</th>
                                <th className="py-2 px-3">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items?.map((item) => {
                                const product = allProducts.find(
                                  (p) => p.id === item.id
                                );
                                if (!product) return null;

                                const subtotal = product.price * item.quantity;

                                return (
                                  <tr key={item.id} className="border-b border-gray-200">
                                    <td className="py-2 px-3">{product.name}</td>
                                    <td className="py-2 px-3">{item.quantity}</td>
                                    <td className="py-2 px-3">${product.price.toFixed(2)}</td>
                                    <td className="py-2 px-3 font-semibold">${subtotal.toFixed(2)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardOrders;
