import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { CartContext } from "../context/CartProvider";
import { ProductsCon } from "../context/ProductsContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated, logout, role } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const { handleSearch } = useContext(ProductsCon);
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/products") {
      handleSearch("");
    }
    setMenuOpen(false); // Close menu on route change
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 left-0 z-50 bg-white shadow-md border-b border-gray-200">
      {/* Navbar container */}
      <div className="max-w-[1500px] mx-auto px-4 py-3 flex items-center justify-between">

        {/* Hamburger icon (mobile) */}
        <button
          onClick={() => setMenuOpen(true)}
          className="text-2xl text-gray-700 sm:hidden"
        >
          <FaBars />
        </button>

        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">
          <Link to="/">eTrade</Link>
        </div>

        {/* Nav links (desktop) */}
        <ul className="hidden sm:flex gap-6 text-sm text-gray-700">
          <li>
            <Link to="/" className="hover:text-blue-600">Home</Link>
          </li>
          <li>
            <Link to={isAuthenticated ? "/products" : "/login"} className="hover:text-blue-600">Products</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-600">About</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          </li>
        </ul>

        {/* Right section (icons + search) */}
        <div className="flex items-center gap-4">
          {/* Search (desktop only) */}
          <form className="hidden sm:block">
            <Link to={isAuthenticated ? "/products" : "/login"}>
              <input
                autoComplete="off"
                type="text"
                placeholder="Search..."
                onChange={(e) => handleSearch(e.target.value)}
                className="border border-gray-300 rounded-sm outline-none focus:outline-blue-500 px-2 py-[6px] text-sm w-[220px] md:w-[280px]"
              />
            </Link>
          </form>

          {/* Authenticated icons */}
          {isAuthenticated ? (
            <>
              <Link to="/favorite" className="text-gray-700 text-xl hover:text-blue-600">
                <i className="bx bx-heart"></i>
              </Link>
              <Link to="/cart" className="relative text-gray-700 text-xl hover:text-blue-600">
                <i className="bx bx-cart"></i>
                {totalItems > 0 && (
                  <span className="absolute top-[-4px] right-[-6px] bg-black text-white text-[10px] rounded-full px-[5px]">
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link to={role === "customer" ? "/authorprofile" : "/dashboard"} className="text-gray-700 text-xl hover:text-blue-600">
                <i className="bx bx-user"></i>
              </Link>
              <button onClick={logout} className="text-gray-700 text-xl hover:text-blue-600">
                <i className="bx bx-log-out"></i>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-sm text-gray-700 hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-md`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">eTrade</h1>
          <button onClick={() => setMenuOpen(false)} className="text-2xl text-gray-700">
            <FaTimes />
          </button>
        </div>

        {/* Sidebar links */}
        <ul className="flex flex-col text-sm text-gray-700 px-4 py-6 gap-3">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-600">Home</Link>
          </li>
          <li>
            <Link to={isAuthenticated ? "/products" : "/login"} onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-600">Products</Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-600">About</Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-600">Contact</Link>
          </li>
          <li className="pt-4 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <Link to="/favorite" onClick={() => setMenuOpen(false)} className="block py-2">
                  <i className="bx bx-heart mr-2" /> Favorites
                </Link>
                <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-2">
                  <i className="bx bx-cart mr-2" /> Cart ({totalItems})
                </Link>
                <Link to={role === "customer" ? "/authorprofile" : "/dashboard"} onClick={() => setMenuOpen(false)} className="block py-2">
                  <i className="bx bx-user mr-2" /> Profile
                </Link>
                <button onClick={logout} className="block py-2 text-left w-full">
                  <i className="bx bx-log-out mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2">Register</Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
