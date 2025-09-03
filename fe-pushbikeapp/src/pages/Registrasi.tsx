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
    <div className="p-6 max-w-3xl mx-auto bg-[#222831] min-h-screen font-poppins">
      <h1 className="text-3xl font-bold text-[#00ADB5] mb-6 text-center">
        Pilih Lomba untuk Daftar 🚴
      </h1>

      {/* Daftar Lomba */}
      <div className="flex flex-col gap-4">
        {lombaList.map((lomba) => (
          <div
            key={lomba.id}
            className="bg-[#393E46] shadow-lg rounded-xl p-4 flex flex-col justify-between hover:shadow-xl transition"
          >
            <div>
              <h2 className="text-lg font-semibold text-[#EEEEEE]">{lomba.nama}</h2>
              <p className="text-gray-300 text-sm">
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
              className="mt-4 w-full bg-blue-400 hover:bg-blue-600 text-[#EEEEEE] font-semibold px-2 py-1 rounded-lg shadow transition"
            >
              Daftar
            </button>
          </div>
        ))}
      </div>

      {/* Modal Registrasi */}
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
            <h2 className="text-2xl font-bold mb-6 text-center text-[#00ADB5]">
              Registrasi {selectedLomba.nama}
            </h2>

            <p className="text-[#EEEEEE]/80 mb-2 text-center">
              Biaya pendaftaran:{" "}
              <span className="text-[#00ADB5] font-semibold">
                Rp {selectedLomba.biaya.toLocaleString()}
              </span>
            </p>
            <p className="text-[#EEEEEE]/80 mb-4 text-center">
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
                className="w-full bg-blue-400 hover:bg-blue-600 text-[#EEEEEE] font-semibold p-3 rounded-lg shadow-md transition"
                Daftar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
