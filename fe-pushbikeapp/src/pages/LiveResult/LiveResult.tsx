// src/components/pages/LiveResult/ResultList.tsx
import { useEffect, useState, useMemo } from "react";
import type { UserType } from "@/types/users";

export default function LiveResult() {
  const [batches, setBatches] = useState<UserType[][]>([]);

  useEffect(() => {
    const data = localStorage.getItem("lombaData");
    if (data) setBatches(JSON.parse(data));
  }, []);

  // hitung rank tiap batch
  const processedBatches = useMemo(() => {
    return batches.map((batch) => {
      const withTotal = batch.map((u) => ({
        ...u,
        total: u.point1 + u.point2,
      }));
      return withTotal.sort((a, b) => a.total - b.total).map((u, idx) => ({
        ...u,
        rank: idx + 1,
      }));
    });
  }, [batches]);

  // semifinals: gabungkan pair of batches → ambil top 5
  const semifinals = useMemo(() => {
    const result: UserType[][] = [];
    for (let i = 0; i < processedBatches.length; i += 2) {
      const merged = [
        ...(processedBatches[i] || []),
        ...(processedBatches[i + 1] || []),
      ]
        .sort((a, b) => a.total - b.total)
        .slice(0, 5)
        .map((u, idx) => ({ ...u, rank: idx + 1 }));
      result.push(merged);
    }
    return result;
  }, [processedBatches]);

  // final: ambil semua semifinal → top 5
  const final = useMemo(() => {
    return semifinals
      .flat()
      .sort((a, b) => a.total - b.total)
      .slice(0, 5)
      .map((u, idx) => ({ ...u, rank: idx + 1 }));
  }, [semifinals]);

  const Table = ({ data, title }: { data: UserType[]; title: string }) => (
    <div className="w-full mt-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="overflow-x-auto rounded-lg shadow border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3 border">Nama Peserta</th>
              <th className="px-4 py-3 border">No Plat</th>
              <th className="px-4 py-3 border">Komunitas</th>
              <th className="px-4 py-3 border text-center">Point 1</th>
              <th className="px-4 py-3 border text-center">Point 2</th>
              <th className="px-4 py-3 border text-center">Total</th>
              <th className="px-4 py-3 border text-center">Rank</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((u) => (
                <tr key={u.id_pendaftaran} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{u.nama}</td>
                  <td className="px-4 py-2 border">{u.plat_number}</td>
                  <td className="px-4 py-2 border">{u.community}</td>
                  <td className="px-4 py-2 border text-center">{u.point1}</td>
                  <td className="px-4 py-2 border text-center">{u.point2}</td>
                  <td className="px-4 py-2 border text-center">{u.total}</td>
                  <td className="px-4 py-2 border text-center font-bold">{u.rank}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full p-6">
      <h2 className="text-xl font-bold mb-4">🏁 Live Race Result</h2>

      {processedBatches.map((batch, idx) => (
        <Table key={idx} data={batch} title={`Batch ${idx + 1}`} />
      ))}

      {semifinals.map((semi, idx) => (
        <Table key={`semi-${idx}`} data={semi} title={`Semifinal ${idx + 1} (Top 5)`} />
      ))}

      <Table data={final} title="Final (Top 5 dari semua semifinal)" />
    </div>
  );
}
