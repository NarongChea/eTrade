import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.jsx";
import ProductsContext from "./context/ProductsContext.jsx";
import CartProvider from "./context/CartProvider.jsx";
import FavoriteProvider from "./context/FavoriteProvider.jsx";
import { OffersProvider } from "./context/OffersContext.jsx";
import React from "react";

createRoot(document.getElementById("root")).render(
<React.StrictMode>
    <BrowserRouter basename="/etrades/">
      <OffersProvider>
        <AuthProvider>
          <FavoriteProvider>
            <ProductsContext>
              <CartProvider>
                <App />
              </CartProvider>
            </ProductsContext>
          </FavoriteProvider>
        </AuthProvider>
      </OffersProvider>
    </BrowserRouter>
  </React.StrictMode>
);
