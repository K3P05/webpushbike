/* eslint-disable @typescript-eslint/no-explicit-any */
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
  tanggal: string;
  kategori: "boy" | "girl";
  biaya: number;
};

export default function CheckPeserta() {
  const [lombaList, setLombaList] = useState<Lomba[]>([]);
  const [pesertaByLomba, setPesertaByLomba] = useState<Record<number, Peserta[]>>({});
  const [expandedLomba, setExpandedLomba] = useState<number | null>(null);

  const fetchLomba = async () => {
    try {
      const res = await api.get("/lomba");
      setLombaList(res.data || []);
    } catch (err) {
      console.error("Gagal fetch lomba:", err);
    }
  };

  const fetchPeserta = async (lombaId: number) => {
    try {
      const res = await api.get(`/lomba/${lombaId}/peserta`);
      setPesertaByLomba((prev) => ({
        ...prev,
        [lombaId]: res.data || [],
      }));
    } catch (err) {
      console.error("Gagal fetch peserta:", err);
    }
  };

  const updateStatus = async (id: number, status: boolean, lombaId: number) => {
    try {
      await api.patch(`/peserta/${id}/status`, { statusPembayaran: status });
      await fetchPeserta(lombaId); // refresh tabel peserta
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  useEffect(() => {
    fetchLomba();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#222831] min-h-screen font-poppins">
      <h1 className="text-3xl font-bold text-[#00ADB5] mb-6 text-center">
        Admin - Cek Pembayaran Peserta 🚴
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lombaList.map((lomba) => (
          <div
            key={lomba.id}
            className="bg-[#393E46] shadow-lg rounded-xl p-6 flex flex-col justify-between hover:shadow-xl transition"
          >
            <div>
              <h2 className="text-xl font-semibold text-[#EEEEEE]">{lomba.nama}</h2>
              <p className="text-gray-300 text-sm">
                {new Date(lomba.tanggal).toLocaleDateString()}
              </p>
              <p className="mt-1 font-semibold">
                Kategori:{" "}
                <span
                  className={
                    lomba.kategori === "boy" ? "text-blue-400" : "text-pink-400"
                  }
                >
                  {lomba.kategori}
                </span>
              </p>
              <p className="text-[#EEEEEE]/80 text-sm">
                Biaya: Rp {lomba.biaya.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => {
                setExpandedLomba(expandedLomba === lomba.id ? null : lomba.id);
                fetchPeserta(lomba.id);
              }}
              className="mt-4 w-full bg-[#00ADB5] hover:bg-[#019ca4] text-[#EEEEEE] font-semibold px-4 py-2 rounded-lg shadow transition"
            >
              {expandedLomba === lomba.id ? "Tutup Peserta" : "Cek Peserta"}
            </button>

            {/* Tabel Peserta */}
            {expandedLomba === lomba.id && (
              <div className="mt-4 overflow-x-auto">
                {pesertaByLomba[lomba.id] && pesertaByLomba[lomba.id].length > 0 ? (
                  <table className="min-w-full border border-[#EEEEEE]/20 text-[#EEEEEE] text-sm rounded-lg">
                    <thead className="bg-[#00ADB5] text-[#222831]">
                      <tr>
                        <th className="px-2 py-2 text-left">No</th>
                        <th className="px-2 py-2 text-left">Nama</th>
                        <th className="px-2 py-2 text-left">Plat</th>
                        <th className="px-2 py-2 text-left">Community</th>
                        <th className="px-2 py-2 text-left">Kategori</th>
                        <th className="px-2 py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pesertaByLomba[lomba.id].map((p, index) => (
                        <tr
                          key={p.id_pendaftaran}
                          className="border-t border-[#EEEEEE]/20 hover:bg-[#00ADB5]/20"
                        >
                          <td className="px-2 py-2">{index + 1}</td>
                          <td className="px-2 py-2">{p.nama}</td>
                          <td className="px-2 py-2">{p.platNumber}</td>
                          <td className="px-2 py-2">{p.community}</td>
                          <td className="px-2 py-2">{p.kategori}</td>
                          <td className="px-2 py-2 text-center">
                            <input
                              type="checkbox"
                              className="w-6 h-6 accent-[#00ADB5]"
                              checked={p.statusPembayaran}
                              onChange={(e) =>
                                updateStatus(p.id_pendaftaran, e.target.checked, lomba.id)
                              }
                            />
                            <span className="ml-2">
                              {p.statusPembayaran ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-[#EEEEEE]/70 text-sm mt-2">
                    Belum ada peserta untuk lomba ini.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
