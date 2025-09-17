// src/pages/Admin/DaftarPeserta.tsx
import { useEffect, useState } from "react";
import api from "@/services/api";

type Peserta = {
  id_pendaftaran: number;
  nama: string;
  kategori: string;
  platNumber: string;
  community: string;
  id_lomba: number;
  statusPembayaran: boolean;
};

type Lomba = {
  id: number;
  nama: string;
};

export default function DaftarPeserta() {
  const [lombaList, setLombaList] = useState<Lomba[]>([]);
  const [pesertaByLomba, setPesertaByLomba] = useState<Record<number, Peserta[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedLomba, setExpandedLomba] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const lombaRes = await api.get("/lomba");
      const lombaData: Lomba[] = lombaRes.data ?? [];
      setLombaList(lombaData);

      const grouped: Record<number, Peserta[]> = {};
      for (const lomba of lombaData) {
        const pesertaRes = await api.get(`/lomba/${lomba.id}/peserta`);
        const pesertaData = pesertaRes.data ?? [];
        grouped[lomba.id] = pesertaData.filter(
          (p: Peserta & { statusPembayaran: boolean }) => p.statusPembayaran
        );
      }

      setPesertaByLomba(grouped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleLomba = (id: number) => {
    setExpandedLomba((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-text-light">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-poppins px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-text-light">Daftar Peserta per Lomba</h1>

      {lombaList.length === 0 ? (
        <p className="text-text-light/70">Belum ada lomba yang dibuat.</p>
      ) : (
        <div className="space-y-4">
          {lombaList.map((lomba) => (
            <div
              key={lomba.id}
              className="bg-base-card p-4 rounded-lg shadow cursor-pointer"
              onClick={() => toggleLomba(lomba.id)}
            >
              <h2 className="text-lg font-semibold flex justify-between items-center text-accent">
                {lomba.nama}
                <span className="text-xs text-text-light/70">
                  {expandedLomba === lomba.id ? "▲ Tutup" : "▼ Lihat Peserta"}
                </span>
              </h2>

              {expandedLomba === lomba.id && (
                <div className="mt-3 overflow-x-auto transition-all duration-300">
                  {pesertaByLomba[lomba.id] && pesertaByLomba[lomba.id].length > 0 ? (
                    <table className="min-w-full border border-border-accent/30 text-text-light text-sm rounded-lg overflow-hidden">
                      <thead className="bg-accent text-base-dark">
                        <tr>
                          <th className="px-2 py-1 text-left">#</th>
                          <th className="px-2 py-1 text-left">Nama</th>
                          <th className="px-2 py-1 text-left">Kategori</th>
                          <th className="px-2 py-1 text-left">Plat Number</th>
                          <th className="px-2 py-1 text-left">Community</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pesertaByLomba[lomba.id].map((peserta, index) => (
                          <tr
                            key={peserta.id_pendaftaran}
                            className="border-t border-border-accent/30 hover:bg-accent/20"
                          >
                            <td className="px-2 py-1">{index + 1}</td>
                            <td className="px-2 py-1">{peserta.nama}</td>
                            <td className="px-2 py-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  peserta.kategori === "boy"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : peserta.kategori === "girl"
                                    ? "bg-pink-500/20 text-pink-400"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {peserta.kategori}
                              </span>
                            </td>
                            <td className="px-2 py-1">{peserta.platNumber}</td>
                            <td className="px-2 py-1">{peserta.community}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-text-light/70 text-sm">
                      Belum ada peserta untuk lomba ini.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
