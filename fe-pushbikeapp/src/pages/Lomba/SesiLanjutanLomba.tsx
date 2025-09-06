/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";

interface Peserta {
  community: any;
  gate2: number;
  gate1: number;
  id_pendaftaran?: number;
  batch: number;
  gateMoto1: number;
  gateMoto2: number;
  platNumber: string;
  nama: string;
  team: string;
  point1: number;
  point2: number;
  penaltyPoint?: number;
  totalPoint: number;
  finish: number | null;
}

export default function PertandinganLanjutan() {
  const { id:lombaId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [matchesUtama, setMatchesUtama] = useState<Peserta[][]>([]);
  const [matchesSekunder, setMatchesSekunder] = useState<Peserta[][]>([]);
  const [loading, setLoading] = useState(true);
  const [showPenalty, setShowPenalty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!lombaId) return;
        const res = await api.get<Peserta[]>(`/lomba/${lombaId}/peserta`);
        const allPeserta: Peserta[] = (res.data ?? []).map(p => ({
          id_pendaftaran: p.id_pendaftaran,
          batch: p.batch!,
          gateMoto1: p.gate1 ?? 0,
          gateMoto2: p.gate2 ?? 0,
          platNumber: p.platNumber,
          nama: p.nama,
          team: p.community,
          point1: p.point1 ?? 0,
          point2: p.point2 ?? 0,
          penaltyPoint: 0,
          totalPoint: (p.point1 ?? 0) + (p.point2 ?? 0),
          finish: p.pointSesi?.find((s: any) => s.sesi === 1)?.finish ?? null,
        }));

        const batches = Array.from(new Set(allPeserta.map(p => p.batch))).sort((a,b)=>a-b);
        const batchCount = batches.length;

        // pisahkan peserta utama dan sekunder
        const utama: Peserta[] = [];
        const sekunder: Peserta[] = [];
        batches.forEach(batchNum => {
          const batchPeserta = allPeserta.filter(p => p.batch === batchNum);
          batchPeserta.sort((a,b)=>a.totalPoint - b.totalPoint);
          const half = Math.floor(batchPeserta.length / 2);
          utama.push(...batchPeserta.slice(0, half));
          sekunder.push(...batchPeserta.slice(half));
        });

        const buatMatch = (pesertaArray: Peserta[], batchCount: number) => {
          const matches: Peserta[][] = [];
          const halfBatch = Math.ceil(batchCount / 2);

          for (let i = 0; i < halfBatch; i++) {
            const match: Peserta[] = [];
            const batchA = pesertaArray.filter(p => p.batch === batches[i]);
            const batchB = pesertaArray.filter(p => batches[i + halfBatch] && p.batch === batches[i + halfBatch]);
            const maxLen = Math.max(batchA.length, batchB.length);
            for (let j = 0; j < maxLen; j++) {
              if (batchA[j]) match.push(batchA[j]);
              if (batchB[j]) match.push(batchB[j]);
            }
            matches.push(match);
          }

          return matches;
        };

        setMatchesUtama(buatMatch(utama, batchCount));
        setMatchesSekunder(buatMatch(sekunder, batchCount));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lombaId]);

  if (loading) return <p className="text-white">Loading...</p>;

  const handleFinishChange = (matchType: "Utama" | "Sekunder", matchIndex: number, pesertaIndex: number, value: string) => {
    const numberValue = value === "" ? null : Number(value);
    if(matchType === "Utama") {
      const newMatches = [...matchesUtama];
      newMatches[matchIndex][pesertaIndex] = {
        ...newMatches[matchIndex][pesertaIndex],
        finish: numberValue
      };
      setMatchesUtama(newMatches);
    } else {
      const newMatches = [...matchesSekunder];
      newMatches[matchIndex][pesertaIndex] = {
        ...newMatches[matchIndex][pesertaIndex],
        finish: numberValue
      };
      setMatchesSekunder(newMatches);
    }
  };

  const handlePenaltyChange = (matchType: "Utama" | "Sekunder", matchIndex: number, pesertaIndex: number, value: string) => {
    const numberValue = Number(value) || 0;
    if(matchType === "Utama") {
      const newMatches = [...matchesUtama];
      const p = newMatches[matchIndex][pesertaIndex];
      p.penaltyPoint = numberValue;
      p.totalPoint = (p.point1 ?? 0) + (p.point2 ?? 0) + numberValue;
      setMatchesUtama(newMatches);
    } else {
      const newMatches = [...matchesSekunder];
      const p = newMatches[matchIndex][pesertaIndex];
      p.penaltyPoint = numberValue;
      p.totalPoint = (p.point1 ?? 0) + (p.point2 ?? 0) + numberValue;
      setMatchesSekunder(newMatches);
    }
  };

  const handleSaveFinish = async () => {
    try {
      const pesertaList = [...matchesUtama.flat(), ...matchesSekunder.flat()];

      const dataToSend = pesertaList
        .filter(p => p.finish !== undefined && p.finish !== null)
        .map(p => ({
          pesertaId: Number(p.id_pendaftaran),
          sesi: 1,
          finish: Number(p.finish),
          penaltyPoint: p.penaltyPoint ?? 0
        }));

      if(dataToSend.length === 0) {
        alert("Tidak ada data finish yang diisi");
        return;
      }

      // gunakan endpoint yang sesuai controller
      await api.post(`/lomba/${lombaId}/hasil`, { peserta: dataToSend });

      alert("Data finish berhasil disimpan dan diupdate!");
    } catch(err) {
      console.error(err);
      alert("Gagal menyimpan data finish");
    }
  };

  const renderMatchTable = (match: Peserta[], matchIndex: number, sesi: string) => (
    <div key={`${sesi}-${matchIndex}`} className="bg-gray-800 p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold text-cyan-400">Match {matchIndex + 1} - {sesi}</h2>
      <table className="w-full border-collapse border border-gray-500 mt-2 text-white">
        <thead>
          <tr>
            <th className="border p-2">Gate Start</th>
            <th className="border p-2">Finish</th>
            {showPenalty && <th className="border p-2">Penalty Point</th>}
            <th className="border p-2">Nomor Plat</th>
            <th className="border p-2">Nama Rider</th>
            <th className="border p-2">Nama Team</th>
          </tr>
        </thead>
        <tbody>
          {match.map((p, idx) => (
            <tr key={idx}>
              <td className="border p-2">{idx + 1}</td>
              <td className="border p-2">
                <input
                  type="number"
                  className="w-full text-black p-1 rounded"
                  value={p.finish ?? ""}
                  onChange={(e) =>
                    handleFinishChange(sesi === "Utama" ? "Utama" : "Sekunder", matchIndex, idx, e.target.value)
                  }
                />
              </td>
              {showPenalty && (
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-full text-black p-1 rounded"
                    value={p.penaltyPoint ?? 0}
                    onChange={(e) =>
                      handlePenaltyChange(sesi === "Utama" ? "Utama" : "Sekunder", matchIndex, idx, e.target.value)
                    }
                  />
                </td>
              )}
              <td className="border p-2">{p.platNumber}</td>
              <td className="border p-2">{p.nama}</td>
              <td className="border p-2">{p.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Pertandingan Lanjutan - Lomba {lombaId}</h1>

      {/* Render semua match tanpa tombol toggle */}
      {matchesUtama.map((match, idx) => renderMatchTable(match, idx, "Utama"))}
      {matchesSekunder.map((match, idx) => renderMatchTable(match, idx, "Sekunder"))}

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handleSaveFinish}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
        >
          Simpan Finish
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
        >
          Kembali ke Dashboard
        </button>

        <button
          onClick={() => navigate(`/sesilanjutanlomba2/${lombaId}`)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
        >
          Lanjutkan Sesi Lomba
        </button>
      </div>
    </div>
  );
}
