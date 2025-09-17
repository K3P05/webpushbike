// src/pages/Form/LombaForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/component/ui/Card";
import Input from "@/component/ui/Input";
import Buttons from "@/component/ui/Buttons";

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
  const [kategori, setKategori] = useState<
    "kualifikasi" | "semifinal" | "final"
  >("kualifikasi");
  const [batch, setBatch] = useState(1);
  const [peserta, setPeserta] = useState(1);
  const [tanggal, setTanggal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nama,
      kategori,
      batch: kategori === "kualifikasi" ? batch : null,
      peserta,
      tanggal,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins px-4">
      <Card className="w-full max-w-xl text-text-light">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Tambah Perlombaan</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lomba */}
            <div>
              <label className="block font-medium mb-1">Nama Lomba</label>
              <Input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lomba"
                required
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block font-medium mb-1">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as any)}
                className="w-full border border-border-accent rounded-lg px-3 py-2 bg-base-dark text-text-light focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="kualifikasi">Kualifikasi</option>
                <option value="semifinal">Semi Final</option>
                <option value="final">Final</option>
              </select>
            </div>

            {/* Jumlah Batch (hanya kualifikasi) */}
            {kategori === "kualifikasi" && (
              <div>
                <label className="block font-medium mb-1">Jumlah Batch</label>
                <Input
                  type="number"
                  min={1}
                  value={batch}
                  onChange={(e) =>
                    setBatch(Math.max(1, Number(e.target.value)))
                  }
                  required
                />
              </div>
            )}

            {/* Jumlah Peserta */}
            <div>
              <label className="block font-medium mb-1">Jumlah Peserta</label>
              <Input
                type="number"
                min={1}
                value={peserta}
                onChange={(e) =>
                  setPeserta(Math.max(1, Number(e.target.value)))
                }
                required
              />
            </div>

            {/* Tanggal Lomba */}
            <div>
              <label className="block font-medium mb-1">Tanggal Lomba</label>
              <Input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>

            <Buttons type="submit" variant="primary" className="w-full">
              Buat Tabel
            </Buttons>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
