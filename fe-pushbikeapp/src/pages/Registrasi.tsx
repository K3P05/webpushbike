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
        ...formData,
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
    <div className="min-h-screen bg-base-dark p-6 font-poppins">

      {/* Header */}
      <div className="text-center mb-12 mt-10">
        <h2 className="text-4xl font-extrabold text-textlight tracking-wide drop-shadow-md">
          Ayo Ikut Kompetisi!
        </h2>
        <p className="text-textlight/70 mt-3 max-w-2xl mx-auto">
          Pilih lomba favoritmu dan segera daftar sebelum kuota habis 🚴‍♂️🏆
        </p>
      </div>

      {/* Card List */}
      <div className="flex justify-start gap-8 ml-[72px] flex-wrap">
        {lombaList.map((lomba) => (
          <div
            key={lomba.id}
            className="bg-gradient-to-br from-[#1b252f] to-[#222b36]/90
                      border border-white/10
                      shadow-md hover:shadow-[0_0_20px_rgba(0,173,181,0.3)]
                      rounded-2xl p-6 md:p-8 
                      cursor-pointer transform hover:-translate-y-2 transition-all duration-300 w-64"
            onClick={() => setSelectedLomba(lomba)}
          >
            <h2 className="text-2xl font-bold text-textlight">{lomba.nama}</h2>
            <p className="text-textlight/80 mt-2">
              📅 {new Date(lomba.tanggal).toLocaleDateString()}
            </p>
            <p className="text-textlight/80">👥 Kuota: {lomba.jumlahPeserta}</p>
            <p className="text-textlight font-semibold mt-2">
              💰 Rp {lomba.biaya.toLocaleString()}
            </p>
            <p className="text-textlight mt-1">
              🏆 <span className="text-accent font-semibold">{lomba.kategori}</span>
            </p>
            {lomba.deskripsi && (
              <p className="text-textlight/70 mt-3 line-clamp-3">{lomba.deskripsi}</p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedLomba && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#2E3440] rounded-2xl shadow-2xl w-full max-w-md p-8 relative 
                          border border-accent/40 animate-fadeIn shadow-accent/30">

            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-textlight hover:text-accent transition"
              onClick={() => setSelectedLomba(null)}
            >
              ✖
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-6 text-center text-textlight">
              Registrasi {selectedLomba.nama}
            </h2>

            {/* Info lomba */}
            <div className="text-center mb-6 space-y-2">
              <p className="text-textlight">
                Biaya:{" "}
                <span className="text-accent font-semibold">
                  Rp {selectedLomba.biaya.toLocaleString()}
                </span>
              </p>
              <p className="text-textlight">
                Kategori:{" "}
                <span className="text-accent font-semibold">{selectedLomba.kategori}</span>
              </p>
            </div>

            {/*Form*/}
            <form onSubmit={handleSubmit} className="space-y-4">
              {["nama", "plat_number", "community"].map((field) => (
                <div key={field}>
                  <label className="block text-textlight font-medium capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 bg-[#4A5568] text-white placeholder-gray-400 
                              border border-accent/40 rounded-lg"
                    placeholder={`Masukkan ${field.replace("_", " ")}`}
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-textlight font-medium">Metode Pembayaran</label>
                <select
                  name="metodePembayaran"
                  value={formData.metodePembayaran}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-[#4A5568] text-white 
                            border border-accent/40 rounded-lg"
                >
                  <option value="transfer">Transfer Bank</option>
                  <option value="midtrans">Midtrans</option>
                  <option value="cod">COD</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-accent text-white font-semibold p-3 rounded-lg shadow-md 
                          hover:bg-accent/80 hover:shadow-lg transition-all duration-300">
                Daftar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
