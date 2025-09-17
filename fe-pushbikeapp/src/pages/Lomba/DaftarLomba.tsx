/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getLombas, deleteLomba } from "@/services/lomba";
import EditLombaModal from "@/pages/Form/EditLombaForm";
import { Card, CardHeader, CardContent } from "@/component/ui/Card";
import Button from "@/component/ui/Buttons";

export default function DaftarLomba() {
  const [lombas, setLombas] = useState<any[]>([]);
  const [editData, setEditData] = useState<any | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  // ambil data dari backend
  const fetchData = async () => {
    try {
      const res = await getLombas();
      setLombas(res.data);
    } catch (err) {
      console.error("Gagal mengambil data lomba:", err);
    }
  };

  // hapus data lomba beserta peserta
  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Apakah yakin ingin menghapus lomba ini beserta semua pesertanya?"
      )
    )
      return;
    try {
      setLoadingDelete(id);
      await deleteLomba(id);
      await fetchData();
      alert("Lomba berhasil dihapus.");
    } catch (err) {
      console.error("Gagal hapus lomba:", err);
      alert("Gagal menghapus lomba.");
    } finally {
      setLoadingDelete(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen font-poppins p-6">
      <h1 className="text-3xl font-bold mb-6 text-text-light">Daftar Lomba</h1>

      {lombas.length === 0 ? (
        <p className="text-text-light/70">Data lomba belum ada.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lombas.map((lomba) => (
            <Card
              key={lomba.id}
              className="flex flex-col justify-between animate-scale-in"
            >
              <CardHeader>
                <h2 className="text-xl font-semibold text-text-light">
                  {lomba.nama}
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-light/80 mb-1">
                  Tanggal: {lomba.tanggal}
                </p>
                <p className="text-sm text-text-light/80 mb-1">
                  Kuota: {lomba.jumlahPeserta}
                </p>
                <p className="text-sm text-text-light/80 mb-1">
                  Batch: {lomba.jumlahBatch}
                </p>
                <p className="text-sm text-text-light/80 mb-1">
                  Biaya: Rp {lomba.biaya}
                </p>
                <p className="text-sm text-text-light/80 mb-3">
                  Kategori: {lomba.kategori}
                </p>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    onClick={() => setEditData(lomba)}
                    className="bg-accent text-text-light hover:bg-accent-hover"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(lomba.id)}
                    disabled={loadingDelete === lomba.id}
                    className={`${
                      loadingDelete === lomba.id
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white`}
                  >
                    {loadingDelete === lomba.id ? "Menghapus..." : "Hapus"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Edit */}
      {editData && (
        <EditLombaModal
          lomba={editData}
          onClose={() => setEditData(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
