/* eslint-disable @typescript-eslint/no-explicit-any */
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
  kategori: Kategori;
};

export default function Registrasi() {
  const navigate = useNavigate();
  const [lombaList, setLombaList] = useState<LombaType[]>([]);
  const [selectedLomba, setSelectedLomba] = useState<LombaType | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    plat_number: "",
    community: "",
    no_hp : "",
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

    const confirmDaftar = window.confirm(
      `Apakah Anda yakin ingin mendaftar ke lomba "${selectedLomba.nama}"?`
    );
    if (!confirmDaftar) return;

    try {
      await api.post(`/lomba/${selectedLomba.id}/peserta`, {
        nama: formData.nama,
        plat_number: formData.plat_number,
        community: formData.community,
        no_hp: formData.no_hp,
        metodePembayaran: formData.metodePembayaran,
        kategori: selectedLomba.kategori,
      });

      alert(`✅ Pendaftaran berhasil! Anda telah terdaftar di lomba "${selectedLomba.nama}".`);

      await fetchLomba();
      setSelectedLomba(null);
      setFormData({ nama: "", plat_number: "", community: "", no_hp: "", metodePembayaran: "transfer" });

      navigate("/");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "❌ Gagal daftar");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-base-dark min-h-screen font-poppins">
      {/* Header */}
      <h1 className="text-3xl font-bold text-accent mb-6 text-center">
        Pilih Lomba untuk Daftar 🚴
      </h1>
      <p className="text-textlight/70 mb-8 text-center">
        Silakan pilih lomba yang tersedia, lalu isi formulir registrasi.
      </p>

      {/* Daftar Lomba */}
      <div className="flex flex-col gap-6">
        {lombaList.map((lomba) => (
          <div
            key={lomba.id}
            className="bg-[#00ADB5]/20 border border-[#00ADB5]/40 shadow-md rounded-2xl p-6 hover:bg-accent hover:text-base-dark hover:shadow-accent/40 hover:scale-[1.03] transition-all duration-300 cursor-pointer"
          >
            <div>
              <h2 className="text-lg font-semibold text-textlight">{lomba.nama}</h2>
              <p className="text-textlight/70 text-sm">
                {new Date(lomba.tanggal).toLocaleDateString()}
              </p>
              {lomba.kategori && (
                <p className="mt-1 font-semibold">
                  Kategori:{" "}
                  <span
                    className={
                      lomba.kategori === "boy"
                        ? "text-blue-400"
                        : "text-pink-400"
                    }
                  >
                    {lomba.kategori}
                  </span>
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedLomba(lomba)}
              className="mt-4 w-full bg-accent hover:bg-[#00cfd8] text-base-dark font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-accent/40 transition-all">
              Daftar
            </button>
          </div>
        ))}
      </div>

      {/* Modal Registrasi */}
      {selectedLomba && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#00ADB5]/20 border border-[#00ADB5]/40 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn">
            
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-textlight hover:text-accent transition"
              onClick={() => setSelectedLomba(null)}
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-accent">
              Registrasi {selectedLomba.nama}
            </h2>

            <p className="text-textlight/80 mb-2 text-center">
              Biaya pendaftaran:{" "}
              <span className="text-accent font-semibold">
                Rp {selectedLomba.biaya.toLocaleString()}
              </span>
            </p>
            <p className="text-textlight/80 mb-6 text-center">
              Kategori lomba:{" "}
              <span
                className={
                  selectedLomba.kategori === "girl"
                    ? "text-pink-400 font-semibold"
                    : "text-blue-400 font-semibold"
                }
              >
                {selectedLomba.kategori}
              </span>
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

              <div className="mb-4">
              <label className="block text-[#EEEEEE] font-medium">No HP</label>
              <input
                type="text"
                name="no_hp"
                value={formData.no_hp || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-[#222831] text-[#EEEEEE] border border-[#00ADB5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                required
              />
            </div>


              <div className="mb-6">
                <p className="text-[#EEEEEE] font-medium">Metode Pembayaran</p>
                <p className="text-[#00ADB5] mt-2 font-semibold">
                  Transfer Bank: BCA 1234567890 a.n Panitia PushBike
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-[#00cfd8] text-base-dark font-semibold p-3 rounded-lg shadow-md hover:shadow-accent/40 transition-all"
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
