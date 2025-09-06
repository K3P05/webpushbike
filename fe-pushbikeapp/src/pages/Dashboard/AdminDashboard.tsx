// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TambahLombaModal from "@/pages/Form/TambahLombaForm";
import api from "@/services/api";

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

  // fetch jumlah lomba
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
    { title: "📑 Kelola Data Lomba", desc: "Pengelolaan data lomba yang sudah ada", path: "kelolalomba" },
    { title: "👥 Daftar Peserta", desc: "Lihat dan kelola peserta", path: "daftarpeserta" },
    { title: "📋 Daftar Lomba", desc: `Semua lomba (${lombaCount})`, path: "daftarlomba" },
    { title: "📩 Lihat Pesan", desc: "Semua Pesan Yang Masuk", path: "lihatpesan" },
    { title: "☑️ Status Peserta", desc: "Status Pembayaran peserta", path: "checkpeserta" },
    { title: "📊 Statistik", desc: "Statistik lomba & peserta", path: "statistik" },
  ];

  return (
    <div className="min-h-screen bg-base-dark font-poppins text-textlight">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-4 text-accent">
          Dashboard Admin
        </h1>
        <p className="text-textlight/70 mb-10">
          Selamat datang, Admin! Silakan pilih menu untuk mengelola data.
        </p>

        {/* Menu Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() =>
                item.action ? item.action() : item.path && navigate(item.path)
              }
              className="group cursor-pointer bg-[#00ADB5]/20 border border-[#00ADB5]/40 
                        rounded-2xl shadow-2xl w-full max-w-md p-8 relative 
                        transition-all duration-300 hover:scale-[1.03] hover:shadow-accent/40"
            >
              <h2 className="text-xl font-semibold mb-2 text-textlight group-hover:text-accent">
                {item.title}
              </h2>
              <p className="text-textlight/70 group-hover:text-textlight">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tambah Lomba */}
      {openModal && (
        <TambahLombaModal
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            fetchLombaCount();
          }}
        />
      )}
    </div>
  );
}
