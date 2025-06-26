import React, { useEffect } from "react";
import HeroSection from "../Components/HeroSection";
import ProductsSection from "../Components/ProductSection";
import Cartegory from "../Components/Cartegory";

const Home = () => {
  useEffect(() => {
    localStorage.setItem("selectedCategory", "");
  },[])
  return (
    <div>
      <HeroSection/>
      <Cartegory/>
      <ProductsSection/>
    </div>
  );
};

export default Home;
