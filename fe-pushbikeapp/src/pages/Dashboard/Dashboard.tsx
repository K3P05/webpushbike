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
    <div className="p-6 max-w-7xl mx-auto font-poppins">
      <h1 className="text-3xl font-bold text-text-light mb-6 text-center md:text-left">
        Selamat Datang di Push Bike Race! 🚴‍♂️
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daftar Lomba */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-accent mb-2">
            Lomba Yang Sedang Berjalan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lombaCards.map((lomba) => (
              <Card
                key={lomba.id}
                className="hover:scale-[1.02] hover:shadow-lg transition cursor-pointer"
              >
                <CardHeader>
                  <h3 className="text-lg font-semibold">{lomba.name}</h3>
                  <p className="text-sm">
                    Tanggal: {new Date(lomba.date).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  {lomba.kategori && (
                    <p className="text-text-light/80">
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
                  <p className="font-medium mt-2">
                    Pemenang: {lomba.winner}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {slides.length > 0 && (
            <div className="rounded-2xl shadow-md border border-accent/40 bg-base-card text-text-light overflow-hidden relative">
              <img
                src={slides[carouselIndex].image}
                alt={slides[carouselIndex].name}
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-accent">
                  {slides[carouselIndex].name}
                </h3>
                <p className="text-sm">
                  Pemenang: {slides[carouselIndex].winner}
                </p>
              </div>

              {/* Tombol navigasi */}
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-accent/70 text-base-dark px-2 py-1 rounded-full shadow hover:bg-accent/90 transition text-sm"
              >
                ◀
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-accent/70 text-base-dark px-2 py-1 rounded-full shadow hover:bg-accent/90 transition text-sm"
              >
                ▶
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
