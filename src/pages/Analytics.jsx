import React, { useContext, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { ProductsCon } from "../context/ProductsContext";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#33AA66",
  "#8884d8",
];

const Analytics = () => {
  const { allProducts } = useContext(ProductsCon);

  // Category Distribution (Pie)
  const categoryDistribution = useMemo(() => {
    const counts = {};
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allProducts]);

  // Stock Quantity per Category (Bar)
  const stockByCategory = useMemo(() => {
    const stockMap = {};
    allProducts.forEach((p) => {
      stockMap[p.category] = (stockMap[p.category] || 0) + (p.stock || 0);
    });
    return Object.entries(stockMap).map(([name, value]) => ({ name, value }));
  }, [allProducts]);

  // Top 5 Expensive Products - No Y axis labels (no names shown)
  const topExpensive = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => b.price - a.price)
      .slice(0, 5)
      .map((p) => ({
        name: p.name, // Keep full name here for tooltip only
        price: p.price,
      }));
  }, [allProducts]);

  // Price Range Distribution (Pie)
  const priceRanges = useMemo(() => {
    const ranges = {
      "< $50": 0,
      "$50 - $250": 0,
      "$250 - $500": 0,
      "$500 - $750": 0,
      "> $750": 0,
    };
    allProducts.forEach((p) => {
      if (p.price < 50) ranges["< $50"]++;
      else if (p.price <= 250) ranges["$50 - $250"]++;
      else if (p.price <= 500) ranges["$250 - $500"]++;
      else if (p.price <= 750) ranges["$500 - $750"]++;
      else ranges["> $750"]++;
    });
    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, [allProducts]);

  return (
    <div className="p-8 bg-gray-50 min-h-[100vh] overflow-y-scroll">
      <h1 className="text-3xl font-bold mb-8 text-gray-700">Dashboard Analytics</h1>

      {/* Top Chart Row: Pie (30%) + Bar (70%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-8 mb-10">
        {/* Pie Chart: Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={false} // No labels on slices
              >
                {categoryDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                // Tooltip shows category name on hover
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Stock by Category */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Stock by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockByCategory}>
              {/* Show X axis names with rotation for clarity */}
              <XAxis
                dataKey="name"
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#36B37E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Chart Row: Expensive Products + Price Range */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Horizontal Bar: Top Expensive Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Top 5 Expensive Products
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={topExpensive} margin={{ left: 40 }}>
              <XAxis type="number" />
              {/* Hide Y axis labels */}
              <YAxis type="category" dataKey="name" hide />
              <Tooltip
                formatter={(value, name, props) => [
                  `$${value.toFixed(2)}`,
                  props.payload.name,
                ]}
              />
              <Bar dataKey="price" fill="#FF6F61" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Price Range */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Price Range Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priceRanges}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={false} // No labels on slices
              >
                {priceRanges.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
