// src/pages/Peserta/OlahDataPeserta.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";

// UI Components
import Button from "@/component/ui/Buttons";
import Input from "@/component/ui/Input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/component/ui/Table";
import { Card, CardHeader, CardTitle, CardContent } from "@/component/ui/Card";

interface Peserta {
  id_pendaftaran: number;
  nama: string;
  kategori: string;
  platNumber: string;
  community: string;
  id_lomba: number;
  batch?: number;
  point1?: number;
  point2?: number;
  totalPoint?: number;
  rank?: number;
  gate1?: number;
  gate2?: number | null;
  localId?: number;
}

interface Lomba {
  id: number;
  nama: string;
  tanggal: string;
  jumlahPeserta: number;
  biaya: number;
  kategori: string;
  jumlahBatch: number;
}

export default function OlahDataPeserta() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [batchPeserta, setBatchPeserta] = useState<Peserta[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jumlahBatch, setJumlahBatch] = useState<number>(1);

  useEffect(() => {
    const fetchPeserta = async () => {
      try {
        if (!id) return;
        const lombaRes = await api.get<Lomba>(`/lomba/${id}`);
        setJumlahBatch(lombaRes.data.jumlahBatch || 1);

        const res = await api.get<Peserta[]>(`/lomba/${id}/peserta`);
        const data: Peserta[] = (res.data ?? []).map((p: any) => ({
          id_pendaftaran: p.id_pendaftaran,
          nama: p.nama,
          kategori: p.kategori,
          platNumber: p.platNumber,
          community: p.community,
          id_lomba: p.lomba?.id ?? p.id_lomba,
          point1: p.point1 ?? 0,
          point2: p.point2 ?? 0,
          batch: p.batch,
          totalPoint: (p.point1 ?? 0) + (p.point2 ?? 0),
        }));

        setPeserta(data);

        const batchSize = Math.ceil(data.length / (lombaRes.data.jumlahBatch || 1));
        const emptyBatches: Peserta[][] = Array.from(
          { length: lombaRes.data.jumlahBatch },
          (_, idx) =>
            Array.from({ length: batchSize }, () => ({
              id_pendaftaran: 0,
              nama: "",
              kategori: "",
              platNumber: "",
              community: "",
              id_lomba: Number(id),
              batch: idx + 1,
              point1: 0,
              point2: 0,
              totalPoint: 0,
            }))
        );

        data.forEach((p) => {
          if (p.batch) {
            const batchIdx = p.batch - 1;
            const emptySlot = emptyBatches[batchIdx].findIndex(
              (slot) => slot.id_pendaftaran === 0
            );
            if (emptySlot !== -1) {
              emptyBatches[batchIdx][emptySlot] = p;
            }
          }
        });

        setBatchPeserta(emptyBatches);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data peserta");
      } finally {
        setLoading(false);
      }
    };

    fetchPeserta();
  }, [id]);

  const generateGates = (n: number) =>
    Array.from({ length: n }, (_, i) => {
      const gate1 = i + 1;
      const gate2 = n > 1 ? ((i + n / 2) % n) + 1 : null;
      return { gate1, gate2 };
    });

  const rankPeserta = (list: Peserta[]) => {
    const gates = generateGates(list.length);
    const withGate = list.map((p, i) => ({
      ...p,
      localId: i + 1,
      gate1: gates[i].gate1,
      gate2: gates[i].gate2 !== null ? Math.floor(gates[i].gate2) : null,
    }));
    const withTotal = withGate.map((p) => ({
      ...p,
      totalPoint: (p.point1 ?? 0) + (p.point2 ?? 0),
    }));
    const sorted = [...withTotal].sort((a, b) => a.totalPoint! - b.totalPoint!);

    return withTotal.map((p) => ({
      ...p,
      rank: sorted.findIndex((s) => s.localId === p.localId) + 1,
    }));
  };

  const handlePlatChange = (batchIdx: number, localIdx: number, value: string) => {
    setBatchPeserta((prev) => {
      const updated = [...prev];
      const batch = [...updated[batchIdx]];
      const found = peserta.find((ps) => ps.platNumber === value);

      batch[localIdx] = {
        ...batch[localIdx],
        id_pendaftaran: found ? found.id_pendaftaran : 0,
        platNumber: value,
        nama: found ? found.nama : "",
        community: found ? found.community : "",
        point1: found ? found.point1 ?? 0 : 0,
        point2: found ? found.point2 ?? 0 : 0,
        totalPoint: found ? (found.point1 ?? 0) + (found.point2 ?? 0) : 0,
      };

      updated[batchIdx] = batch;
      return updated;
    });
  };

  const handleSimpan = async () => {
    try {
      for (let i = 0; i < batchPeserta.length; i++) {
        const pesertaIds = batchPeserta[i]
          .filter((p) => p.id_pendaftaran !== 0)
          .map((p) => p.id_pendaftaran);

        if (pesertaIds.length > 0) {
          await api.post(`/lomba/${id}/peserta/batch`, {
            batch: i + 1,
            pesertaIds,
          });
        }
      }
      alert("Semua batch berhasil disimpan!");
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Gagal menyimpan data batch!");
    }
  };

  if (loading) return <p className="text-text-light">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="p-6 space-y-8 font-poppins">
      <h1 className="text-2xl font-bold text-text-light">Olah Data Pertandingan</h1>

      {batchPeserta.map((batch, i) => {
        const batchRanked = rankPeserta(batch);
        return (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Batch {i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gate 1</TableHead>
                    <TableHead>Gate 2</TableHead>
                    <TableHead>Plat</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Community</TableHead>
                    <TableHead>Point1</TableHead>
                    <TableHead>Point2</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchRanked.map((p, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{p.gate1}</TableCell>
                      <TableCell>{p.gate2}</TableCell>
                      <TableCell>
                        <Input
                          value={p.platNumber}
                          onChange={(e) => handlePlatChange(i, idx, e.target.value)}
                          size="sm"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>{p.nama}</TableCell>
                      <TableCell>{p.community}</TableCell>
                      <TableCell>{p.point1}</TableCell>
                      <TableCell>{p.point2}</TableCell>
                      <TableCell>{p.totalPoint}</TableCell>
                      <TableCell>{p.rank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex justify-center mt-6 space-x-4">
        <Button onClick={handleSimpan} variant="primary">
          Simpan Data Batch
        </Button>
        <Button onClick={() => navigate(`/inputhasillomba/moto1/${id}`)} variant="success">
          Input Hasil Lomba Moto 1
        </Button>
        <Button onClick={() => navigate(`/inputhasillomba/moto2/${id}`)} variant="secondary">
          Input Hasil Lomba Moto 2
        </Button>
        <Button onClick={() => navigate(`/sesilanjutanlomba/${id}`)} variant="warning">
          Lanjutkan Sesi Lomba
        </Button>
      </div>
    </div>
  );
}
