/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";

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
  penaltyPoint?: number;
}

export default function PertandinganLanjutan2() {
  const { id: lombaId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matchesUtama, setMatchesUtama] = useState<PesertaSesi[][]>([]);
  const [matchesSekunder, setMatchesSekunder] = useState<PesertaSesi[][]>([]);
  const [showPenalty, setShowPenalty] = useState(false);
  const [showHasil, setShowHasil] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!lombaId) return;

        // Ambil semua peserta
        const resPeserta = await api.get<any[]>(`/lomba/${lombaId}/peserta`);
        const pesertaData = resPeserta.data.map(p => ({
          id_pendaftaran: p.id_pendaftaran,
          batch: p.batch,
          platNumber: p.platNumber,
          nama: p.nama,
          team: p.community ?? "",
          point1: p.point1 ?? 0,
          point2: p.point2 ?? 0,
          totalPoint: (p.point1 ?? 0) + (p.point2 ?? 0),
          finish: p.pointSesi?.find((s: any) => s.sesi === 2)?.finish ?? null,
          penaltyPoint: 0,
          gateMoto1: p.gateMoto1 ?? 0,
          gateMoto2: p.gateMoto2 ?? 0,
        }));

        // Struktur match dari sesi 1 agar sama persis
        const resSesi1 = await api.get<any[]>(`/lomba/${lombaId}/peserta`);
        const allPeserta1 = resSesi1.data.map((p: any) => ({
          id_pendaftaran: p.id_pendaftaran,
          batch: p.batch,
          point1: p.point1 ?? 0,
          point2: p.point2 ?? 0,
          totalPoint: (p.point1 ?? 0) + (p.point2 ?? 0),
          finish: p.pointSesi?.find((s: any) => s.sesi === 1)?.finish ?? null,
        }));

        const batches1 = Array.from(new Set(allPeserta1.map(p => p.batch))).sort((a,b)=>a-b);

        const utama1: PesertaSesi[] = [];
        const sekunder1: PesertaSesi[] = [];
        batches1.forEach(batchNum=>{
          const batchPeserta = allPeserta1.filter(p=>p.batch===batchNum);
          batchPeserta.sort((a,b)=>a.totalPoint - b.totalPoint);
          const half = Math.ceil(batchPeserta.length/2);
          utama1.push(...batchPeserta.slice(0, half));
          sekunder1.push(...batchPeserta.slice(half));
        });

        const buatMatchSesi1 = (arr: PesertaSesi[], batches: number[]) => {
          const matches: PesertaSesi[][] = [];
          const halfBatch = Math.ceil(batches.length / 2);
          for (let i=0;i<halfBatch;i++){
            const match: PesertaSesi[] = [];
            const batchA = arr.filter(p => p.batch === batches[i]);
            const batchB = arr.filter(p => batches[i+halfBatch] && p.batch === batches[i+halfBatch]);
            const maxLen = Math.max(batchA.length, batchB.length);
            for (let j=0;j<maxLen;j++){
              if(batchA[j]) match.push(batchA[j]);
              if(batchB[j]) match.push(batchB[j]);
            }
            matches.push(match);
          }
          return matches;
        };

        const matchesSesi1Utama = buatMatchSesi1(utama1, batches1);
        const matchesSesi1Sekunder = buatMatchSesi1(sekunder1, batches1);

        // Pisahkan peserta sesi 2 menjadi Utama & Sekunder
        const batches2 = Array.from(new Set(pesertaData.map(p => p.batch))).sort((a,b)=>a-b);
        const utama2: PesertaSesi[] = [];
        const sekunder2: PesertaSesi[] = [];
        batches2.forEach(batchNum=>{
          const batchPeserta = pesertaData.filter(p=>p.batch===batchNum);
          batchPeserta.sort((a,b)=>a.totalPoint - b.totalPoint);
          const half = Math.ceil(batchPeserta.length/2);
          utama2.push(...batchPeserta.slice(0, half));
          sekunder2.push(...batchPeserta.slice(half));
        });

        const buatMatchSesi2 = (arr: PesertaSesi[], struktur: number[]) => {
          const sorted = [...arr].sort((a,b)=> (a.finish ?? 999) - (b.finish ?? 999));
          const matches: PesertaSesi[][] = Array.from({length: struktur.length}, ()=>[]);
          let idx=0;
          sorted.forEach(p=>{
            let matchIndex = idx % struktur.length;
            while(matches[matchIndex].length >= struktur[matchIndex]){
              matchIndex = (matchIndex+1)%struktur.length;
            }
            matches[matchIndex].push(p);
            idx++;
          });
          return matches;
        };

        setMatchesUtama(buatMatchSesi2(utama2, matchesSesi1Utama.map(m=>m.length)));
        setMatchesSekunder(buatMatchSesi2(sekunder2, matchesSesi1Sekunder.map(m=>m.length)));

      } catch(err){
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lombaId]);

  if(loading) return <p className="text-white">Loading...</p>;

  const handleFinishChange = (matchType:"Utama"|"Sekunder", matchIndex:number, pesertaIndex:number, value:string)=>{
    const numberValue = value===""? null : Number(value);
    const updateMatches = (matches:PesertaSesi[][], setMatches:any)=>{
      const newMatches = [...matches];
      newMatches[matchIndex][pesertaIndex].finish = numberValue;
      setMatches(newMatches);
    };
    if(matchType==="Utama") updateMatches(matchesUtama, setMatchesUtama);
    else updateMatches(matchesSekunder, setMatchesSekunder);
  };

  const handlePenaltyChange = (matchType:"Utama"|"Sekunder", matchIndex:number, pesertaIndex:number, value:string)=>{
    const numberValue = Number(value)||0;
    const updateMatches = (matches:PesertaSesi[][], setMatches:any)=>{
      const newMatches = [...matches];
      const p = newMatches[matchIndex][pesertaIndex];
      p.penaltyPoint = numberValue;
      p.totalPoint = (p.point1??0)+(p.point2??0)+numberValue;
      setMatches(newMatches);
    };
    if(matchType==="Utama") updateMatches(matchesUtama, setMatchesUtama);
    else updateMatches(matchesSekunder, setMatchesSekunder);
  };

  const handleSaveFinish = async () => {
  try {
    const pesertaList = [...matchesUtama.flat(), ...matchesSekunder.flat()]
      .filter(p => p.finish !== null)
      .map(p => ({
        pesertaId: Number(p.id_pendaftaran),
        sesi: 2,
        finish: Number(p.finish),
        penaltyPoint: p.penaltyPoint ?? 0
      }));

    if (pesertaList.length === 0) return alert("Tidak ada data finish diisi");

    // POST untuk replace semua finish sesi 2
    await api.post(`/lomba/${lombaId}/peserta/pointsesi`, { data: pesertaList });

    alert("Data finish berhasil disimpan dan diupdate");
  } catch (err) {
    console.error(err);
    alert("Gagal menyimpan data finish");
  }
};


  const renderMatchTable = (match:PesertaSesi[], matchIndex:number, sesi:string)=>(
    <div key={`${sesi}-${matchIndex}`} className="bg-gray-800 p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold text-cyan-400">{sesi} - Match {matchIndex+1}</h2>
      <table className="w-full border-collapse border border-gray-500 mt-2 text-white">
        <thead>
          <tr>
            <th className="border p-2">Gate Start</th>
            <th className="border p-2">Finish</th>
            {showPenalty && <th className="border p-2">Penalty Point</th>}
            <th className="border p-2">Plat Number</th>
            <th className="border p-2">Nama Rider</th>
            <th className="border p-2">Team</th>
            <th className="border p-2">Total Point</th>
          </tr>
        </thead>
        <tbody>
          {match.map((p,idx)=>(
            <tr key={idx}>
              <td className="border p-2">{idx+1}</td>
              <td className="border p-2">
                <input type="number" className="w-full text-black p-1 rounded" value={p.finish??""}
                  onChange={e=>handleFinishChange(sesi==="Utama"?"Utama":"Sekunder",matchIndex,idx,e.target.value)} />
              </td>
              {showPenalty && <td className="border p-2">
                <input type="number" className="w-full text-black p-1 rounded" value={p.penaltyPoint??0}
                  onChange={e=>handlePenaltyChange(sesi==="Utama"?"Utama":"Sekunder",matchIndex,idx,e.target.value)} />
              </td>}
              <td className="border p-2">{p.platNumber}</td>
              <td className="border p-2">{p.nama}</td>
              <td className="border p-2">{p.team}</td>
              <td className="border p-2">{p.totalPoint}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const jumlahMatchUtama = matchesUtama.length;
  const jumlahMatchSekunder = matchesSekunder.length;

  // Hanya menampilkan finish pertama tiap match
  const renderHasilTable = (matches: PesertaSesi[][], title: string) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
    {matches.map((match, matchIndex) => {
      // Ambil peserta yang punya finish, urut berdasarkan finish
      const sortedMatch = match
        .filter(p => p.finish !== null)
        .sort((a, b) => (a.finish! - b.finish!));

      if (sortedMatch.length === 0) return null;

      return (
        <div key={`${title}-match-${matchIndex}`} className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-cyan-400">{title} - Match {matchIndex + 1}</h3>
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
              {sortedMatch.map((p, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{idx + 1}</td>
                  <td className="border p-2">{p.finish}</td>
                  <td className="border p-2">{p.platNumber}</td>
                  <td className="border p-2">{p.nama}</td>
                  <td className="border p-2">{p.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    })}
  </div>
);



  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Pertandingan Lanjutan Sesi 2 - Lomba {lombaId}</h1>

      <div className="flex space-x-4">
        <button onClick={()=>setShowPenalty(prev=>!prev)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
          {showPenalty ? "Sembunyikan Penalty" : "Tampilkan Penalty"}
        </button>

        {!showHasil && (jumlahMatchUtama<=2 && jumlahMatchSekunder<=2) &&
          <button onClick={()=>setShowHasil(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
            Tampilkan Hasil
          </button>
        }

        {showHasil &&
          <button onClick={()=>setShowHasil(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
            Sembunyikan Hasil
          </button>
        }
      </div>

      {showHasil && <>
        {renderHasilTable(matchesUtama,"Hasil Kategori Utama")}
        {renderHasilTable(matchesSekunder,"Hasil Kategori Sekunder")}
      </>}

      {!showHasil && <>
        <h2 className="text-lg text-green-400">Kategori Utama</h2>
        {matchesUtama.map((m,idx)=>renderMatchTable(m,idx,"Utama"))}
        <h2 className="text-lg text-yellow-400 mt-6">Kategori Sekunder</h2>
        {matchesSekunder.map((m,idx)=>renderMatchTable(m,idx,"Sekunder"))}
      </>}

      <div className="flex justify-center mt-6 space-x-4">
        <button onClick={handleSaveFinish} className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
          Simpan Finish
        </button>
        <button onClick={()=>navigate("/dashboard")} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
          Kembali ke Dashboard
        </button>
        {(jumlahMatchUtama>2 || jumlahMatchSekunder>2) &&
          <button onClick={()=>navigate(`/sesilanjutanlomba3/${lombaId}`)} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
            Lanjut Sesi Berikutnya
          </button>
        }
      </div>
    </div>
  );
}
