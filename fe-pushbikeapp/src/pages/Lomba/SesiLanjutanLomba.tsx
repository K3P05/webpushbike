/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/component/ui/Table";
import { Card, CardHeader, CardContent } from "@/component/ui/Card";
import Button from "@/component/ui/Buttons";
import Input from "@/component/ui/Input";

interface Peserta {
  pointSesi: any;
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
  point: number;         // point dari sesi ini
  penaltyPoint?: number; // penalty khusus sesi ini
  totalPoint: number;    // hasil gabungan (digunakan sebagai rank)
  finish: number | null;
}

export default function PertandinganLanjutan() {
  const { id: lombaId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [matchesUtama, setMatchesUtama] = useState<Peserta[][]>([]);
  const [matchesSekunder, setMatchesSekunder] = useState<Peserta[][]>([]);
  const [loading, setLoading] = useState(true);
  const [showPenalty, setShowPenalty] = useState(false);
  const [matchNames, setMatchNames] = useState<Record<string, string>>({});

  // sementara: hardcode sesi 1
  const currentSesi = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!lombaId) return;
        const res = await api.get(`/lomba/${lombaId}/peserta`);
        console.log("API response peserta:", res.data); 

        const allPeserta: Peserta[] = (res.data ?? []).map((p: any) => {
          const sesiData = p.pointSesi?.find((s: any) => s.sesi === currentSesi) || {};

          let computedTotal = 0;
          if (p.point1 !== undefined || p.point2 !== undefined) {
            computedTotal = Number(p.point1 ?? 0) + Number(p.point2 ?? 0);
          } else if (Array.isArray(p.pointSesi) && p.pointSesi.length > 0) {
            computedTotal = p.pointSesi.reduce((acc: number, s: any) => acc + Number(s.point ?? 0), 0);
          } else {
            computedTotal = Number(sesiData.point ?? 0);
          }

          return {
            id_pendaftaran: p.id_pendaftaran,
            batch: p.batch!,
            gateMoto1: p.gate1 ?? 0,
            gateMoto2: p.gate2 ?? 0,
            platNumber: p.platNumber,
            nama: p.nama,
            team: p.community,
            point: Number(sesiData.point ?? 0),
            penaltyPoint: Number(sesiData.penalty_point ?? 0),
            totalPoint: computedTotal,
            finish: sesiData.finish ?? null,
            pointSesi: p.pointSesi ?? [],
          };
        });

        const batches = Array.from(new Set(allPeserta.map((p) => p.batch))).sort((a, b) => a - b);
        const batchCount = batches.length;

        const utama: Peserta[] = [];
        const sekunder: Peserta[] = [];

        batches.forEach((batchNum) => {
          const batchPeserta = allPeserta.filter((p) => p.batch === batchNum);
          batchPeserta.sort((a, b) => (a.totalPoint ?? 0) - (b.totalPoint ?? 0));
          const half = Math.floor(batchPeserta.length / 2);
          utama.push(...batchPeserta.slice(0, half));
          sekunder.push(...batchPeserta.slice(half));
        });

        const buatMatch = (pesertaArray: Peserta[], batchCountLocal: number) => {
          const matches: Peserta[][] = [];
          const halfBatch = Math.ceil(batchCountLocal / 2);

          for (let i = 0; i < halfBatch; i++) {
            const match: Peserta[] = [];
            const batchA = pesertaArray.filter((p) => p.batch === batches[i]);
            const batchB = pesertaArray.filter((p) =>
              batches[i + halfBatch] ? p.batch === batches[i + halfBatch] : false
            );
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

        // isi initial matchNames dari pointSesi kalau ada
        const names: Record<string, string> = {};

        buatMatch(utama, batchCount).forEach((m, idx) => {
          const first = m[0];
          if (first) {
            const found = first.pointSesi?.find((s: any) => s.sesi === currentSesi)?.matchName;
            if (found) names[`Utama-${idx}`] = found;
          }
        });

        buatMatch(sekunder, batchCount).forEach((m, idx) => {
          const first = m[0];
          if (first) {
            const found = first.pointSesi?.find((s: any) => s.sesi === currentSesi)?.matchName;
            if (found) names[`Sekunder-${idx}`] = found;
          }
        });

        console.log("Initial matchNames dari DB:", names); 

        setMatchNames(names);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lombaId]);

  if (loading) return <p className="text-white">Loading...</p>;

  const handleFinishChange = (
    matchType: "Utama" | "Sekunder",
    matchIndex: number,
    pesertaIndex: number,
    value: string
  ) => {
    const numberValue = value === "" ? null : Number(value);
    if (matchType === "Utama") {
      const newMatches = [...matchesUtama];
      newMatches[matchIndex][pesertaIndex] = {
        ...newMatches[matchIndex][pesertaIndex],
        finish: numberValue,
      };
      setMatchesUtama(newMatches);
    } else {
      const newMatches = [...matchesSekunder];
      newMatches[matchIndex][pesertaIndex] = {
        ...newMatches[matchIndex][pesertaIndex],
        finish: numberValue,
      };
      setMatchesSekunder(newMatches);
    }
  };

  const handlePenaltyChange = (
    matchType: "Utama" | "Sekunder",
    matchIndex: number,
    pesertaIndex: number,
    value: string
  ) => {
    const numberValue = Number(value) || 0;
    if (matchType === "Utama") {
      const newMatches = [...matchesUtama];
      const p = newMatches[matchIndex][pesertaIndex];
      p.penaltyPoint = numberValue;
      if (currentSesi > 1) {
        p.totalPoint = (p.point ?? 0) + numberValue;
      } else {
        p.totalPoint = p.point ?? 0;
      }
      setMatchesUtama(newMatches);
    } else {
      const newMatches = [...matchesSekunder];
      const p = newMatches[matchIndex][pesertaIndex];
      p.penaltyPoint = numberValue;
      if (currentSesi > 1) {
        p.totalPoint = (p.point ?? 0) + numberValue;
      } else {
        p.totalPoint = p.point ?? 0;
      }
      setMatchesSekunder(newMatches);
    }
  };

  const handleSaveFinish = async () => {
    try {
      const pesertaList = [...matchesUtama.flat(), ...matchesSekunder.flat()];
      const dataToSend = pesertaList
        .filter((p) => p.finish !== undefined && p.finish !== null)
        .map((p) => ({
          pesertaId: Number(p.id_pendaftaran),
          sesi: currentSesi,
          finish: Number(p.finish),
          penaltyPoint: p.penaltyPoint ?? 0,
        }));

      if (dataToSend.length === 0) {
        alert("Tidak ada data finish yang diisi");
        return;
      }

      await api.post(`/lomba/${lombaId}/peserta/hasil-sesi`, { data: dataToSend });
      alert("Data finish berhasil disimpan dan diupdate!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data finish");
    }
  };

  const handleMatchNameChange = async (
    sesi: string,
    matchIndex: number,
    value: string
  ) => {
    try {
      const pesertaList =
        sesi === "Utama" ? matchesUtama[matchIndex] : matchesSekunder[matchIndex];
      if (!pesertaList || pesertaList.length === 0) return;

      setMatchNames((prev) => ({
        ...prev,
        [`${sesi}-${matchIndex}`]: value, // ✅ tambahkan prefix sesi
      }));

      await Promise.all(
        pesertaList.map((p) =>
          api.post(`/lomba/${lombaId}/peserta/match/name`, {
            pesertaId: p.id_pendaftaran,
            sesi: currentSesi,
            matchName: value,
          })
        )
      );
    } catch (err) {
      console.error("Gagal update match name", err);
      alert("Gagal update nama match");
    }
  };

    const renderMatchTable = (match: Peserta[], matchIndex: number, sesi: string) => (
      <Card key={`${sesi}-${matchIndex}`} className="mb-6">
        <CardHeader className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-accent hidden">
            Match {matchIndex + 1} - {sesi}
          </h2>
          <Input
            type="text"
            placeholder="Nama Match..."
            size="md"
            value={matchNames[`${sesi}-${matchIndex}`] ?? ""}
            onChange={(e) =>
              handleMatchNameChange(sesi, matchIndex, e.target.value)
            }
          />
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">Gate</TableHead>
                <TableHead className="w-20 text-center">Finish</TableHead>
                <TableHead className="w-20 text-center">Plat</TableHead>
                <TableHead className="w-32">Nama Rider</TableHead>
                <TableHead className="w-32">Team</TableHead>
                {showPenalty && <TableHead className="w-24 text-center">Penalty</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {match.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-center">{idx + 1}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      size="sm"
                      className="text-center"
                      value={p.finish ?? ""}
                      onChange={(e) =>
                        handleFinishChange(
                          sesi === "Utama" ? "Utama" : "Sekunder",
                          matchIndex,
                          idx,
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">{p.platNumber}</TableCell>
                  <TableCell>{p.nama}</TableCell>
                  <TableCell>{p.team}</TableCell>
                  {showPenalty && (
                    <TableCell>
                      <Input
                        type="number"
                        size="sm"
                        className="text-center"
                        value={p.penaltyPoint ?? 0}
                        onChange={(e) =>
                          handlePenaltyChange(
                            sesi === "Utama" ? "Utama" : "Sekunder",
                            matchIndex,
                            idx,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-textlight">Pertandingan Lanjutan</h1>

      <div className="flex justify-end mb-4">
        <Button
          variant="primary"
          onClick={() => setShowPenalty(!showPenalty)}
        >
          {showPenalty ? "Sembunyikan Penalty Point" : "Tampilkan Penalty Point"}
        </Button>
      </div>

      {matchesUtama.map((match, idx) => renderMatchTable(match, idx, "Utama"))}
      {matchesSekunder.map((match, idx) => renderMatchTable(match, idx, "Sekunder"))}

      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        <Button
          variant="secondary"
          onClick={handleSaveFinish}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          Simpan Finish
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate(`/admindashboard/olahdatapeserta/${lombaId}`)}
        >
          Kembali
        </Button>

        <Button
          variant="primary"
          onClick={() => navigate(`/final/${lombaId}`)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Lanjutkan Sesi Lomba
        </Button>
      </div>
    </div>
  );
}