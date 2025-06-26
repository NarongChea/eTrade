import React, { useContext, useEffect, useState } from 'react';
import { ProductsCon } from '../context/ProductsContext';
import ProductListCard from '../Components/ProductListCard';
import { useSearchParams } from 'react-router-dom';

const Products = () => {
  const {
    category,
    product,
    setSortValue,
    setCategoryValue,
    setRateValue,
    setPriceValue,
    rateValue,
    priceValue,
    searchQuery,
    clearSearch,
  } = useContext(ProductsCon);

  const [showStyle, setShowStyle] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();

  const productsPerPage = 9;

  const handleChange = (cate) => {
    const newCategory = selectedCategory === cate ? "" : cate;
    setSelectedCategory(newCategory);
    setCategoryValue(newCategory);
  };

  useEffect(() => {
    const cateFromURL = searchParams.get("category");
    if (cateFromURL) {
      const realCat = cateFromURL.replace(/_/g, " ");
      setSelectedCategory(realCat);
      setCategoryValue(realCat);
    } else {
      setSelectedCategory("");
      setCategoryValue("");
    }
    setPriceValue(0);
    setRateValue(0);
  }, [searchParams]);

  const handlePriceChange = (value) => {
    const newVal = priceValue === value ? 0 : value;
    setPriceValue(newVal);
  };

  const handleRateChange = (value) => {
    const newVal = rateValue === value ? 0 : value;
    setRateValue(newVal);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rateValue, priceValue, selectedCategory, product]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-5 gap-5 py-8">

          {/* Sidebar Filters */}
          <div className="md:col-span-1 col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md border sticky top-5">
              <h2 className="flex items-center gap-2 text-[16px] text-gray-700 mb-4">
                <i className="bx bx-filter-alt"></i> Filter
              </h2>

              {/* Category */}
              <div>
                <p className="text-sm font-medium mb-3">Category</p>
                <div className="flex flex-col gap-2">
                  {category.map((cate) => (
                    <label key={cate.cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 checked:bg-black"
                        onChange={() => handleChange(cate.cat)}
                        checked={selectedCategory === cate.cat}
                        name="category"
                      />
                      <span className="font-medium text-xs select-none">{cate.cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mt-6">
                <p className="text-sm font-medium mb-3">Price</p>
                {[1, 2, 3, 4, 5].map((val) => {
                  const labels = [
                    "Under 50$",
                    "50$ - 250$",
                    "250$ - 500$",
                    "500$ - 750$",
                    "Over 750$",
                  ];
                  return (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 mb-1 checked:bg-black"
                        onChange={() => handlePriceChange(val)}
                        checked={priceValue === val}
                      />
                      <span className="font-medium text-xs select-none">{labels[val - 1]}</span>
                    </label>
                  );
                })}
              </div>

              {/* Rate */}
              <div className="mt-6">
                <p className="text-sm font-medium mb-3">Rate</p>
                {[4, 3, 2, 1].map((val) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={() => handleRateChange(val)}
                      checked={rateValue === val}
                      className="w-4 h-4 mb-1"
                    />
                    <span className="font-medium text-xs flex items-center select-none">
                      {[...Array(val)].map((_, i) => (
                        <i
                          key={i}
                          className="bx bxs-star text-[11px] text-yellow-500"
                        />
                      ))}
                      <span className="text-[11px] ml-1">& Up</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="md:col-span-4 col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : "All Products"}
                </h1>
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  {Math.min(productsPerPage * currentPage, product?.length || 0)}{" "}
                  of {product?.length || 0} results
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="text-sm text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1"
                  >
                    <i className="bx bx-x text-lg"></i> Clear search
                  </button>
                )}
              </div>

              {/* Sort & Layout Buttons */}
              <div className="flex items-center gap-4 ">
                <select
                  onChange={(e) => setSortValue(e.target.value)}
                  className="border border-gray-300 px-3 py-2 text-xs rounded-md"
                >
                  <option value="">Sort by: Price: Default</option>
                  <option value="_sort=price">Price: Low to High</option>
                  <option value="_sort=-price">Price: High to Low</option>
                </select>

                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowStyle("grid")}
                    className={`px-3 py-2 ${showStyle === "grid" ? "bg-black text-white" : "text-black"} ` }
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setShowStyle("list")}
                    className={`px-3 py-2 ${showStyle === "list" ? "bg-black text-white" : "text-black"} `}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards */}
            <div
              className={`grid ${
                showStyle === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              } gap-6`}
            >
              {product && product.length > 0 ? (
                product
                  .slice(
                    (currentPage - 1) * productsPerPage,
                    currentPage * productsPerPage
                  )
                  .map((prod) => (
                    <ProductListCard
                      key={prod.id}
                      product={prod}
                      showStyle={showStyle}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    <i className="bx bx-search text-6xl mb-4"></i>
                    <h3 className="text-xl font-medium mb-2">
                      {searchQuery
                        ? `No products found for "${searchQuery}"`
                        : "No products available"}
                    </h3>
                    <p className="text-sm">
                      {searchQuery
                        ? "Try adjusting your search terms or browse all products"
                        : "Please check back later"}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Browse All Products
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {product && product.length > productsPerPage && (
              <div className="flex justify-center items-center gap-7 mt-10">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`bg-white border px-4 py-2 rounded-md text-sm ${
                    currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Previous
                </button>

                <button
                  disabled={currentPage >= Math.ceil(product.length / productsPerPage)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`bg-white border px-4 py-2 rounded-md text-sm ${
                    currentPage >= Math.ceil(product.length / productsPerPage)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
