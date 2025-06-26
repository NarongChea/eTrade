// src/pages/OffersDashboard.jsx
import React, { useContext, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { OffersContext } from "../context/OffersContext";

const OffersDashboard = () => {
  const { offers, loading, error } = useContext(OffersContext);

  // Calculate counts by status
  const activeCount = offers.filter((o) => o.status === "active").length;
  const expiredCount = offers.filter((o) => o.status === "expired").length;
  const upcomingCount = offers.filter((o) => o.status === "upcoming").length;

  // Offers grouped by category (for chart)
  const offersByCategory = useMemo(() => {
    const counts = {};
    offers.forEach((o) => {
      counts[o.category] = (counts[o.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [offers]);

  if (loading) return <div className="p-8 text-center">Loading offers...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-600">
        Error loading offers: {error}
      </div>
    );

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-8 remove-scroll">
      <h1 className="text-3xl font-bold mb-8 text-gray-700">Offers Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-sm font-semibold text-gray-500">Active Offers</p>
          <p className="text-4xl font-bold text-green-700 mt-2">{activeCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <p className="text-sm font-semibold text-gray-500">Expired Offers</p>
          <p className="text-4xl font-bold text-red-700 mt-2">{expiredCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <p className="text-sm font-semibold text-gray-500">Upcoming Offers</p>
          <p className="text-4xl font-bold text-yellow-700 mt-2">{upcomingCount}</p>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Current Offers</h2>
        <table className="w-full text-left text-gray-700">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-2">Title</th>
              <th className="py-3 px-2">Category</th>
              <th className="py-3 px-2">Discount</th>
              <th className="py-3 px-2">Start Date</th>
              <th className="py-3 px-2">End Date</th>
              <th className="py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr
                key={offer.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-2 font-medium">{offer.title}</td>
                <td className="py-3 px-2">{offer.category}</td>
                <td className="py-3 px-2 text-green-600 font-semibold">
                  {offer.discountPercent}%
                </td>
                <td className="py-3 px-2">{offer.startDate}</td>
                <td className="py-3 px-2">{offer.endDate}</td>
                <td
                  className={`py-3 px-2 font-semibold ${
                    offer.status === "active"
                      ? "text-green-600"
                      : offer.status === "expired"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Offers by Category Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Offers by Category
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={offersByCategory}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OffersDashboard;
