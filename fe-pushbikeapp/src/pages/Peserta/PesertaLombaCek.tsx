import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";

// UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/component/ui/Card";
import Button from "@/component/ui/Buttons";
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
  statusPembayaran: boolean;
};

type LombaType = {
  id: number;
  nama: string;
};

export default function PesertaLombaCek() {
  const { id } = useParams<{ id: string }>();
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [lombaNama, setLombaNama] = useState<string>("");
  const navigate = useNavigate();

  // Fetch peserta
  const fetchPeserta = async () => {
    try {
      const res = await api.get(`/lomba/${id}/peserta`);
      const data: Peserta[] = res.data || [];
      setPesertaList(data);

      // sync checkbox sesuai DB
      const initialSelected: Record<number, boolean> = {};
      data.forEach((p) => {
        initialSelected[p.id_pendaftaran] = p.statusPembayaran;
      });
      setSelected(initialSelected);
    } catch (err) {
      console.error("Gagal fetch peserta:", err);
    }
  };

  // Fetch nama lomba
  const fetchLomba = async () => {
    try {
      const res = await api.get<LombaType>(`/lomba/${id}`);
      setLombaNama(res.data.nama);
    } catch (err) {
      console.error("Gagal fetch lomba:", err);
      setLombaNama(`Lomba ID ${id}`);
    }
  };

  useEffect(() => {
    fetchPeserta();
    fetchLomba();
  }, [id]);

  const toggleSelect = (pesertaId: number, checked: boolean) => {
    setSelected((prev) => ({
      ...prev,
      [pesertaId]: checked,
    }));
  };

  const toggleAll = () => {
    const allChecked = pesertaList.every(
      (p) => selected[p.id_pendaftaran] ?? p.statusPembayaran
    );
    const newSelected: Record<number, boolean> = {};
    pesertaList.forEach((p) => {
      newSelected[p.id_pendaftaran] = !allChecked;
    });
    setSelected(newSelected);
  };

  const handleSave = async () => {
    const confirmSave = window.confirm(
      "Apakah Anda yakin ingin menyimpan perubahan status pembayaran?"
    );
    if (!confirmSave) return;

    try {
      for (const peserta of pesertaList) {
        const checked =
          selected[peserta.id_pendaftaran] ?? peserta.statusPembayaran;
        await api.patch(
          `/lomba/${id}/peserta/${peserta.id_pendaftaran}/status`,
          {
            statusPembayaran: checked,
          }
        );
      }

      alert("Status pembayaran berhasil diperbarui ✅");
      fetchPeserta();
    } catch (err) {
      console.error("Gagal simpan status:", err);
      alert("Gagal menyimpan perubahan ❌");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen font-poppins">
      <Card className="bg-base-card border border-border-accent/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-accent text-center text-2xl">
            Peserta Lomba: {lombaNama}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex justify-end mb-4">
            {pesertaList.length > 0 && (
              <Button
                variant="secondary"
                onClick={toggleAll}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Toggle Semua
              </Button>
            )}
          </div>

          {pesertaList.length === 0 ? (
            <p className="text-center text-text-light py-6">
              Belum ada peserta
            </p>
          ) : (
            <Table>
              <TableHeader className="bg-accent text-base-dark">
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Plat</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pesertaList.map((p, index) => (
                  <TableRow
                    key={p.id_pendaftaran}
                    className="hover:bg-accent/20 transition"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{p.nama}</TableCell>
                    <TableCell>{p.platNumber}</TableCell>
                    <TableCell>{p.community}</TableCell>
                    <TableCell>{p.kategori}</TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        className="w-6 h-6 accent-accent"
                        checked={
                          selected[p.id_pendaftaran] ?? p.statusPembayaran
                        }
                        onChange={(e) =>
                          toggleSelect(p.id_pendaftaran, e.target.checked)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="mt-6 flex justify-between">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              ← Kembali
            </Button>
            {pesertaList.length > 0 && (
              <Button
                variant="success"
                onClick={handleSave}
                className="px-6 shadow"
              >
                Simpan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
