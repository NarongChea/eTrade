import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { ProductsCon } from "../context/ProductsContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7"];

const DashboardHome = () => {
  const { currentUser } = useContext(AuthContext);
  const { allProducts } = useContext(ProductsCon);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
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

  useEffect(() => {
    if (!orders.length || !allProducts.length) return;

    // Count quantities for each product ID
    const productSales = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
      });
    });

    // Top products with details
    const topSold = Object.entries(productSales)
      .map(([id, qty]) => {
        const product = allProducts.find((p) => p.id === id);
        return product ? { name: product.name, quantity: qty } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setTopProducts(topSold);

    // Category distribution
    const categoryMap = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const product = allProducts.find((p) => p.id === item.id);
        if (product) {
          categoryMap[product.category] =
            (categoryMap[product.category] || 0) + item.quantity;
        }
      });
    });

    const categoryList = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));

    setCategoryData(categoryList);
  }, [orders, allProducts]);

  const totalUsers = users.length;
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const sales = orders.reduce((sum, o) => sum + (o.items?.length || 0), 0);

  const stats = [
    { title: "Total Users", value: totalUsers, color: "bg-blue-100", text: "text-blue-600" },
    { title: "Total Orders", value: totalOrders, color: "bg-green-100", text: "text-green-600" },
    { title: "Revenue", value: `$${revenue.toFixed(2)}`, color: "bg-yellow-100", text: "text-yellow-600" },
    { title: "Sales", value: sales, color: "bg-purple-100", text: "text-purple-600" },
  ];

  const recentOrders = [...orders].slice(-5).reverse();

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`p-5 rounded-xl shadow-md ${stat.color} ${stat.text}`}>
            <p className="text-sm font-medium">{stat.title}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Orders</h2>
        <table className="w-full text-left">
          <thead className="text-gray-500 text-sm border-b">
            <tr>
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2">Total</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b last:border-0 text-sm text-gray-600">
                <td className="py-3">#{order.id}</td>
                <td>{order.username || "Unknown"}</td>
                <td>${(order.totalAmount || 0).toFixed(2)}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sales Overview */}
      <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Category Sales */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales by Category</h2>
          {categoryData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400 h-72 flex items-center justify-center">No data</div>
          )}
        </div>

        {/* Top Products List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Top Selling Products</h2>
          <ul className="space-y-3 text-gray-700 text-sm">
            {topProducts.map((p, i) => (
              <li key={i} className="flex justify-between border-b pb-2">
                <span>{p.name}</span>
                <span className="font-medium">{p.quantity} sold</span>
              </li>
            ))}
            {!topProducts.length && <li className="text-gray-400">No product sales yet</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
