// src/context/ProductsContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const ProductsCon = createContext();

const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [product, setProducts] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [sortValue, setSortValue] = useState("");
  const [homeData, setHomeData] = useState([]);
  const [categoryValue, setCategoryValue] = useState("");
  const [priceValue, setPriceValue] = useState(0);
  const [rateValue, setRateValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategoryList] = useState([]);

  // ⬇️ Fetch from backend
  const fetchProduct = async () => {
    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/products?${sortValue}`);
      const data = await res.json();
      setAllProducts(data);
      setProducts(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchAllProduct = async () => {
    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/products`);
      const data = await res.json();
      setHomeData(data);
      generateCategoryList(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchProductDetail = async (id) => {
    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/products/${id}`);
      const data = await res.json();
      setProductDetail(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addProductToBackend = async (newProduct) => {
    try {
      const res = await fetch("https://json-server-api-y6cs.onrender.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      const added = await res.json();
      await fetchProduct(); // Refresh products after add
      return added;
    } catch (error) {
      console.error("Add product failed:", error);
      throw error;
    }
  };

  const deleteProductFromBackend = async (id) => {
    try {
      await fetch(`https://json-server-api-y6cs.onrender.com/products/${id}`, {
        method: "DELETE",
      });
      await fetchProduct(); // Refresh after delete
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filterProduct = () => {
    const filtered = allProducts.filter((product) => {
      const categoryMatch =
        !categoryValue || product.category === categoryValue;
      const rateMatch = product.rate >= rateValue;
      const priceMatch =
        priceValue === 0 ||
        (priceValue === 1 && product.price < 50) ||
        (priceValue === 2 && product.price >= 50 && product.price <= 250) ||
        (priceValue === 3 && product.price > 250 && product.price <= 500) ||
        (priceValue === 4 && product.price > 500 && product.price <= 750) ||
        (priceValue === 5 && product.price > 750);

      const searchMatch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && rateMatch && priceMatch && searchMatch;
    });

    setProducts(filtered);
  };

  const handleSearch = (query) => setSearchQuery(query);
  const clearSearch = () => setSearchQuery("");

  const generateCategoryList = (products) => {
    const catWithImg = [];
    products.forEach((item) => {
      const found = catWithImg.some((c) => c.cat === item.category);
      if (!found) {
        catWithImg.push({
          cat: item.category,
          photo: item.images[0],
        });
      }
    });
    setCategoryList(catWithImg);
  };

  const categories = allProducts
    ? [...new Set(allProducts.map((item) => item.category))]
    : [];

  useEffect(() => {
    fetchProduct();
  }, [sortValue]);

  useEffect(() => {
    fetchAllProduct();
  }, []);

  useEffect(() => {
    filterProduct();
  }, [allProducts, categoryValue, priceValue, rateValue, searchQuery]);

  return (
    <ProductsCon.Provider
      value={{
        homeData,
        allProducts,
        product,
        productDetail,
        fetchProductDetail,
        sortValue,
        setSortValue,
        categoryValue,
        setCategoryValue,
        priceValue,
        setPriceValue,
        rateValue,
        setRateValue,
        searchQuery,
        handleSearch,
        clearSearch,
        categories,
        category,
        addProductToBackend,
        deleteProductFromBackend,
      }}
    >
      {children}
    </ProductsCon.Provider>
  );
};

export default ProductProvider;
