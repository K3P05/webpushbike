import { useState } from "react";

export default function DashboardUser() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://picsum.photos/600/300?random=1",
      title: "Push Bike GP 1",
      desc: "Lomba seru dengan peserta 50 anak-anak",
    },
    {
      id: 2,
      image: "https://picsum.photos/600/300?random=2",
      title: "Push Bike GP 2",
      desc: "Balapan penuh semangat dan sportivitas",
    },
    {
      id: 3,
      image: "https://picsum.photos/600/300?random=3",
      title: "Push Bike GP 3",
      desc: "Final lomba penuh adrenalin",
    },
  ];

  const lombaSebelumnya = [
    { id: 1, name: "Push Bike Cup 2023", date: "20 Agustus 2023", winner: "Andi" },
    { id: 2, name: "Push Bike Fun Race", date: "12 September 2023", winner: "Budi" },
    { id: 3, name: "Push Bike Championship", date: "5 Oktober 2023", winner: "Siti" },
  ];

  const nextSlide = () => setCarouselIndex((carouselIndex + 1) % slides.length);
  const prevSlide = () => setCarouselIndex((carouselIndex - 1 + slides.length) % slides.length);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center md:text-left">
        Selamat Datang di Push Bike Race! 🚴‍♂️
      </h1>

      {/* Layout utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card lomba sebelumnya */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Lomba Sebelumnya</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lombaSebelumnya.map((lomba) => (
              <div
                key={lomba.id}
                className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-indigo-700">{lomba.name}</h3>
                <p className="text-gray-600 text-sm">Tanggal: {lomba.date}</p>
                <p className="text-gray-800 font-medium mt-2">Pemenang: {lomba.winner}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <img
              src={slides[carouselIndex].image}
              alt={slides[carouselIndex].title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{slides[carouselIndex].title}</h3>
              <p className="text-gray-600 text-sm">{slides[carouselIndex].desc}</p>
            </div>
          </div>
          {/* tombol navigasi */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-full shadow"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-full shadow"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
