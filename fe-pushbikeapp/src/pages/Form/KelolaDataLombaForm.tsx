// src/pages/Admin/KelolaDataLombaModal.tsx
import { useState } from "react";
import api from "@/services/api";

interface KelolaDataLombaModalProps {
  lomba: {
    id: number;
    nama: string;
  };
  onClose: () => void;
}

export default function KelolaDataLombaModal({ lomba, onClose }: KelolaDataLombaModalProps) {
  const [batchCount, setBatchCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (batchCount <= 0) return alert("Jumlah batch harus lebih dari 0");

    setLoading(true);
    try {
      // 🔹 ganti dari POST -> PATCH
      await api.patch(`/lomba/${lomba.id}/batch`, { jumlahBatch: batchCount });

      alert(`Peserta lomba "${lomba.nama}" berhasil dibagi ke ${batchCount} batch.`);
      onClose();
    } catch (err) {
      console.error("API Error:", err);
      alert("Gagal menyimpan batch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#393E46] rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-[#00ADB5] mb-4">
          Kelola Lomba: {lomba.nama}
        </h2>

        <label className="block text-[#EEEEEE] mb-2">Masukkan Jumlah Batch</label>
        <input
          type="number"
          value={batchCount}
          onChange={(e) => setBatchCount(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-[#222831] text-[#EEEEEE] border border-[#00ADB5] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] mb-4"
          placeholder="Contoh: 4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#00ADB5] text-[#222831] font-medium hover:bg-[#00c5d1] disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
