/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Registrasi.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

type Kategori = "boy" | "girl";

type LombaType = {
  id: number;
  nama: string;
  tanggal: string;
  deskripsi?: string;
  jumlahPeserta: number;
  biaya: number;
  kategori: Kategori; // tambahkan kategori
};

export default function Registrasi() {
  const navigate = useNavigate();

  const [lombaList, setLombaList] = useState<LombaType[]>([]);
  const [selectedLomba, setSelectedLomba] = useState<LombaType | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    plat_number: "",
    community: "",
    metodePembayaran: "transfer",
  });

  const fetchLomba = async () => {
    try {
      const res = await api.get<LombaType[]>("/lomba");
      setLombaList(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLomba();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLomba) return;

    try {
      await api.post(`/lomba/${selectedLomba.id}/peserta`, {
        nama: formData.nama,
        plat_number: formData.plat_number,
        community: formData.community,
        metodePembayaran: formData.metodePembayaran,
        kategori: selectedLomba.kategori,
      });

      await fetchLomba();
      setSelectedLomba(null);
      setFormData({ nama: "", plat_number: "", community: "", metodePembayaran: "transfer" });
      navigate("/");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal daftar");
    }
  };

  return (
    <div className="min-h-screen bg-[#222831] p-6 font-poppins">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#00ADB5]">Pilih Lomba</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lombaList.map((lomba) => (
          <div
            key={lomba.id}
            className="bg-[#393E46] border border-[#222831] shadow-sm rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:border-[#00ADB5] transition"
            onClick={() => setSelectedLomba(lomba)}
          >
            <h2 className="text-xl font-semibold text-[#EEEEEE]">{lomba.nama}</h2>
            <p className="text-[#EEEEEE]/80 mt-1">Tanggal: {new Date(lomba.tanggal).toLocaleDateString()}</p>
            <p className="text-[#EEEEEE]/70 mt-1">Kuota: {lomba.jumlahPeserta}</p>
            <p className="text-[#00ADB5] font-semibold mt-1">Biaya: Rp {lomba.biaya.toLocaleString()}</p>
            <p className="text-[#EEEEEE]/80 mt-1">Kategori: <span className="text-[#00ADB5] font-semibold">{lomba.kategori}</span></p>
            {lomba.deskripsi && <p className="text-[#EEEEEE] mt-2">{lomba.deskripsi}</p>}
          </div>
        ))}
      </div>

      {selectedLomba && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#393E46] rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-[#EEEEEE] hover:text-[#00ADB5] transition"
              onClick={() => setSelectedLomba(null)}
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-[#00ADB5]">Registrasi {selectedLomba.nama}</h2>

            <p className="text-[#EEEEEE]/80 mb-2 text-center">
              Biaya pendaftaran: <span className="text-[#00ADB5] font-semibold">Rp {selectedLomba.biaya.toLocaleString()}</span>
            </p>
            <p className="text-[#EEEEEE]/80 mb-4 text-center">
              Kategori lomba: <span className="text-[#00ADB5] font-semibold">{selectedLomba.kategori}</span>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[#EEEEEE] font-medium">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-[#222831] text-[#EEEEEE] border border-[#00ADB5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#EEEEEE] font-medium">Plat Number</label>
                <input
                  type="text"
                  name="plat_number"
                  value={formData.plat_number}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-[#222831] text-[#EEEEEE] border border-[#00ADB5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#EEEEEE] font-medium">Community</label>
                <input
                  type="text"
                  name="community"
                  value={formData.community}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-[#222831] text-[#EEEEEE] border border-[#00ADB5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-[#EEEEEE] font-medium">Metode Pembayaran</label>
                <select
                  name="metodePembayaran"
                  value={formData.metodePembayaran}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-[#222831] text-[#EEEEEE] border border-[#00ADB5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                >
                  <option value="transfer">Transfer Bank</option>
                  <option value="midtrans">Midtrans</option>
                  <option value="cod">COD</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00ADB5] hover:bg-[#EEEEEE] hover:text-[#222831] text-white font-semibold p-3 rounded-lg shadow-md transition"
              >
                Daftar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
