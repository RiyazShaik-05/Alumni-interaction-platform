import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Logout } from "../index";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const navLinks = !isAuthenticated
    ? [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Contact", path: "/contact" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Jobs/Internships", path: "/jobs" },
        { name: "Events", path: "/events" },
        { name: "Search Users", path: "/search-users" },
      ];

  const navLinkStyles = ({ isActive }) =>
    `text-base ${
      isActive
        ? "text-blue-500 font-semibold"
        : "text-gray-500 hover:text-blue-500"
    } transition-colors`;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-blue-600">ConnectEd</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={navLinkStyles}
                end
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Auth Button (Desktop) */}
          <div className="hidden md:flex">
            {isAuthenticated ? (
              <Logout />
            ) : (
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none transition-transform cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link, index) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transform transition-all duration-300 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                } ${
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-2 opacity-0"
                }`
              }
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setIsMenuOpen(false)}
              end
            >
              {link.name}
            </NavLink>
          ))}

          {/* Auth Button (Mobile) */}
          <div
            className={`mt-2 transition-all transform ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0"
            }`}
          >
            {isAuthenticated ? (
              <Logout />
            ) : (
              <button
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
                onClick={() => navigate("/login")}
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
