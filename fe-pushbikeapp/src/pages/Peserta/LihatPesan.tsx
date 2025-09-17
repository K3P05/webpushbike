import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/component/ui/Card";
import Button from "@/component/ui/Buttons";

interface Pesan {
  id: number;
  nama: string;
  email: string;
  pesan: string;
  created_at: string;
}

export default function LihatPesan() {
  const [pesanList, setPesanList] = useState<Pesan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPesan = async () => {
      try {
        const res = await axios.get("http://localhost:3000/pesan");
        setPesanList(res.data ?? []);
      } catch (err) {
        console.error("Gagal ambil pesan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPesan();
  }, []);

  return (
    <div className="font-poppins px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-text-light">
          Daftar Pesan Masuk
        </h1>
        <Button variant="secondary" onClick={() => window.history.back()}>
          Kembali
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accent">Pesan Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-text-placeholder">
              Loading pesan...
            </p>
          ) : pesanList.length === 0 ? (
            <p className="text-center text-text-placeholder">
              Belum ada pesan.
            </p>
          ) : (
            <ul className="space-y-4">
              {pesanList.map((p) => (
                <li
                  key={p.id}
                  className="border border-border-accent rounded-lg p-4 bg-base-dark hover:bg-accent/10 transition"
                >
                  <p className="font-semibold text-accent">
                    {p.nama} <span className="text-text-placeholder">({p.email})</span>
                  </p>
                  <p className="mt-2">{p.pesan}</p>
                  <p className="text-sm text-text-placeholder mt-2">
                    {new Date(p.created_at).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
