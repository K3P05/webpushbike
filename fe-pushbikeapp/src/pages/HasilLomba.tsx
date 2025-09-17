// src/pages/ListHasil.tsx
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

type PesertaType = {
  id_pendaftaran: number;
  point1: number;
  point2: number;
};

export default function ListHasil() {
  const navigate = useNavigate();
  const [lombaList, setLombaList] = useState<LombaType[]>([]);
  const [lombaStatus, setLombaStatus] = useState<Record<number, boolean>>({});

  const fetchLomba = async () => {
    try {
      const res = await api.get<LombaType[]>("/lomba");
      setLombaList(res.data || []);

      const status: Record<number, boolean> = {};
      await Promise.all(
        (res.data || []).map(async (lomba) => {
          try {
            const pesertaRes = await api.get<PesertaType[]>(
              `/lomba/${lomba.id}/peserta`
            );
            const canClick = pesertaRes.data.some(
              (p) => (p.point1 || 0) > 0 || (p.point2 || 0) > 0
            );
            status[lomba.id] = canClick;
          } catch {
            status[lomba.id] = false;
          }
        })
      );

      setLombaStatus(status);
    } catch (err) {
      console.error("Gagal fetch lomba:", err);
    }
  };

  useEffect(() => {
    fetchLomba();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen font-poppins">
      <h1 className="text-3xl font-bold text-accent mb-6 text-center">
        Pilih Lomba untuk Melihat Hasil 🚴
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lombaList.map((lomba) => (
          <Card
            key={lomba.id}
            className="bg-base-card border-none text-text-light hover:shadow-lg transition"
          >
            <CardHeader>
              <CardTitle className="text-xl">{lomba.nama}</CardTitle>
              <p className="text-text-placeholder text-sm">
                {new Date(lomba.tanggal).toLocaleDateString()}
              </p>
              {lomba.kategori && (
                <span
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    lomba.kategori === "boy"
                      ? "bg-blue-900 text-blue-400"
                      : "bg-pink-900 text-pink-400"
                  }`}
                >
                  {lomba.kategori}
                </span>
              )}
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate(`/livehasil/${lomba.id}`)}
                disabled={!lombaStatus[lomba.id]}
                className={`w-full font-semibold ${
                  lombaStatus[lomba.id]
                    ? "bg-accent hover:bg-accent-hover"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                {lombaStatus[lomba.id] ? "Lihat Hasil" : "Lomba Belum Berjalan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
