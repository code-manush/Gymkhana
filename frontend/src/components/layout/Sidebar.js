import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "📊 Dashboard" },
  { to: "/events",    label: "🗓️ Events" },
  { to: "/clubs",     label: "🏛️ Clubs" },
  { to: "/profile",  label: "👤 Profile" },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-200 py-6 px-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
        Navigation
      </p>
      <nav className="flex flex-col space-y-1">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
