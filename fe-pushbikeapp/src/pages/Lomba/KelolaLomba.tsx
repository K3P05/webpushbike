// src/pages/Admin/KelolaLomba.tsx
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

interface Lomba {
  jumlahPeserta: ReactNode;
  id: number;
  nama: string;
  kategori: string;
  batch?: { id: number; nama: string }[];
}

export default function KelolaLomba() {
  const [lombaList, setLombaList] = useState<Lomba[]>([]);
  const navigate = useNavigate();

  const fetchLomba = async () => {
    try {
      const res = await api.get("/lomba");
      setLombaList(res.data || []);
    } catch (err) {
      console.error("Gagal fetch lomba:", err);
    }
  };

  const handleKelola = async (lomba: Lomba) => {
    try {
      // Jika belum ada batch, buat otomatis default 4 batch
      if (!lomba.batch || lomba.batch.length === 0) {
        await api.patch(`/lomba/${lomba.id}/batch`, { jumlahBatch: 4 });
      }

      // Navigasi ke halaman KelolaPeserta
      navigate(`/admindashboard/kelolapeserta/${lomba.id}`);
    } catch (err) {
      console.error("Gagal membuat batch:", err);
      alert("Gagal membuat batch otomatis. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    fetchLomba();
  }, []);

  return (
    <div className="min-h-screen bg-[#222831] font-poppins px-6 py-12">
      <h1 className="text-2xl font-bold mb-6 text-[#EEEEEE]">Kelola Data Lomba</h1>

      {lombaList.length === 0 ? (
        <p className="text-[#EEEEEE]/70">Belum ada lomba yang dibuat.</p>
      ) : (
        <div className="space-y-4">
          {lombaList.map((lomba) => (
            <div
              key={lomba.id}
              className="bg-[#393E46] p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-[#00ADB5]">{lomba.nama}</h2>
                <p className="text-[#EEEEEE]/70 text-sm">Kategori: {lomba.kategori}</p>
                <p className="text-[#EEEEEE]/70 text-sm">Jumlah Peserta: {lomba.jumlahPeserta}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleKelola(lomba)}
                  className="px-4 py-2 bg-[#00ADB5] text-[#222831] font-medium rounded-lg hover:bg-[#00bfc8] transition"
                >
                  Kelola
                </button>
                <button
                  onClick={() =>
                    navigate(`/admindashboard/kelolapeserta/${lomba.id}?viewOnly=true`)
                  }
                  className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition"
                >
                  Lihat Hasil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
