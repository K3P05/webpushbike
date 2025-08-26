import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md border-b relative">
      {/* Logo / Judul */}
      <div>
        <Link to="/dashboard" className="text-2xl font-bold text-orange-600 tracking-wide">
          🏁 PushBike Race
        </Link>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex">
        <ul className="flex space-x-6 text-gray-700 font-medium items-center">
          <li>
            <Link to="/registrasi" className="hover:text-orange-600 transition">
              Registrasi
            </Link>
          </li>
          <li>
            <Link to="/resultlist" className="hover:text-orange-600 transition">
              Hasil Live
            </Link>
          </li>
          <li>
            <Link to="/tentangkami" className="hover:text-orange-600 transition">
              Tentang Kami
            </Link>
          </li>
          <li>
            <Link to="/kontak" className="hover:text-orange-600 transition">
              Kontak
            </Link>
          </li>
          <li>
            <Link
              to="/loginadmin"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Login Admin
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-2xl text-gray-700 focus:outline-none"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-md border-t md:hidden z-50">
          <ul className="flex flex-col space-y-4 p-6 text-gray-700 font-medium">
            <li>
              <Link
                to="/registrasi"
                className="hover:text-orange-600 transition"
                onClick={toggleMenu}
              >
                Registrasi
              </Link>
            </li>
            <li>
              <Link
                to="/resultlist"
                className="hover:text-orange-600 transition"
                onClick={toggleMenu}
              >
                Hasil Live
              </Link>
            </li>
            <li>
              <Link
                to="/tentangkami"
                className="hover:text-orange-600 transition"
                onClick={toggleMenu}
              >
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link
                to="/kontak"
                className="hover:text-orange-600 transition"
                onClick={toggleMenu}
              >
                Kontak
              </Link>
            </li>
            <li>
              <Link
                to="/loginadmin"
                className="block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-center"
                onClick={toggleMenu}
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
