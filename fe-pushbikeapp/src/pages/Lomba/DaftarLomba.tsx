/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getLombas, deleteLomba } from "@/services/lomba";
import EditLombaModal from "@/pages/Form/EditLombaForm";

export default function DaftarLomba() {
  const [lombas, setLombas] = useState<any[]>([]);
  const [editData, setEditData] = useState<any | null>(null);

  // ambil data dari backend
  const fetchData = async () => {
    try {
      const res = await getLombas();
      setLombas(res.data);
    } catch (err) {
      console.error("Gagal mengambil data lomba:", err);
    }
  };

  // hapus data lomba
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah yakin ingin menghapus lomba ini?")) return;
    try {
      await deleteLomba(id);
      fetchData();
    } catch (err) {
      console.error("Gagal hapus lomba:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#222831] font-poppins p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#EEEEEE]">Daftar Lomba</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lombas.map((lomba) => (
          <div
            key={lomba.id}
            className="bg-[#393E46] p-6 rounded-2xl shadow-lg text-[#EEEEEE] flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{lomba.nama}</h2>
              <p className="text-sm opacity-80 mb-1">Tanggal: {lomba.tanggal}</p>
              <p className="text-sm opacity-80 mb-1">
                Kuota: {lomba.jumlahPeserta}
              </p>
              <p className="text-sm opacity-80 mb-1">Biaya: Rp {lomba.biaya}</p>
              <p className="text-sm opacity-80 mb-3">
                Kategori: {lomba.kategori}
              </p>
            </div>

            {/* Tombol di kanan bawah */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditData(lomba)}
                className="px-4 py-2 rounded-lg bg-[#00ADB5] hover:bg-[#00ADB5]/80 text-[#EEEEEE]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(lomba.id)}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edit */}
      {editData && (
        <EditLombaModal
          lomba={editData}
          onClose={() => setEditData(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
