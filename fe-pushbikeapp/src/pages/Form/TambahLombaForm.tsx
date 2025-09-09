/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/TambahLombaModal.tsx
import { useState } from "react";
import { createLomba, type Kategori } from "@/services/lomba";

interface TambahLombaModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TambahLombaModal({ onClose, onSuccess }: TambahLombaModalProps) {
  const [form, setForm] = useState<{
    nama: string;
    tanggal: string;
    jumlah_peserta: number;
    biaya: number;
    kategori: Kategori;
    jumlah_batch: number;
  }>({
    nama: "",
    tanggal: "",
    jumlah_peserta: 1,
    biaya: 0,
    kategori: "boy",
    jumlah_batch: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "kategori" ? (value as Kategori) : Number(value) || value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createLomba({
        nama: form.nama,
        tanggal: form.tanggal,
        jumlahPeserta: Number(form.jumlah_peserta),
        biaya: Number(form.biaya),
        kategori: form.kategori,
        jumlahBatch: Number(form.jumlah_batch),
      });

      onSuccess();
      alert("Data lomba berhasil disimpan!");
      onClose();
    } catch (err: any) {
      console.error("Gagal tambah lomba:", err);
      setError(err?.response?.data?.message || "Gagal tambah lomba");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 font-poppins">
      <div className="bg-[#00ADB5]/20 border border-[#00ADB5]/40 rounded-xl shadow-xl w-full max-w-sm p-4 relative animate-fadeIn">
        <h2 className="text-lg font-semibold mb-2 border-b border-accent pb-1 text-center">
          Tambah Lomba
        </h2>

        {error && (
          <p className="text-red-500 text-xs mb-2">
            {Array.isArray(error) ? error.join(", ") : error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-1.5">
          <div>
            <label className="block mb-0.5 text-sm">Nama Lomba</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Silahkan masukan nama lomba"
              className="w-full px-3 py-2 bg-[#222831] text-[#EEEEEE] placeholder:text-[#EEEEEE] border border-[#00ADB5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ADB5] text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-0.5 text-sm">Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              placeholder="Pilih tanggal lomba"
              className="w-full px-3 py-2 bg-[#222831] text-[#EEEEEE] placeholder:text-textlight/60 border border-[#00ADB5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ADB5] text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-0.5 text-sm">Jumlah Peserta</label>
            <input
              type="number"
              name="jumlah_peserta"
              value={form.jumlah_peserta}
              onChange={handleChange}
              min={1}
              placeholder="Masukkan jumlah peserta"
              className="w-full px-3 py-2 bg-[#222831] text-[#EEEEEE] placeholder:text-textlight/60 border border-[#00ADB5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ADB5] text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-0.5 text-sm">Jumlah Batch</label>
            <input
              type="number"
              name="jumlah_batch"
              value={form.jumlah_batch}
              onChange={handleChange}
              min={1}
              placeholder="Masukkan jumlah batch"
              className="w-full px-3 py-2 bg-[#222831] text-[#EEEEEE] placeholder:text-textlight/60 border border-[#00ADB5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ADB5] text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-0.5 text-sm">Harga Pendaftaran (Rp)</label>
            <input
              type="number"
              name="biaya"
              value={form.biaya}
              onChange={handleChange}
              min={0}
              placeholder="Masukkan biaya (Rp)"
              className="w-full px-3 py-2 bg-[#222831] text-[#EEEEEE] placeholder:text-textlight/60 border border-[#00ADB5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ADB5] text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-0.5 text-sm">Kategori</label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#222831] text-[#EEEEEE] border border-[#00ADB5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ADB5] text-sm"
            >
              <option value="boy" className="text-blue-400 bg-[#222831]">
                Boy
              </option>
              <option value="girl" className="text-pink-400 bg-[#222831]">
                Girl
              </option>
            </select>
          </div>


          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-gray-600 hover:bg-gray-700 text-sm"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-accent hover:bg-accent/80 text-textlight text-sm"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
