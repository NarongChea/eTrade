import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import {
  FaUser,
  FaEnvelope,
  FaReceipt,
  FaChevronDown,
  FaChevronUp,
  FaCrown,
  FaCog,
} from "react-icons/fa";

const CustomerManagement = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, productRes] = await Promise.all([
          fetch("http://localhost:3000/users"),
          fetch("http://localhost:3000/products"),
        ]);
        const userData = await userRes.json();
        const productData = await productRes.json();
        setUsers(userData);
        setProducts(productData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  let visibleUsers = [];
  if (currentUser?.role === "superAdmin") {
    visibleUsers = users;
  } else if (currentUser?.role === "admin") {
    visibleUsers = users.filter((u) => u.role !== "superAdmin");
  } else {
    visibleUsers = users.filter((u) => u.id === currentUser?.id);
  }

  const groupedUsers = {
    superAdmin: visibleUsers.filter((u) => u.role === "superAdmin"),
    admin: visibleUsers.filter((u) => u.role === "admin"),
    customer: visibleUsers.filter((u) => u.role === "customer"),
  };

  const toggleExpand = (userId) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  return (
    <div className="p-6 sm:p-10 bg-gradient-to-br from-blue-50 to-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Customer Management</h1>
      {loading && <p className="text-blue-600">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {["superAdmin", "admin", "customer"].map((role) => {
        const hasOrders = groupedUsers[role]?.some((u) => u.orders?.length > 0);
        return groupedUsers[role]?.length ? (
          <UserSection
            key={role}
            title={role[0].toUpperCase() + role.slice(1) + "s"}
            users={groupedUsers[role]}
            expandedUserId={expandedUserId}
            toggleExpand={toggleExpand}
            products={products}
            role={role}
            hasOrders={hasOrders}
          />
        ) : null;
      })}
    </div>
  );
};

const getRoleIcon = (role) => {
  switch (role) {
    case "superAdmin":
      return <FaCrown className="text-yellow-500 text-lg" title="Super Admin" />;
    case "admin":
      return <FaCog className="text-black text-lg" title="Admin" />;
    default:
      return <FaUser className="text-blue-500 text-lg" title="Customer" />;
  }
};

const UserSection = ({
  title,
  users,
  expandedUserId,
  toggleExpand,
  products,
  role,
  hasOrders,
}) => (
  <section className="mb-10">
    <h2 className="text-2xl font-semibold text-blue-700 mb-4">{title}</h2>
    {!hasOrders && (
      <p className="text-gray-500 italic mb-6">No {role} order history yet...</p>
    )}
    <div className="space-y-5">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-5 border border-gray-200"
        >
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-lg font-bold text-gray-700 flex items-center gap-2">
                {getRoleIcon(user.role)} {user.username}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" /> {user.email}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FaReceipt className="text-gray-400" />
                Orders: {user.orders?.length ?? 0}
              </p>
            </div>
            <button
              onClick={() => toggleExpand(user.id)}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              {expandedUserId === user.id ? <FaChevronUp /> : <FaChevronDown />}
              {expandedUserId === user.id ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {expandedUserId === user.id && (
            <UserDetails user={user} products={products} />
          )}
        </div>
      ))}
    </div>
  </section>
);

const UserDetails = ({ user, products }) => (
  <div className="mt-4 border-t pt-4 text-sm text-gray-800 space-y-6">
    <div>
      <h3 className="font-semibold mb-2 text-gray-700 text-base">Order History</h3>
      {user.orders?.length > 0 ? (
        <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
          {user.orders.map((order) => (
            <div key={order.id} className="border rounded-md p-4 bg-gray-50 shadow-sm">
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)}</p>

              <table className="w-full mt-3 border border-gray-300 text-left text-sm">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => {
                    const product = products.find((p) => p.id === item.id);
                    const name = product?.name || `Product #${item.id}`;
                    const price = product?.price || 0;
                    const total = price * item.quantity;

                    return (
                      <tr key={idx} className="border-t">
                        <td className="p-2 border">{name}</td>
                        <td className="p-2 border text-center">{item.quantity}</td>
                        <td className="p-2 border">${price.toFixed(2)}</td>
                        <td className="p-2 border">${total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No orders found for this user.</p>
      )}
    </div>
  </div>
);

export default CustomerManagement;
