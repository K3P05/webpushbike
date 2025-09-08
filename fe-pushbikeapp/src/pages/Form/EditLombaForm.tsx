/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/EditLombaModal.tsx
import { useState, useEffect } from "react";
import { updateLomba, type Kategori } from "@/services/lomba";
import Button from "@/component/ui/Buttons";
import Input from "@/component/ui/Input";
import Select from "@/component/ui/Select";

interface EditLombaModalProps {
  lomba: {
    id: number;
    nama: string;
    tanggal: string;
    jumlahPeserta: number;
    jumlahBatch?: number;
    biaya: number;
    kategori: Kategori;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditLombaModal({ lomba, onClose, onSuccess }: EditLombaModalProps) {
  const [form, setForm] = useState({
    nama: "",
    tanggal: "",
    jumlahPeserta: 1,
    jumlahBatch: 1,
    biaya: 0,
    kategori: "boy" as Kategori,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lomba) {
      setForm({
        nama: lomba.nama,
        tanggal: lomba.tanggal.split("T")[0],
        jumlahPeserta: lomba.jumlahPeserta,
        jumlahBatch: lomba.jumlahBatch ?? 1,
        biaya: lomba.biaya,
        kategori: lomba.kategori,
      });
    }
  }, [lomba]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "kategori"
          ? (value as Kategori)
          : ["jumlahPeserta", "biaya", "jumlahBatch"].includes(name)
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateLomba(lomba.id, { ...form });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Gagal update lomba:", err);
      setError(err?.response?.data?.message || "Gagal update lomba");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 font-poppins">
      <div className="bg-base-dark text-textlight rounded-2xl shadow-2xl w-full max-w-md p-6 border border-accent/40">
        <h2 className="text-2xl font-bold mb-4 text-center text-accent">
          Edit Lomba
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {Array.isArray(error) ? error.join(", ") : error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nama Lomba</label>
            <Input name="nama" value={form.nama} onChange={handleChange} required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Tanggal</label>
            <Input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Jumlah Peserta</label>
            <Input
              type="number"
              name="jumlahPeserta"
              value={form.jumlahPeserta}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Jumlah Batch</label>
            <Input
              type="number"
              name="jumlahBatch"
              value={form.jumlahBatch}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Harga Pendaftaran (Rp)</label>
            <Input
              type="number"
              name="biaya"
              value={form.biaya}
              onChange={handleChange}
              min={0}
              required
            />
          </div>

          <div>
            {/* pakai Select custom agar konsisten */}
            <Select label="Kategori" name="kategori" value={form.kategori} onChange={handleChange}>
              <option value="boy">Boy</option>
              <option value="girl">Girl</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              // variant prop akan diabaikan kalau Buttons component sederhana; sesuaikan jika ada variant
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
