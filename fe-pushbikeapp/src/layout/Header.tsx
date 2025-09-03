import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "@/assets/img/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const location = useLocation();

  const isLoginPage = location.pathname === "/admindashboard";

  const navItems = [
    { path: "/registrasi", label: "Registrasi" },
    { path: "/resultlist", label: "Hasil Live" },
    { path: "/tentangkami", label: "Tentang Kami" },
    { path: "/kontak", label: "Kontak" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 font-poppins bg-gradient-to-r from-base-dark/70 via-base-dark/50 to-base-dark/70 backdrop-blur-lg border-b border-card-dark shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src={logo} alt="PushBike Logo" className="h-14 w-auto" />
          <span className="font-bold text-textlight text-xl tracking-wide">
            PushBike Race
          </span>
        </Link>

        {/* Navbar Desktop */}
        {!isLoginPage && (
          <nav className="hidden md:flex">
            <ul className="flex space-x-8 text-textlight font-medium items-center">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <li key={item.path} className="relative">
                    <Link
                      to={item.path}
                      className={`pb-1 transition-all duration-300 ${
                        active
                          ? "text-accent"
                          : "text-textlight hover:text-accent/80"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {active && (
                      <span className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-[#00ADB5] shadow-[0_0_8px_rgba(0,173,181,0.8)] animate-pulse"></span>
                    )}
                  </li>
                );
              })}
              <li>
                <Link
                  to="/loginadmin"
                  onClick={toggleMenu}
                  className="block px-4 py-2 bg-[#00ADB5] text-[#EEEEEE] rounded-full text-center shadow-[0_0_12px_rgba(0,173,181,0.8)] hover:bg-[#00cfd8] hover:scale-105 transition-all duration-300"
                >
                  Login Admin
                </Link>
              </li>
            </ul>
          </nav>
        )}

        {/* Mobile Toggle */}
        {!isLoginPage && (
          <button
            onClick={toggleMenu}
            className="md:hidden text-2xl text-textlight focus:outline-none"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        )}
      </div>

      {/* Navbar Mobile */}
      {menuOpen && !isLoginPage && (
        <nav className="md:hidden bg-base-dark border-t border-card-dark shadow-lg transition-all duration-300">
          <ul className="flex flex-col space-y-4 p-6 text-textlight font-medium">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.path} className="relative">
                  <Link
                    to={item.path}
                    onClick={toggleMenu}
                    className={`block transition-all duration-300 ${
                      active
                        ? "text-accent"
                        : "text-textlight hover:text-accent/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {/* dot accent indicator for mobile */}
                  {active && (
                    <span className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00ADB5] shadow-[0_0_8px_rgba(0,173,181,0.8)] animate-pulse]"></span>
                  )}
                </li>
              );
            })}
            <li>
              <Link
                to="/loginadmin"
                onClick={toggleMenu}
                className="block px-4 py-2 bg-[#00ADB5] text-[#EEEEEE] rounded-full text-center shadow-[0_0_12px_rgba(0,173,181,0.8)] hover:bg-[#00cfd8] hover:scale-105 transition-all duration-300"
              >
                Login Admin
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
