/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

type LombaFormProps = {
  onSubmit: (formData: {
    nama: string;
    kategori: "kualifikasi" | "semifinal" | "final";
    batch: number | null;
    peserta: number;
    tanggal: string; // "YYYY-MM-DD"
  }) => void;
};

export default function LombaForm({ onSubmit }: LombaFormProps) {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState<"kualifikasi" | "semifinal" | "final">("kualifikasi");
  const [batch, setBatch] = useState(1);
  const [peserta, setPeserta] = useState(1);
  const [tanggal, setTanggal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nama,
      kategori,
      // hanya kualifikasi yang kirim angka batch, selain itu kirim null
      batch: kategori === "kualifikasi" ? batch : null,
      peserta,
      tanggal,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Tambah Perlombaan</h2>

      {/* Nama Lomba */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Nama Lomba</label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Kategori */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Kategori</label>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value as any)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="kualifikasi">Kualifikasi</option>
          <option value="semifinal">Semi Final</option>
          <option value="final">Final</option>
        </select>
      </div>

      {/* Jumlah Batch (hanya kualifikasi) */}
      {kategori === "kualifikasi" && (
        <div className="mb-4">
          <label className="block font-medium mb-1">Jumlah Batch</label>
          <input
            type="number"
            min={1}
            value={batch}
            onChange={(e) => setBatch(Math.max(1, Number(e.target.value)))}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      )}

      {/* Jumlah Peserta */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Jumlah Peserta</label>
        <input
          type="number"
          min={1}
          value={peserta}
          onChange={(e) => setPeserta(Math.max(1, Number(e.target.value)))}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Tanggal Lomba */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Tanggal Lomba</label>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Buat Tabel
      </button>
    </form>
  );
}
