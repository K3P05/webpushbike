import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api";

interface PesertaBatch {
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

interface PesertaSesi {
  id_pendaftaran?: number;
  batch: number;
  gateMoto1: number;
  gateMoto2: number;
  platNumber: string;
  nama: string;
  team: string;
  point1: number;
  point2: number;
  totalPoint: number;
  finish?: number | null;
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

export default function LiveHasil() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [batchPeserta, setBatchPeserta] = useState<PesertaBatch[][]>([]);
  const [sesi1Utama, setSesi1Utama] = useState<PesertaSesi[][]>([]);
  const [sesi1Sekunder, setSesi1Sekunder] = useState<PesertaSesi[][]>([]);
  const [sesi2Utama, setSesi2Utama] = useState<PesertaSesi[][]>([]);
  const [sesi2Sekunder, setSesi2Sekunder] = useState<PesertaSesi[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        /** ============ Batch Awal ============ **/
        const lombaRes = await api.get<Lomba>(`/lomba/${id}`);
        const resPeserta = await api.get<PesertaBatch[]>(`/lomba/${id}/peserta`);
        const pesertaData: PesertaBatch[] = (resPeserta.data ?? []).map((p: any) => ({
          id_pendaftaran: p.id_pendaftaran,
          nama: p.nama,
          kategori: p.kategori,
          platNumber: p.platNumber,
          community: p.community,
          id_lomba: p.lomba?.id ?? p.id_lomba,
          batch: p.batch,
          point1: p.point1 ?? 0,
          point2: p.point2 ?? 0,
          totalPoint: (p.point1 ?? 0) + (p.point2 ?? 0),
        }));

        const batchSize = Math.ceil(pesertaData.length / (lombaRes.data.jumlahBatch || 1));
        const emptyBatches: PesertaBatch[][] = Array.from({ length: lombaRes.data.jumlahBatch }, (_, idx) =>
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

        pesertaData.forEach(p => {
          if (p.batch) {
            const batchIdx = p.batch - 1;
            const emptySlot = emptyBatches[batchIdx].findIndex(slot => slot.id_pendaftaran === 0);
            if (emptySlot !== -1) emptyBatches[batchIdx][emptySlot] = p;
          }
        });

        // === Generate gate1 & gate2 untuk setiap batch ===
        const generateGates = (n: number) =>
          Array.from({ length: n }, (_, i) => {
            const gate1 = i + 1;
            const gate2 = n > 1 ? ((i + n / 2) % n) + 1 : null;
            return { gate1, gate2 };
          });

        emptyBatches.forEach(batch => {
          const gates = generateGates(batch.length);
          batch.forEach((p, idx) => {
            p.gate1 = gates[idx].gate1;
            p.gate2 = gates[idx].gate2;
          });
        });

        setBatchPeserta(emptyBatches);

        /** ============ Sesi 1 ============ **/
        const resSesi1 = await api.get<PesertaSesi[]>(`/lomba/${id}/peserta`);
        const allPeserta1 = (resSesi1.data ?? []).map((p: any) => ({
          id_pendaftaran: p.id_pendaftaran,
          batch: p.batch,
          gateMoto1: p.gate1 ?? 0,
          gateMoto2: p.gate2 ?? 0,
          platNumber: p.platNumber,
          nama: p.nama,
          team: p.community ?? "",
          point1: p.point1 ?? 0,
          point2: p.point2 ?? 0,
          totalPoint: (p.point1 ?? 0) + (p.point2 ?? 0),
          finish: p.pointSesi?.find((s: any) => s.sesi === 1)?.finish ?? null,
        }));

        const batches1 = Array.from(new Set(allPeserta1.map(p => p.batch))).sort((a,b)=>a-b);
        const utama1: PesertaSesi[] = [];
        const sekunder1: PesertaSesi[] = [];
        batches1.forEach(batchNum => {
          const batchPeserta = allPeserta1.filter(p => p.batch === batchNum);
          batchPeserta.sort((a,b)=>a.totalPoint - b.totalPoint);
          const half = Math.floor(batchPeserta.length / 2);
          utama1.push(...batchPeserta.slice(0, half));
          sekunder1.push(...batchPeserta.slice(half));
        });

        const buatMatch1 = (arr: PesertaSesi[], batchesCount: number) => {
          const matches: PesertaSesi[][] = [];
          const halfBatch = Math.ceil(batchesCount / 2);
          for (let i = 0; i < halfBatch; i++) {
            const match: PesertaSesi[] = [];
            const batchA = arr.filter(p => p.batch === batches1[i]);
            const batchB = arr.filter(p => batches1[i + halfBatch] && p.batch === batches1[i + halfBatch]);
            const maxLen = Math.max(batchA.length, batchB.length);
            for (let j = 0; j < maxLen; j++) {
              if (batchA[j]) match.push(batchA[j]);
              if (batchB[j]) match.push(batchB[j]);
            }
            matches.push(match);
          }
          return matches;
        };

        // CHANGED: simpan hasil match sesi 1 ke variabel lokal, lalu set state
        const matchesSesi1Utama = buatMatch1(utama1, batches1.length);   // CHANGED
        const matchesSesi1Sekunder = buatMatch1(sekunder1, batches1.length); // CHANGED
        setSesi1Utama(matchesSesi1Utama);
        setSesi1Sekunder(matchesSesi1Sekunder);

        /** ============ Sesi 2 ============ **/
        const allPeserta2 = (resSesi1.data ?? []).map((p: any) => ({
          id_pendaftaran: p.id_pendaftaran,
          batch: p.batch,
          gateMoto1: p.gateMoto1,
          gateMoto2: p.gateMoto2,
          platNumber: p.platNumber,
          nama: p.nama,
          team: p.community ?? "",
          point1: p.point1 ?? 0,
          point2: p.point2 ?? 0,
          totalPoint: (p.point1 ?? 0) + (p.point2 ?? 0),
          finish: p.pointSesi?.find((s: any) => s.sesi === 2)?.finish ?? null,
        }));

        // pisahkan Utama & Sekunder seperti sesi 1
        const batches2 = Array.from(new Set(allPeserta2.map(p => p.batch))).sort((a, b) => a - b);
        const utama2: PesertaSesi[] = [];
        const sekunder2: PesertaSesi[] = [];

        batches2.forEach(batchNum => {
          const batchPeserta = allPeserta2.filter(p => p.batch === batchNum);
          batchPeserta.sort((a, b) => a.totalPoint - b.totalPoint);
          const half = Math.ceil(batchPeserta.length / 2);
          utama2.push(...batchPeserta.slice(0, half));
          sekunder2.push(...batchPeserta.slice(half));
        });

        // CHANGED: ambil struktur dari Sesi 1 (jumlah peserta per match)
        const strukturDariSesi1 = (matches: PesertaSesi[][]) => matches.map(m => m.length); // CHANGED
        const strukturUtama = strukturDariSesi1(matchesSesi1Utama);   // CHANGED
        const strukturSekunder = strukturDariSesi1(matchesSesi1Sekunder); // CHANGED

        // CHANGED: buat match Sesi 2 dengan struktur yang sama persis seperti Sesi 1
        // buat match sesi 2 sesuai struktur dari sesi 1
const buatMatch2DenganStruktur = (arr: PesertaSesi[], struktur: number[]) => {
  // urutkan berdasarkan finish (null dianggap besar)
  const sorted = [...arr].sort((a, b) => (a.finish ?? 999) - (b.finish ?? 999));

  // siapkan array matches sesuai struktur
  const matches: PesertaSesi[][] = Array.from({ length: struktur.length }, () => []);

  let index = 0;
  sorted.forEach((peserta) => {
    let matchIndex = index % struktur.length;

    // cari slot kosong sesuai struktur
    while (matches[matchIndex].length >= struktur[matchIndex]) {
      matchIndex = (matchIndex + 1) % struktur.length;
    }

    matches[matchIndex].push(peserta);
    index++;
  });

  return matches;
};


        setSesi2Utama(buatMatch2DenganStruktur(utama2, strukturUtama));       // CHANGED
        setSesi2Sekunder(buatMatch2DenganStruktur(sekunder2, strukturSekunder)); // CHANGED

      } catch(err:any) {
        console.error(err);
        setError("Gagal memuat data live hasil");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderBatchTable = (batch: PesertaBatch[], batchNumber: number) => {
    const batchRanked = batch.map((p,i) => ({
      ...p,
      rank: p.rank ?? i+1
    }));
    return (
      <div key={`batch-${batchNumber}`} className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-cyan-400">Batch {batchNumber}</h2>
        <table className="w-full border-collapse border border-gray-500 mt-2 text-white">
          <thead>
            <tr>
              <th className="border p-2">Gate 1</th>
              <th className="border p-2">Gate 2</th>
              <th className="border p-2">Plat Number</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Community</th>
              <th className="border p-2">Point1</th>
              <th className="border p-2">Point2</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Rank</th>
            </tr>
          </thead>
          <tbody>
            {batchRanked.map((p, idx) => (
              <tr key={idx}>
                <td className="border p-2">{p.gate1}</td>
                <td className="border p-2">{p.gate2}</td>
                <td className="border p-2">{p.platNumber}</td>
                <td className="border p-2">{p.nama}</td>
                <td className="border p-2">{p.community}</td>
                <td className="border p-2">{p.point1}</td>
                <td className="border p-2">{p.point2}</td>
                <td className="border p-2">{p.totalPoint}</td>
                <td className="border p-2">{p.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  };

  const renderSesiTable = (matches: PesertaSesi[][], title: string) =>
    matches.map((match, idx) => (
      <div key={`${title}-${idx}`} className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-cyan-400">{title} - Match {idx+1}</h2>
        <table className="w-full border-collapse border border-gray-500 mt-2 text-white">
          <thead>
            <tr>
              <th className="border p-2">Gate Start</th>
              <th className="border p-2">Finish</th>
              <th className="border p-2">Plat Number</th>
              <th className="border p-2">Nama Rider</th>
              <th className="border p-2">Team</th>
            </tr>
          </thead>
          <tbody>
            {match.map((p, i) => (
              <tr key={i}>
                <td className="border p-2">{i+1}</td>
                <td className="border p-2">{p.finish ?? "-"}</td>
                <td className="border p-2">{p.platNumber}</td>
                <td className="border p-2">{p.nama}</td>
                <td className="border p-2">{p.team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Live Hasil Lomba {id}</h1>

      <h2 className="text-lg text-blue-400 mt-4">Batch Awal</h2>
      {batchPeserta.map((batch, idx) => renderBatchTable(batch, idx+1))}

      <h2 className="text-lg text-green-400 mt-4">Sesi 1 - Utama</h2>
      {renderSesiTable(sesi1Utama, "Sesi 1 Utama")}

      <h2 className="text-lg text-yellow-400 mt-4">Sesi 1 - Sekunder</h2>
      {renderSesiTable(sesi1Sekunder, "Sesi 1 Sekunder")}

      <h2 className="text-lg text-purple-400 mt-4">Sesi 2 - Utama</h2>
      {renderSesiTable(sesi2Utama, "Sesi 2 Utama")}

      <h2 className="text-lg text-pink-400 mt-4">Sesi 2 - Sekunder</h2>
      {renderSesiTable(sesi2Sekunder, "Sesi 2 Sekunder")}
    </div>
  )
}
