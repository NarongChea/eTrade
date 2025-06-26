import React from "react";
import {
  Home,
  Clock,
  Box,
  Gift,
  Warehouse,
  ShoppingBag,
  BarChart,
  User,
  Mail,
  Sliders,
} from "lucide-react";
import { Outlet, Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: Home },
  { label: "Analytics", icon: Clock },
  { label: "Products", icon: Box },
  { label: "Offers", icon: Gift },
  { label: "Inventory", icon: Warehouse },
  { label: "Orders", icon: ShoppingBag },
  { label: "Customer", icon: User },
  { label: "Settings", icon: Sliders },
];

// Helper to convert label to url-friendly path segment
const toPath = (label) => label.toLowerCase().replace(/\s+/g, "-");

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="grid grid-cols-[250px_1fr] gap-4">
      <aside className="w-[250px] min-h-screen bg-[#f4f8f7] px-4 py-6 shadow-sm border-r">
        <ul className="space-y-1  sticky top-20 ">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            // Special case Dashboard path to /dashboard exactly
            const path =
              item.label === "Dashboard"
                ? "/dashboard"
                : "/dashboard/" + toPath(item.label);

            // Active if current path equals this path
            const isActive = location.pathname === path;

            return (
              <li key={index}>
                <Link
                  to={path}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition
                    ${
                      isActive
                        ? "bg-[#a0f0d0] text-[#0f3b2e]"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
