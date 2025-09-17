// src/pages/Admin/KelolaLomba.tsx
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/component/ui/Card";
import Buttons from "@/component/ui/Buttons";

interface Lomba {
  id: number;
  nama: string;
  kategori: string;
  jumlahPeserta: number;
}

export default function KelolaLomba() {
  const [lombaList, setLombaList] = useState<Lomba[]>([]);
  const navigate = useNavigate();

  const fetchLomba = async () => {
    try {
      const res = await api.get("/lomba");
      setLombaList(res.data || []);
    } catch (err) {
      console.error("Gagal fetch lomba:", err);
    }
  };

  useEffect(() => {
    fetchLomba();
  }, []);

  return (
    <div className="min-h-screen font-poppins px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-text-light">
        Kelola Data Lomba
      </h1>

      {lombaList.length === 0 ? (
        <p className="text-text-light/70">Belum ada lomba yang dibuat.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lombaList.map((lomba) => (
            <Card key={lomba.id} className="flex flex-col justify-between">
              <CardHeader>
                <h2 className="text-xl font-semibold text-accent">
                  {lomba.nama}
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-text-light/80 text-sm mb-1">
                  Kategori: {lomba.kategori}
                </p>
                <p className="text-text-light/80 text-sm mb-4">
                  Jumlah Peserta: {lomba.jumlahPeserta}
                </p>

                <Buttons
                  variant="primary"
                  className="w-full"
                  onClick={() =>
                    navigate(`/admindashboard/kelolapeserta/${lomba.id}`)
                  }
                >
                  Kelola
                </Buttons>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
