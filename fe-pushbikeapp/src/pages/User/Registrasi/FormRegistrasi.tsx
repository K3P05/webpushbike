// src/pages/Registrasi.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserType } from "@/types/users";

type LombaType = {
  id: number;
  nama: string;
  deskripsi: string;
};

const lombaList: LombaType[] = [
  { id: 1, nama: "GP1", deskripsi: "Grand Prix 1 - BMX Challenge" },
  { id: 2, nama: "GP2", deskripsi: "Grand Prix 2 - Pump Track Battle" },
  { id: 3, nama: "GP3", deskripsi: "Grand Prix 3 - Urban Street Race" },
];

export default function Registrasi() {
  const navigate = useNavigate();

  const [selectedLomba, setSelectedLomba] = useState<LombaType | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    plat_number: "",
    community: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLomba) return;

    const newUser: UserType = {
      id_pendaftaran: Date.now(), // sementara auto-generate
      nama: formData.nama,
      plat_number: formData.plat_number,
      community: formData.community,
      point1: 0,
      point2: 0,
    };

    console.log("Data dikirim:", { lomba: selectedLomba, user: newUser });
    // TODO: axios.post("/users", { lomba: selectedLomba, ...newUser })

    setSelectedLomba(null); // tutup modal
    setFormData({ nama: "", plat_number: "", community: "" }); // reset form
    navigate("/hasil-live"); // redirect ke halaman hasil
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Pilih Lomba</h1>

      {/* Card Lomba */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lombaList.map((lomba) => (
          <div
            key={lomba.id}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedLomba(lomba)}
          >
            <h2 className="text-xl font-semibold">{lomba.nama}</h2>
            <p className="text-gray-600 mt-2">{lomba.deskripsi}</p>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {selectedLomba && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            {/* Tombol Close */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setSelectedLomba(null)}
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              Registrasi {selectedLomba.nama}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Plat Number</label>
                <input
                  type="text"
                  name="plat_number"
                  value={formData.plat_number}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700">Community</label>
                <input
                  type="text"
                  name="community"
                  value={formData.community}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
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
