// src/pages/Inventory.jsx
import React, { useContext, useState, useMemo, useEffect } from "react";
import { ProductsCon } from "../context/ProductsContext";

const Inventory = () => {
  const {
    allProducts: initialProducts,
    categories,
    addProductToBackend,
    deleteProductFromBackend,
  } = useContext(ProductsCon);

  const [products, setProducts] = useState([]);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: categories?.[0] || "",
    price: "",
    images: ["", "", "", ""],
    stock: "",
    rate: "",
    discount: "",
  });

  useEffect(() => {
    if (categories?.length && !newProduct.category) {
      setNewProduct((prev) => ({ ...prev, category: categories[0] }));
    }
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter((product) => {
      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, categoryFilter]);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockThreshold = 10;
  const lowStockCount = products.filter(
    (p) => (p.stock || 0) <= lowStockThreshold
  ).length;

  const startEdit = (product) => {
    setEditId(product.id);
    setEditData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: (product.stock || 0).toString(),
    });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: editData.name,
              category: editData.category,
              price: parseFloat(editData.price),
              stock: parseInt(editData.stock, 10),
            }
          : p
      )
    );
    setEditId(null);
    setEditData({});
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const removeProduct = async (id) => {
    await deleteProductFromBackend(id);
    setConfirmRemoveId(null);
  };

  const handleNewProductChange = (field, value, index = null) => {
    if (field === "images" && index !== null) {
      const newImages = [...newProduct.images];
      newImages[index] = value;
      setNewProduct((prev) => ({ ...prev, images: newImages }));
    } else {
      setNewProduct((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addProduct = async () => {
    const {
      name,
      description,
      category,
      price,
      images,
      stock,
      rate,
      discount,
    } = newProduct;

    if (
      !name.trim() ||
      !description.trim() ||
      !category ||
      !price ||
      !stock ||
      !rate ||
      !discount
    ) {
      alert("Please fill all fields");
      return;
    }

    const productToAdd = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      images: images.filter((url) => url.trim().length > 0),
      stock: parseInt(stock, 10),
      rate: parseFloat(rate),
      discount: parseFloat(discount),
    };

    try {
      await addProductToBackend(productToAdd);
      setShowAddModal(false);
      setNewProduct({
        name: "",
        description: "",
        category: categories?.[0] || "",
        price: "",
        images: ["", "", "", ""],
        stock: "",
        rate: "",
        discount: "",
      });
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Inventory Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <p className="text-sm font-semibold text-gray-500">Total Products</p>
          <p className="text-4xl font-bold text-blue-700 mt-2">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <p className="text-sm font-semibold text-gray-500">Total Stock</p>
          <p className="text-4xl font-bold text-green-700 mt-2">{totalStock}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <p className="text-sm font-semibold text-gray-500">Low Stock (≤ {lowStockThreshold})</p>
          <p className="text-4xl font-bold text-red-700 mt-2">{lowStockCount}</p>
        </div>
      </div>

      {/* Filter & Add */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="border px-4 py-2 rounded shadow-sm flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded shadow-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg shadow bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr className="text-left text-sm font-semibold text-gray-700 border-b">
              <th className="px-4 py-3 text-center">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const isEditing = editId === p.id;
              const isLowStock = (p.stock || 0) <= lowStockThreshold;

              return (
                <tr
                  key={p.id}
                  className={`border-b ${isLowStock ? "bg-red-50" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-2 text-center">{p.id}</td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        value={editData.name}
                        onChange={(e) => handleEditChange("name", e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      p.name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <select
                        value={editData.category}
                        onChange={(e) => handleEditChange("category", e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    ) : (
                      p.category
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {isEditing ? (
                      <input
                        value={editData.price}
                        type="number"
                        onChange={(e) => handleEditChange("price", e.target.value)}
                        className="border px-2 py-1 rounded w-full text-right"
                      />
                    ) : (
                      `$${p.price.toFixed(2)}`
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {isEditing ? (
                      <input
                        value={editData.stock}
                        type="number"
                        onChange={(e) => handleEditChange("stock", e.target.value)}
                        className="border px-2 py-1 rounded w-full text-right"
                      />
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {isLowStock ? (
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(p.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(p)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmRemoveId(p.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {confirmRemoveId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setConfirmRemoveId(null)}
        >
          <div
            className="bg-white p-6 rounded shadow-md max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to remove this product?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmRemoveId(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => removeProduct(confirmRemoveId)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
    onClick={() => setShowAddModal(false)}
  >
    <div
      className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ❌ Close Button */}
      <button
        onClick={() => setShowAddModal(false)}
        className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-xl font-bold"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      <div className="grid grid-cols-1 gap-4">
        <input
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => handleNewProductChange("name", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => handleNewProductChange("description", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={newProduct.category}
          onChange={(e) => handleNewProductChange("category", e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) => handleNewProductChange("price", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Stock"
          type="number"
          value={newProduct.stock}
          onChange={(e) => handleNewProductChange("stock", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Rating"
          type="number"
          value={newProduct.rate}
          onChange={(e) => handleNewProductChange("rate", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Discount"
          type="number"
          value={newProduct.discount}
          onChange={(e) => handleNewProductChange("discount", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            placeholder={`Image URL ${i + 1}`}
            value={newProduct.images[i]}
            onChange={(e) =>
              handleNewProductChange("images", e.target.value, i)
            }
            className="border px-3 py-2 rounded"
          />
        ))}
        <button
          onClick={addProduct}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Product
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Inventory;
