// src/pages/AdminDashboard.tsx
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <p className="text-gray-600 mb-8">Selamat datang, Admin!</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Card Tambah Lomba */}
        <div
          onClick={() => navigate("tambahlomba")}
          className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition text-center"
        >
          <h2 className="text-xl font-semibold mb-2">➕ Tambah Lomba</h2>
          <p className="text-gray-600">Tambahkan lomba baru ke sistem</p>
        </div>

        {/* Card lainnya bisa ditambahkan di sini */}
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">📋 Daftar Lomba</h2>
          <p className="text-gray-600">Lihat semua lomba yang sudah dibuat</p>
        </div>
      </div>
    </div>
  );
}
