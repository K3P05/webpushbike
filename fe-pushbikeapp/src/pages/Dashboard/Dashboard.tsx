import { useState, useEffect } from "react";
import api from "@/services/api";
import { Card, CardHeader, CardContent } from "@/component/ui/Card";

interface PointSesi {
  id: number;
  sesi: number;
  finish: number;
  point: number;
  pesertaIdPendaftaran: number;
}

interface Peserta {
  id_pendaftaran: number;
  nama: string;
  pointSesi?: PointSesi[];
}

interface Lomba {
  id: number;
  nama: string;
  tanggal: string;
  kategori?: string;
}

interface LombaDisplay {
  id: number;
  name: string;
  date: string;
  winner: string;
  image: string;
  kategori?: string;
}

export default function DashboardUser() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [lombaCards, setLombaCards] = useState<LombaDisplay[]>([]);
  const [slides, setSlides] = useState<LombaDisplay[]>([]);

  useEffect(() => {
    const fetchLomba = async () => {
      try {
        const res = await api.get<Lomba[]>("/lomba");
        const lombaData: LombaDisplay[] = [];

        for (const lomba of res.data) {
          const pesertaRes = await api.get<Peserta[]>(
            `/lomba/${lomba.id}/peserta`
          );
          const semuaPeserta = pesertaRes.data;

          // cari winner sesi 2 berdasarkan finish terendah
          const sesi2All = semuaPeserta
            .map((p) => ({
              peserta: p,
              finish:
                p.pointSesi?.find((s) => s.sesi === 2)?.finish ?? Infinity,
            }))
            .filter((p) => p.finish !== Infinity);

          let winnerName = "Belum ada";
          if (sesi2All.length > 0) {
            const winner = sesi2All.reduce((prev, curr) =>
              curr.finish < prev.finish ? curr : prev
            );
            winnerName = winner.peserta.nama;
          }

          lombaData.push({
            id: lomba.id,
            name: lomba.nama,
            date: lomba.tanggal,
            winner: winnerName,
            image: `https://picsum.photos/300/150?random=${lomba.id}`,
            kategori: lomba.kategori,
          });
        }

        setLombaCards(lombaData);
        setSlides(lombaData.slice(-3));
      } catch (err) {
        console.error("Gagal fetch lomba:", err);
      }
    };

    fetchLomba();
  }, []);

  // carousel otomatis tiap 3 detik
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides]);

  const nextSlide = () =>
    setCarouselIndex((carouselIndex + 1) % slides.length);
  const prevSlide = () =>
    setCarouselIndex((carouselIndex - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen font-poppins px-6 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-accent mb-6 text-center md:text-left">
        Selamat Datang di Push Bike Race! 🚴‍♂️
      </h1>
      <p className="text-textlight/70 mb-10 text-center md:text-left">
        Pilih lomba untuk melihat detail peserta & hasil.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Daftar lomba */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-4">
            Lomba Yang Sedang Berjalan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {lombaCards.map((lomba) => (
              <Card
                key={lomba.id}
                className="cursor-pointer hover:bg-accent hover:text-base-dark hover:shadow-accent/40 hover:scale-[1.03]"
              >
                <CardHeader>
                  <h3 className="text-lg font-semibold mb-1">{lomba.name}</h3>
                  <p className="text-sm opacity-80">
                    Tanggal: {new Date(lomba.date).toLocaleDateString()}
                  </p>
                  {lomba.kategori && (
                    <p className="mt-1 text-sm">
                      Kategori:{" "}
                      <span
                        className={`font-semibold ${
                          lomba.kategori === "boy"
                            ? "text-blue-400"
                            : lomba.kategori === "girl"
                            ? "text-pink-400"
                            : "text-accent"
                        }`}
                      >
                        {lomba.kategori}
                      </span>
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Pemenang: {lomba.winner}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {slides.length > 0 && (
            <Card className="overflow-hidden relative">
              <img
                src={slides[carouselIndex].image}
                alt={slides[carouselIndex].name}
                className="w-full h-40 object-cover"
              />
              <CardContent>
                <h3 className="font-bold text-lg text-accent">
                  {slides[carouselIndex].name}
                </h3>
                <p className="text-textlight/80 text-sm">
                  Pemenang: {slides[carouselIndex].winner}
                </p>
              </CardContent>

              {/* Tombol navigasi */}
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-3 -translate-y-1/2 bg-accent/80 text-base-dark px-2 py-1 rounded-full shadow hover:bg-accent transition text-sm"
              >
                ◀
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-accent/80 text-base-dark px-2 py-1 rounded-full shadow hover:bg-accent transition text-sm"
              >
                ▶
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
