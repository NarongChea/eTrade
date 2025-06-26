// src/context/OffersProvider.jsx
import React, { createContext, useState, useEffect } from "react";

export const OffersContext = createContext();

export const OffersProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/offers")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setOffers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch offers:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <OffersContext.Provider value={{ offers, loading, error }}>
      {children}
    </OffersContext.Provider>
  );
};
