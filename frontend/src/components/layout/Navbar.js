import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-brand-700 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="text-xl font-bold tracking-wide hover:opacity-90 flex items-center gap-2"
          >
            🎓 Gymkhana Portal
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              /* Authenticated nav */
              <>
                <DesktopLink to="/dashboard">Dashboard</DesktopLink>
                <DesktopLink to="/events">Events</DesktopLink>
                <DesktopLink to="/clubs">Clubs</DesktopLink>
                <DesktopLink to="/profile">Profile</DesktopLink>
              </>
            ) : (
              /* Public nav */
              <>
                <DesktopLink to="/">Home</DesktopLink>
                <DesktopLink to="/events">Events</DesktopLink>
              </>
            )}
          </div>

          {/* Right Side Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-brand-200">
                  Hi, {user?.name || user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-brand-600 hover:bg-brand-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-brand-100 hover:text-white font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-white text-brand-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Hamburger – Mobile */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-brand-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-800 px-4 pb-4 space-y-1">
          {isAuthenticated ? (
            <>
              <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
              <MobileLink to="/events"    onClick={() => setMenuOpen(false)}>Events</MobileLink>
              <MobileLink to="/clubs"     onClick={() => setMenuOpen(false)}>Clubs</MobileLink>
              <MobileLink to="/profile"   onClick={() => setMenuOpen(false)}>Profile</MobileLink>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="block w-full text-left text-sm text-red-300 py-2 hover:text-red-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileLink to="/"         onClick={() => setMenuOpen(false)}>Home</MobileLink>
              <MobileLink to="/events"   onClick={() => setMenuOpen(false)}>Events</MobileLink>
              <MobileLink to="/login"    onClick={() => setMenuOpen(false)}>Login</MobileLink>
              <MobileLink to="/register" onClick={() => setMenuOpen(false)}>Register</MobileLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

/* Helper sub-components */
const DesktopLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-sm font-medium transition-colors ${
        isActive ? "text-white" : "text-brand-100 hover:text-white"
      }`
    }
  >
    {children}
  </NavLink>
);

const MobileLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-sm text-brand-100 hover:text-white py-2 transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;
