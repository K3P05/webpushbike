// src/pages/InputHasilLomba.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Card } from "@/component/ui/Card";
import Input from "@/component/ui/Input";
import Buttons from "@/component/ui/Buttons";

interface Peserta {
  id_pendaftaran: number;
  nama: string;
  kategori: string;
  platNumber: string;
  community: string;
  id_lomba: number;
  point1?: number;
  point2?: number;
  batch?: number;
  penaltyPoint?: number;
}

interface RowInput {
  platNumber: string;
  nama: string;
  community: string;
  point: number;
  finish: number;
  penalty: number;
}

export default function InputHasilLomba() {
  const { id, moto } = useParams<{ id: string; moto: string }>();
  const navigate = useNavigate();
  const [pesertaDb, setPesertaDb] = useState<Peserta[]>([]);
  const [batchData, setBatchData] = useState<RowInput[][]>([]);
  const [loading, setLoading] = useState(true);
  const [showPenalty, setShowPenalty] = useState(false);

  useEffect(() => {
    const fetchPeserta = async () => {
      try {
        const res = await api.get(`/lomba/${id}/peserta`);
        const data: Peserta[] = res.data ?? [];
        setPesertaDb(data);

        const batchesMap: Record<number, RowInput[]> = {};
        data.forEach((p) => {
          const pointValue = moto === "moto1" ? p.point1 ?? 0 : p.point2 ?? 0;
          const batchNum = p.batch || 1;
          if (!batchesMap[batchNum]) batchesMap[batchNum] = [];

          batchesMap[batchNum].push({
            platNumber: pointValue > 0 ? p.platNumber : "",
            nama: pointValue > 0 ? p.nama : "",
            community: pointValue > 0 ? p.community : "",
            point: pointValue,
            finish: 0,
            penalty: p.penaltyPoint ?? 0,
          });
        });

        const orderedBatches = Object.keys(batchesMap)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => {
            const batch = batchesMap[Number(key)];
            const withPoint = batch.filter((p) => p.point > 0);
            const noPoint = batch.filter((p) => p.point === 0);

            withPoint.sort((a, b) => a.point - b.point);
            const combined = [...withPoint, ...noPoint];
            combined.forEach((p, idx) => (p.finish = idx + 1));
            return combined;
          });

        setBatchData(orderedBatches);
      } catch (err) {
        console.error("Gagal ambil peserta", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPeserta();
  }, [id, moto]);

  if (loading) return <p className="text-textlight font-poppins">Loading...</p>;

  const handlePlatChange = (batchIndex: number, rowIndex: number, value: string) => {
    setBatchData((prev) => {
      const updated = [...prev];
      const rows = [...updated[batchIndex]];
      const found = pesertaDb.find((p) => p.platNumber === value);

      rows[rowIndex] = {
        ...rows[rowIndex],
        platNumber: value,
        nama: found?.nama || "",
        community: found?.community || "",
        point: found ? 1 : 0,
        penalty: found?.penaltyPoint ?? 0,
      };

      const withPoint = rows.filter((r) => r.point > 0);
      const noPoint = rows.filter((r) => r.point === 0);
      withPoint.sort((a, b) => a.point - b.point);
      const combined = [...withPoint, ...noPoint];
      combined.forEach((r, idx) => (r.finish = idx + 1));

      updated[batchIndex] = combined;
      return updated;
    });
  };

  const handlePenaltyChange = (batchIndex: number, rowIndex: number, value: number) => {
    setBatchData((prev) => {
      const updated = [...prev];
      const rows = [...updated[batchIndex]];
      rows[rowIndex] = { ...rows[rowIndex], penalty: value };
      updated[batchIndex] = rows;
      return updated;
    });
  };

  const handleSimpan = async () => {
    if (!id || !moto) return console.error("ID lomba atau moto tidak ditemukan!");
    try {
      const pesertaWithPoints = batchData.flatMap((batch) =>
        batch
          .filter((r) => r.platNumber)
          .map((r) => {
            const pesertaDbItem = pesertaDb.find((p) => p.platNumber === r.platNumber);
            return {
              id: pesertaDbItem?.id_pendaftaran,
              [`point${moto === "moto1" ? "1" : "2"}`]: r.finish + r.penalty,
              penaltyPoint: r.penalty,
            };
          })
      );

      await api.post(`/lomba/${id}/hasil`, {
        moto,
        peserta: pesertaWithPoints,
      });

      alert("✅ Hasil berhasil disimpan!");
    } catch (err) {
      console.error("Gagal simpan hasil", err);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen font-poppins">
      <h1 className="text-2xl md:text-3xl font-bold text-textlight border-b border-accent pb-2">
        Input Hasil Lomba {moto?.toUpperCase()} - Lomba {id}
      </h1>

      {batchData.map((rows, b) => {
        const pesertaBatchDb = pesertaDb.filter((p) => p.batch === b + 1);
        const maxLength = Math.max(rows.length, pesertaBatchDb.length);

        return (
          <div key={b} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tabel input */}
            <Card className="p-4">
              <h2 className="text-lg md:text-xl font-semibold text-accent mb-2">
                Batch {b + 1} - Input
              </h2>
              <table className="w-full border-collapse border border-accent text-sm md:text-base text-textlight table-fixed">
                <thead>
                  <tr className="bg-base-mid/60">
                    <th className="border border-accent p-2 w-20">Plat</th>
                    <th className="border border-accent p-2 w-40">Nama Rider</th>
                    <th className="border border-accent p-2 w-40">Community</th>
                    <th className="border border-accent p-2 w-20">Finish</th>
                    {showPenalty && <th className="border border-accent p-2 w-24">Penalty</th>}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: maxLength }).map((_, i) => {
                    const row = rows[i];
                    return (
                      <tr key={i} className="h-12 hover:bg-base-light/30">
                        {row ? (
                          <>
                            <td className="border border-accent p-2 align-middle">
                              <Input
                                type="text"
                                size="sm"
                                value={row.platNumber}
                                onChange={(e) => handlePlatChange(b, i, e.target.value)}
                                placeholder="Plat..."
                                className="text-center bg-accent/40 text-textlight placeholder-accent/40 border border-accent"
                              />
                            </td>
                            <td className="border border-accent p-2 align-middle">{row.nama}</td>
                            <td className="border border-accent p-2 align-middle">{row.community}</td>
                            <td className="border border-accent p-2 text-center align-middle">{row.finish}</td>
                            {showPenalty && (
                              <td className="border border-accent p-2 align-middle">
                                <Input
                                  type="number"
                                  size="sm"
                                  min={0}
                                  value={row.penalty}
                                  onChange={(e) => handlePenaltyChange(b, i, Number(e.target.value))}
                                  className="text-center bg-accent/40 text-textlight placeholder-accent/40 border border-accent"
                                />
                              </td>
                            )}
                          </>
                        ) : (
                          <td
                            colSpan={showPenalty ? 5 : 4}
                            className="border border-accent text-center text-gray-500 align-middle"
                          >
                            -
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>

            {/* Tabel referensi */}
            <Card className="p-4">
              <h2 className="text-lg md:text-xl font-semibold text-accent mb-2">
                Batch {b + 1} - Peserta (DB)
              </h2>
              <table className="w-full border-collapse border border-accent text-sm md:text-base text-textlight table-fixed">
                <thead>
                  <tr className="bg-base-mid/60">
                    <th className="border border-accent p-2 w-20">Plat</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: maxLength }).map((_, i) => {
                    const peserta = pesertaBatchDb[i];
                    return (
                      <tr key={i} className="h-12 hover:bg-base-light/30">
                        <td className="border border-accent p-2 text-center align-middle">
                          {peserta ? peserta.platNumber : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        );
      })}

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <Buttons onClick={() => setShowPenalty((prev) => !prev)}>
          {showPenalty ? "Sembunyikan Penalty" : "Tampilkan Penalty"}
        </Buttons>

        <Buttons onClick={handleSimpan}>Simpan Hasil</Buttons>

        <Buttons
          variant="secondary"
          onClick={() => navigate(`/admindashboard/olahdatapeserta/${id}`)}
        >
          Kembali
        </Buttons>
      </div>
    </div>
  );
}
