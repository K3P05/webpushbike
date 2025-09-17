import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "@/assets/img/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const location = useLocation();

  // cek halaman admin
  const isAdminPage = location.pathname.startsWith("/admindashboard");

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // menu publik
  const menuItems = [
    { name: "Registrasi", path: "/registrasi" },
    { name: "Hasil Live", path: "/listhasil" },
    { name: "Kontak", path: "/kontak" },
  ];

  // menu admin
  const adminMenuItems = [
    { name: "Logout", path: "/logout", danger: true },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] shadow-md border-b border-accent sticky top-0 z-50 font-poppins">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to={isAdminPage ? "/admindashboard" : "/dashboard"}
          className="flex items-center space-x-2 group"
        >
          <img src={logo} alt="PushBike Logo" className="h-14 w-auto" />
          <span className="font-bold text-text-light text-xl tracking-wide group-hover:text-accent transition-colors">
            PushBike Race
          </span>
        </Link>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-6 text-text-light font-medium items-center">
            {!isAdminPage
              ? // menu publik
                menuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <li key={item.path} className="group relative">
                      <Link
                        to={item.path}
                        className={`pb-1 transition-colors duration-200 ${
                          active ? "text-accent" : "hover:text-accent"
                        }`}
                      >
                        {item.name}
                      </Link>
                      <span
                        className={`absolute left-0 -bottom-0.5 h-0.5 bg-accent transition-all duration-300 ${
                          active ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </li>
                  );
                })
              : // menu admin
                adminMenuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`pb-1 transition-colors duration-200 ${
                          active
                            ? "text-accent"
                            : item.danger
                            ? "text-red-400 hover:text-red-500"
                            : "hover:text-accent"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}

            {/* Tombol login admin cuma di menu publik */}
            {!isAdminPage && (
              <li>
                <Link
                  to="/loginadmin"
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition"
                >
                  Login Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl text-text-light focus:outline-none"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Navbar */}
      {menuOpen && (
        <nav className="md:hidden bg-[#1e2d3a] border-t border-accent shadow-lg">
          <ul className="flex flex-col space-y-3 p-6 text-text-light font-medium">
            {!isAdminPage
              ? // mobile menu publik
                menuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={toggleMenu}
                        className={`block w-full px-3 py-2 rounded-md transition ${
                          active
                            ? "text-accent bg-accent/10 border-l-4 border-accent"
                            : "hover:text-accent hover:bg-white/5"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })
              : // mobile menu admin
                adminMenuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={toggleMenu}
                        className={`block w-full px-3 py-2 rounded-md transition ${
                          active
                            ? "text-accent bg-accent/10 border-l-4 border-accent"
                            : item.danger
                            ? "text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            : "hover:text-accent hover:bg-white/5"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}

            {/* login admin cuma di menu publik */}
            {!isAdminPage && (
              <li>
                <Link
                  to="/loginadmin"
                  onClick={toggleMenu}
                  className="block px-4 py-2 bg-accent text-white rounded-lg text-center hover:bg-accent-hover transition"
                >
                  Login Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
