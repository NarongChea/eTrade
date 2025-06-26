import React, { useContext } from "react";
import { ProductsCon } from "../context/ProductsContext";

const ProductDashboard = () => {
  const { allProducts } = useContext(ProductsCon);

  if (!allProducts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }

  const totalProducts = allProducts.length;
  const totalStock = allProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
  const avgPrice =
    totalProducts > 0
      ? (
          allProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts
        ).toFixed(2)
      : 0;

  return (
    <div className="p-8 bg-gray-50 min-h-[100vh] flex flex-col">
      <h1 className="text-3xl font-bold mb-8 text-gray-700">Product Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm font-medium text-gray-500">Total Products</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm font-medium text-gray-500">Total Stock</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{totalStock}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm font-medium text-gray-500">Average Price</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">${avgPrice}</p>
        </div>
      </div>

      {/* Correctly aligned scrollable table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-y-auto" style={{ maxHeight: "65vh" }}>
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="border-b border-gray-300">
                <th className="py-3 px-4 text-gray-600 font-semibold">ID</th>
                <th className="py-3 px-4 text-gray-600 font-semibold">Name</th>
                <th className="py-3 px-4 text-gray-600 font-semibold">Category</th>
                <th className="py-3 px-4 text-gray-600 font-semibold">Price</th>
                <th className="py-3 px-4 text-gray-600 font-semibold">Stock</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{p.id}</td>
                  <td className="py-3 px-4">{p.name}</td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4">${p.price.toFixed(2)}</td>
                  <td className="py-3 px-4">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
