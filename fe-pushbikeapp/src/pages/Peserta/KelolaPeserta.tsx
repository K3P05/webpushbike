/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/Admin/KelolaPesertaLomba.tsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "@/services/api";

interface Peserta {
  id: number;
  nama: string;
  point?: number;
}

interface Batch {
  id: number;
  nama: string;
  peserta: Peserta[];
}

interface Lomba {
  id: number;
  nama: string;
  kategori: string;
  jumlahPeserta: number;
  batch: Batch[];
  peserta: Peserta[];
}

export default function KelolaPesertaLomba() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const viewOnly = searchParams.get("viewOnly") === "true";

  const [lomba, setLomba] = useState<Lomba | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLomba = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/lomba/${id}`);
      const data: Lomba = res.data;

      // Pastikan batch dan peserta selalu array
      const batchList = data.batch ?? [];
      const pesertaList = data.peserta ?? [];

      // Jika batch ada, bagi peserta otomatis
      if (batchList.length > 0 && pesertaList.length > 0) {
        const pesertaPerBatch = Math.ceil(pesertaList.length / batchList.length);
        batchList.forEach((b, idx) => {
          b.peserta = pesertaList.slice(
            idx * pesertaPerBatch,
            (idx + 1) * pesertaPerBatch
          );
        });
      }

      data.batch = batchList;
      setLomba(data);
    } catch (err) {
      console.error("Gagal fetch lomba:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLomba();
  }, [id]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!lomba) return <p className="text-white">Lomba tidak ditemukan</p>;

  return (
    <div className="min-h-screen bg-[#222831] font-poppins px-6 py-12">
      <h1 className="text-2xl font-bold mb-6 text-[#EEEEEE]">
        Kelola Peserta Lomba: {lomba.nama}
      </h1>

      {lomba.batch.length === 0 ? (
        <p className="text-[#EEEEEE]/70">
          Belum ada batch. Silakan atur batch terlebih dahulu.
        </p>
      ) : (
        <div className="space-y-6">
          {lomba.batch.map((b, idx) => (
            <div key={b.id} className="bg-[#393E46] p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-[#00ADB5]">
                Batch {idx + 1}: {b.nama}
              </h2>

              {(b.peserta ?? []).length === 0 ? (
                <p className="text-[#EEEEEE]/70">Belum ada peserta.</p>
              ) : (
                <table className="w-full text-white mt-2 border border-gray-600">
                  <thead>
                    <tr className="bg-[#00ADB5] text-[#222831]">
                      <th className="px-2 py-1 border">#</th>
                      <th className="px-2 py-1 border">Nama Peserta</th>
                      <th className="px-2 py-1 border">Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(b.peserta ?? []).map((p, pIdx) => (
                      <tr key={p.id} className="odd:bg-[#222831] even:bg-[#2C2F33]">
                        <td className="px-2 py-1 border">{pIdx + 1}</td>
                        <td className="px-2 py-1 border">{p.nama}</td>
                        <td className="px-2 py-1 border">{p.point ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}

      {viewOnly && (
        <p className="text-yellow-400 mt-4">
          Mode hanya lihat hasil. Batch tidak bisa diubah.
        </p>
      )}
    </div>
  );
}
