/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/Peserta/KelolaPeserta.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import Button from "@/component/ui/Buttons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/component/ui/Card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/component/ui/Table";

type Peserta = {
  id_pendaftaran: number;
  nama: string;
  kategori: string;
  platNumber: string;
  community: string;
  id_lomba: number;
  statusPembayaran: boolean;
};

export default function KelolaPeserta() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPeserta = async () => {
    try {
      const res = await api.get(`/lomba/${id}/peserta`);
      const semuaPeserta: Peserta[] = res.data ?? [];
      const pesertaLunas = semuaPeserta.filter((p) => p.statusPembayaran === true);
      setPesertaList(pesertaLunas);
    } catch (err) {
      console.error("Gagal fetch peserta:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeserta();
  }, [id]);

  return (
    <div className="font-poppins px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-light">Kelola Peserta</h1>
        <Button
          variant="secondary"
          onClick={() => navigate("/admindashboard/kelolalomba")}
        >
          Kembali
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-text-light/70">Loading data peserta...</p>
      ) : pesertaList.length === 0 ? (
        <p className="text-text-light/70">
          Belum ada peserta yang sudah membayar untuk lomba ini.
        </p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Daftar Peserta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-base-mid text-text-light">
                    <TableHead>No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Plat Number</TableHead>
                    <TableHead>Community</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pesertaList.map((p, idx) => (
                    <TableRow
                      key={p.id_pendaftaran}
                      className="border-t border-border-accent hover:bg-accent/10"
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{p.nama}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium
                            ${
                              p.kategori === "boy"
                                ? "bg-kategori-boy-bg/30 text-kategori-boy-text"
                                : p.kategori === "girl"
                                ? "bg-kategori-girl-bg/30 text-kategori-girl-text"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                        >
                          {p.kategori}
                        </span>
                      </TableCell>
                      <TableCell>{p.platNumber}</TableCell>
                      <TableCell>{p.community}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                onClick={() => navigate(`/admindashboard/olahdatapeserta/${id}`)}
                className="bg-accent text-base-dark hover:bg-accent-hover"
              >
                Olah Data
              </Button>
              <Button
                variant="success"
                onClick={() => navigate(`/admindashboard/acakpeserta/${id}`)}
              >
                Acak Peserta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
