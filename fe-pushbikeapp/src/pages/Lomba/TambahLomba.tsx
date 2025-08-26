// src/components/pages/Lomba/TambahLomba.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LombaForm from "./LombaForm";
import type { UserType } from "@/types/users";

export default function TambahLomba() {
  const [formData, setFormData] = useState<any | null>(null);
  const [batches, setBatches] = useState<UserType[][]>([]);
  const [showPesertaForm, setShowPesertaForm] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmit = (data: any) => {
    setFormData(data);

    const jmlPeserta = Number(data.peserta);
    const jumlahBatch = data.kategori === "kualifikasi" ? Number(data.batch) : 1;

    const allBatches: UserType[][] = [];
    const base = Math.floor(jmlPeserta / jumlahBatch);
    const sisa = jmlPeserta % jumlahBatch;

    let pesertaId = 1;

    for (let b = 0; b < jumlahBatch; b++) {
      const sizeBatch = base + (b < sisa ? 1 : 0);
      const pesertaBatch: UserType[] = [];

      for (let i = 0; i < sizeBatch; i++) {
        pesertaBatch.push({
          id_pendaftaran: pesertaId,
          nama: `Peserta ${pesertaId}`,
          plat_number: "-",
          community: "-",
          point1: 0,
          point2: 0,
        });
        pesertaId++;
      }

      allBatches.push(pesertaBatch);
    }

    setBatches(allBatches);
  };

  const handlePesertaChange = (
    batchIdx: number,
    id: number,
    key: keyof UserType,
    value: string | number
  ) => {
    const updatedBatches = [...batches];
    updatedBatches[batchIdx] = updatedBatches[batchIdx].map((p) =>
      p.id_pendaftaran === id ? { ...p, [key]: value } : p
    );
    setBatches(updatedBatches);
  };

  const handleTambahkanLomba = () => {
    // simpan ke localStorage sementara (belum ada backend)
    localStorage.setItem("lombaData", JSON.stringify(batches));
    navigate("/result");
  };

  return (
    <div className="p-6">
      {!formData ? (
        <LombaForm onSubmit={handleFormSubmit} />
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">
            🏁 {formData.nama} ({formData.kategori}) - {formData.tanggal}
          </h2>

          <div className="flex gap-3 mb-4">
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              onClick={() => setShowPesertaForm(true)}
            >
              Input Peserta
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleTambahkanLomba}
            >
              Tambahkan Lomba
            </button>
          </div>

          {batches.map((pesertaBatch, batchIdx) => (
            <div key={batchIdx} className="mb-8">
              {batches.length > 1 && (
                <h3 className="text-lg font-semibold mb-2">
                  Batch {batchIdx + 1}
                </h3>
              )}
              <div className="overflow-x-auto rounded-lg shadow border">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700 uppercase">
                    <tr>
                      <th className="px-4 py-3 border">Nama Peserta</th>
                      <th className="px-4 py-3 border">No Plat</th>
                      <th className="px-4 py-3 border">Asal Komunitas</th>
                      <th className="px-4 py-3 border text-center">Point 1</th>
                      <th className="px-4 py-3 border text-center">Point 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pesertaBatch.map((u) => (
                      <tr key={u.id_pendaftaran}>
                        <td className="px-4 py-2 border">
                          {showPesertaForm ? (
                            <input
                              type="text"
                              value={u.nama}
                              onChange={(e) =>
                                handlePesertaChange(
                                  batchIdx,
                                  u.id_pendaftaran,
                                  "nama",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            u.nama
                          )}
                        </td>
                        <td className="px-4 py-2 border">
                          {showPesertaForm ? (
                            <input
                              type="text"
                              value={u.plat_number}
                              onChange={(e) =>
                                handlePesertaChange(
                                  batchIdx,
                                  u.id_pendaftaran,
                                  "plat_number",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            u.plat_number
                          )}
                        </td>
                        <td className="px-4 py-2 border">
                          {showPesertaForm ? (
                            <input
                              type="text"
                              value={u.community}
                              onChange={(e) =>
                                handlePesertaChange(
                                  batchIdx,
                                  u.id_pendaftaran,
                                  "community",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            u.community
                          )}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {showPesertaForm ? (
                            <input
                              type="number"
                              value={u.point1}
                              onChange={(e) =>
                                handlePesertaChange(
                                  batchIdx,
                                  u.id_pendaftaran,
                                  "point1",
                                  Number(e.target.value)
                                )
                              }
                              className="border rounded px-2 py-1 w-full text-center"
                            />
                          ) : (
                            u.point1
                          )}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {showPesertaForm ? (
                            <input
                              type="number"
                              value={u.point2}
                              onChange={(e) =>
                                handlePesertaChange(
                                  batchIdx,
                                  u.id_pendaftaran,
                                  "point2",
                                  Number(e.target.value)
                                )
                              }
                              className="border rounded px-2 py-1 w-full text-center"
                            />
                          ) : (
                            u.point2
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
