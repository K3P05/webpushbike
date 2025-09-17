// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TambahLombaModal from "@/pages/Form/TambahLombaForm";
import api from "@/services/api";
import { Card, CardHeader, CardContent } from "@/component/ui/Card";

type MenuItem = {
  title: string;
  desc: string;
  action?: () => void;
  path?: string;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [lombaCount, setLombaCount] = useState(0);

  const fetchLombaCount = async () => {
    try {
      const res = await api.get("/lomba");
      setLombaCount(res.data?.length ?? 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLombaCount();
  }, []);

  const menuItems: MenuItem[] = [
    { title: "➕ Tambah Lomba", desc: "Tambahkan lomba baru", action: () => setOpenModal(true) },
    { title: "🛠️ Kelola Data Lomba", desc: "Pengelolaan data lomba yang sudah ada", path: "kelolalomba" },
    { title: "👥 Daftar Peserta", desc: "Lihat dan kelola peserta", path: "daftarpeserta" },
    { title: "📋 Daftar Lomba", desc: `Semua lomba (${lombaCount})`, path: "daftarlomba" },
    { title: "📩 Lihat Pesan", desc: "Semua Pesan Yang Masuk", path: "lihatpesan" },
    { title: "☑️ Status Peserta", desc: "Status Pembayaran peserta", path: "checkpeserta" },
    { title: "📊 Statistik", desc: "Statistik lomba & peserta", path: "statistik" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 text-text-light">Dashboard Admin</h1>
      <p className="text-text-light/70 mb-10">
        Selamat datang, Admin! Silakan pilih menu untuk mengelola data.
      </p>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, idx) => (
          <Card
            key={idx}
            onClick={() => (item.action ? item.action() : item.path && navigate(item.path))}
            className="cursor-pointer bg-base-card hover:bg-base-light/20 
                       transform hover:scale-105 hover:shadow-xl 
                       transition-all duration-300 group"
          >
            <CardHeader className="text-center">
              <h2 className="text-xl font-semibold text-text-light group-hover:text-accent transition-colors">
                {item.title}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-center text-text-light/70 group-hover:text-text-light transition-colors">
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Pop-up */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-base-card rounded-2xl shadow-lg w-full max-w-lg p-6 animate-fadeIn">
            <TambahLombaModal
              onClose={() => setOpenModal(false)}
              onSuccess={() => {
                fetchLombaCount();
                setOpenModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
