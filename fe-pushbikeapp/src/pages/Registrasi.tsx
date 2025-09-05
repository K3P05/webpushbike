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

            {/* Form */}
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
                      className="w-full mt-1 p-2 bg-base-dark text-slate-600 placeholder-textlight/60 border border-accent/40 rounded-lg focus:outline-none focus:border-accent transition"
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
                  className="w-full mt-1 p-2 bg-base-dark text-slate-600 border border-accent/40 rounded-lg focus:outline-none focus:border-accent transition"
                >
                  <option value="transfer">Transfer Bank</option>
                  <option value="midtrans">Midtrans</option>
                  <option value="cod">COD</option>
                </select>
              </div>

              {/* Submit */}
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
