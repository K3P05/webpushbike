// src/pages/Form/TambahLombaForm.tsx
import { useState } from "react";
import { createLomba, type Kategori } from "@/services/lomba";
import { Card, CardHeader, CardContent } from "@/component/ui/Card";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Buttons";

interface TambahLombaModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TambahLombaModal({ onClose, onSuccess }: TambahLombaModalProps) {
  const [form, setForm] = useState({
    nama: "",
    tanggal: "",
    deskripsi: "",
    jumlahPeserta: 0,
    biaya: 0,
    kategori: "boy" as Kategori,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLomba(form);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-base-card text-text-light w-full">
      <CardHeader className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tambah Lomba</h2>
        <button
          onClick={onClose}
          className="text-text-light/70 hover:text-accent transition-colors"
        >
          ✖
        </button>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Lomba */}
          <Input
            label="Nama Lomba"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan nama lomba"
            required
          />

          {/* Tanggal */}
          <Input
            type="date"
            label="Tanggal"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            required
          />

          {/* Deskripsi */}
          <div>
            <label className="block text-sm mb-1 text-text-light">Deskripsi</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              className="w-full rounded-lg bg-base-dark border border-border-accent 
                         p-2 text-text-light placeholder-text-placeholder focus:ring-2 
                         focus:ring-accent-ring focus:outline-none"
              rows={3}
              placeholder="Tulis deskripsi lomba..."
            />
          </div>

          {/* Jumlah Peserta */}
          <Input
            type="number"
            label="Jumlah Peserta"
            name="jumlahPeserta"
            value={form.jumlahPeserta}
            onChange={handleChange}
            placeholder="0"
            required
          />

          {/* Biaya */}
          <Input
            type="number"
            label="Biaya"
            name="biaya"
            value={form.biaya}
            onChange={handleChange}
            placeholder="0"
            required
          />

          {/* Kategori */}
          <div>
            <label className="block text-sm mb-1 text-text-light">Kategori</label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full rounded-lg bg-base-dark border border-border-accent 
                         p-2 text-text-light focus:ring-2 focus:ring-accent-ring 
                         focus:outline-none"
            >
              <option value="boy">Boy</option>
              <option value="girl">Girl</option>
            </select>
          </div>

          {/* Action */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
