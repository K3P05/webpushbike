/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Registrasi.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/component/ui/Card";
import Button from "@/component/ui/Buttons";

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
    no_hp: "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        ...formData,
        kategori: selectedLomba.kategori,
      });

      alert(
        `✅ Pendaftaran berhasil! Anda telah terdaftar di lomba "${selectedLomba.nama}".`
      );

      await fetchLomba();
      setSelectedLomba(null);
      setFormData({
        nama: "",
        plat_number: "",
        community: "",
        no_hp: "",
        metodePembayaran: "transfer",
      });

      navigate("/");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "❌ Gagal daftar");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen font-poppins">
      <h1 className="text-3xl font-bold text-accent mb-6 text-center">
        Pilih Lomba untuk Daftar 🚴
      </h1>

      {/* Daftar Lomba */}
      <div className="grid gap-4">
        {lombaList.map((lomba) => (
          <Card
            key={lomba.id}
            className="bg-base-card border-none text-text-light hover:shadow-lg transition"
          >
            <CardHeader>
              <CardTitle className="text-lg">{lomba.nama}</CardTitle>
              <p className="text-gray-300 text-sm">
                {new Date(lomba.tanggal).toLocaleDateString()}
              </p>
              <span
                className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  lomba.kategori === "boy"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-pink-500/20 text-pink-400"
                }`}
              >
                {lomba.kategori}
              </span>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setSelectedLomba(lomba)}
                className="w-full bg-accent hover:bg-accent-hover"
              >
                Daftar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Registrasi manual */}
      {selectedLomba && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-card text-text-light rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-text-light hover:text-accent transition"
              onClick={() => setSelectedLomba(null)}
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-accent">
              Registrasi {selectedLomba.nama}
            </h2>

            <p className="text-text-light/80 mb-2 text-center">
              Biaya pendaftaran:{" "}
              <span className="text-accent font-semibold">
                Rp {selectedLomba.biaya.toLocaleString()}
              </span>
            </p>
            <p className="text-text-light/80 mb-4 text-center">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {["nama", "plat_number", "community", "no_hp"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 bg-base-dark text-text-light border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
              ))}

              <div>
                <p className="text-sm font-medium">Metode Pembayaran</p>
                <p className="text-accent mt-2 font-semibold text-sm">
                  Transfer Bank: BCA 1234567890 a.n Panitia PushBike
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover"
              >
                Daftar
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
