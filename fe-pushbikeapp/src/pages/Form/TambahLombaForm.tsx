// src/pages/Form/TambahLombaForm.tsx
import { useState } from "react";
import { Card } from "@/component/ui/Card";
import Input from "@/component/ui/Input";
import Buttons from "@/component/ui/Buttons";

type LombaFormProps = {
  onSubmit: (formData: {
    nama: string;
    tanggal: string;
    peserta: number;
    batch: number;
    harga: number;
    kategori: string;
  }) => void;
  onClose: () => void;
};

export default function TambahLombaForm({ onSubmit, onClose }: LombaFormProps) {
  const [formData, setFormData] = useState({
    nama: "",
    tanggal: "",
    peserta: 1,
    batch: 1,
    harga: 0,
    kategori: "Boy",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "peserta" || name === "batch" || name === "harga"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className="bg-base-card text-text-light rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in">
        <h2 className="text-center text-xl font-semibold mb-4">Tambah Lomba</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Lomba */}
          <div>
            <label className="block mb-1 text-sm">Nama Lomba</label>
            <Input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Nama Lomba"
            />
          </div>

          {/* Tanggal */}
          <div>
            <label className="block mb-1 text-sm">Tanggal</label>
            <Input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
            />
          </div>

          {/* Jumlah Peserta */}
          <div>
            <label className="block mb-1 text-sm">Jumlah Peserta</label>
            <Input
              type="number"
              name="peserta"
              min="1"
              value={formData.peserta}
              onChange={handleChange}
            />
          </div>

          {/* Jumlah Batch */}
          <div>
            <label className="block mb-1 text-sm">Jumlah Batch</label>
            <Input
              type="number"
              name="batch"
              min="1"
              value={formData.batch}
              onChange={handleChange}
            />
          </div>

          {/* Harga */}
          <div>
            <label className="block mb-1 text-sm">Harga Pendaftaran (Rp)</label>
            <Input
              type="number"
              name="harga"
              min="0"
              value={formData.harga}
              onChange={handleChange}
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block mb-1 text-sm">Kategori</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#00ADB5] bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            >
              <option value="Boy">Boy</option>
              <option value="Girl">Girl</option>
            </select>
          </div>

          {/* Tombol */}
          <div className="flex justify-end gap-2 pt-2">
            <Buttons type="button" variant="secondary" onClick={onClose}>
              Batal
            </Buttons>
            <Buttons type="submit" variant="primary">
              Simpan
            </Buttons>
          </div>
        </form>
      </Card>
    </div>
  );
}
