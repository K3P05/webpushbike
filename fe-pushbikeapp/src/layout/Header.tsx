import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "@/assets/img/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminPage = location.pathname.startsWith("/admin");

  // menu untuk user
  const userNavItems = [
    { path: "/registrasi", label: "Registrasi" },
    { path: "/resultlist", label: "Hasil Live" },
    { path: "/tentangkami", label: "Tentang Kami" },
    { path: "/kontak", label: "Kontak" },
  ];

  const navItems = isAdminPage ? [] : userNavItems;

  // fungsi logout → balik ke halaman utama
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="w-full sticky top-0 z-50 font-poppins bg-gradient-main backdrop-blur-lg border-b border-card-dark shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
       
        {/* Logo */}
        <Link
          to={isAdminPage ? "/admindashboard" : "/"}
          className="flex items-center space-x-2"
        >
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <span className="font-bold text-xl tracking-wide text-accent hover:underline">
            {isAdminPage ? "Admin Panel" : "PushBike Race"}
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-6 text-textlight font-medium items-center">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`transition ${
                    location.pathname === item.path
                      ? "text-accent border-b-2 border-accent pb-1"
                      : "hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* tombol login admin untuk user */}
            {!isAdminPage && (
              <li>
                <Link
                  to="/loginadmin"
                  className="px-4 py-2 bg-accent text-white rounded-full shadow hover:bg-accent/80 hover:scale-105 transition"
                >
                  Login Admin
                </Link>
              </li>
            )}

            {/* tombol logout untuk admin */}
            {isAdminPage && (
              <li>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 hover:scale-105 transition"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl text-textlight"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-base-darker border-t border-card-dark shadow-md">
          <ul className="flex flex-col space-y-4 p-6 text-textlight font-medium">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={toggleMenu}
                  className={`transition ${
                    location.pathname === item.path
                      ? "text-accent border-l-4 border-accent pl-2"
                      : "hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {!isAdminPage && (
              <li>
                <Link
                  to="/loginadmin"
                  onClick={toggleMenu}
                  className="px-4 py-2 bg-accent text-white rounded-full shadow hover:bg-accent/80 transition"
                >
                  Login Admin
                </Link>
              </li>
            )}

            {isAdminPage && (
              <li>
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
