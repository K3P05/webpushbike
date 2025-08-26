// src/pages/TentangKami.tsx
export default function TentangKami() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Tentang Kami</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Kami adalah komunitas pecinta Pushbike & BMX yang berkomitmen untuk
          menghadirkan event balap seru, aman, dan penuh sportivitas.
        </p>
      </section>

      {/* Visi Misi */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">Visi</h2>
          <p className="text-gray-600">
            Menjadi wadah utama bagi generasi muda untuk mengembangkan bakat,
            sportivitas, dan kebersamaan melalui ajang balap pushbike dan BMX.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">Misi</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Menyelenggarakan event pushbike profesional dan inklusif</li>
            <li>Membangun komunitas sehat & solid</li>
            <li>Mengutamakan keselamatan dan sportivitas</li>
          </ul>
        </div>
      </section>

      {/* Tim */}
      <section className="py-16 bg-gray-100 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Tim Kami</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            { nama: "Andi", jabatan: "Founder & Race Director" },
            { nama: "Budi", jabatan: "Event Coordinator" },
            { nama: "Citra", jabatan: "Community Manager" },
          ].map((person, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-xl font-semibold">{person.nama}</h3>
              <p className="text-gray-600">{person.jabatan}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
