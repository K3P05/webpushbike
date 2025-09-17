// src/pages/Statistik.tsx
import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/component/ui/Card";

type Lomba = {
  id: number;
  nama: string;
  pesertaCount: number;
  batchCount?: number;
};

export default function Statistik() {
  const [lombaData, setLombaData] = useState<Lomba[]>([]);
  const [totalPeserta, setTotalPeserta] = useState(0);

  const COLORS = ["#00ADB5", "#222831", "#393E46", "#EEEEEE"];

  const fetchStatistik = async () => {
    try {
      const res = await api.get("/statistik");
      const withCounts = res.data ?? [];

      setLombaData(withCounts);
      setTotalPeserta(withCounts.reduce((acc, l) => acc + l.pesertaCount, 0));
    } catch (err) {
      console.error("Gagal fetch statistik", err);
    }
  };

  useEffect(() => {
    fetchStatistik();
  }, []);

  return (
    <div className="min-h-screen text-text-light font-poppins px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-accent">
        📊 Statistik Lomba & Peserta
      </h1>

      {/* Ringkasan Angka */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-base-card border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {lombaData.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">Total Lomba</p>
          </CardContent>
        </Card>

        <Card className="bg-base-card border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{totalPeserta}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">Total Peserta</p>
          </CardContent>
        </Card>

        <Card className="bg-base-card border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {Math.max(...lombaData.map((l) => l.pesertaCount), 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">
              Peserta Terbanyak (1 Lomba)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Bar Peserta per Lomba */}
      <Card className="bg-base-card border-none mb-12">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Jumlah Peserta per Lomba
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lombaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="nama" stroke="#EEEEEE" />
              <YAxis stroke="#EEEEEE" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#393E46",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="pesertaCount" fill="#00ADB5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grafik Pie Distribusi Peserta */}
      <Card className="bg-base-card border-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Distribusi Peserta per Lomba
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={lombaData}
                dataKey="pesertaCount"
                nameKey="nama"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {lombaData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#393E46",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
