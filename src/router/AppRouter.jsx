import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Error404 from "../pages/Error404";
import Products from "../pages/Products";
import About from "../pages/About";
import Contact from "../pages/Contact";
import AuthorProfile from "../pages/AuthourProfile";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Favorite from "../pages/Favorite";
import Dashboard from "../Components/Dashboard";
import HomeDashboard from "../pages/HomeDashboard";
import Analytics from "../pages/Analytics";
import ProductDashboard from "../pages/ProductDashboard";
import OfferDashboard from "../pages/OfferDashboard";
import Inventory from "../pages/Inventory";
import DashboardOrder from "../pages/DashboardOrder";
import CustomerManagement from "../pages/CustomerManagement";
import SettingsUserManagement from "../pages/SettingsUserManagement";


const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/authorprofile" element={<AuthorProfile />} />
        <Route path="/dashboard" element={<Dashboard />} >
          <Route path="" element={<HomeDashboard/>}/>
          <Route path="analytics" element={<Analytics/>}/>
          <Route path="products" element={<ProductDashboard/>}/>
          <Route path="offers" element={<OfferDashboard/>}/>
          <Route path="inventory" element={<Inventory/>}/>
          <Route path="orders" element={<DashboardOrder/>}/>
          <Route path="customer" element={<CustomerManagement/>}/>
          <Route path="settings" element={<SettingsUserManagement/>}/>
        </Route>
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default AppRouter;
