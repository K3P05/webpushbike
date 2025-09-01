// src/pages/Kontak.tsx
import { useState } from "react";

export default function Kontak() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    pesan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pesan terkirim:", formData);
    setFormData({ nama: "", email: "", pesan: "" });
    alert("Pesan berhasil dikirim!");
  };

  return (
    <div className="min-h-screen bg-[#222831] py-16 px-6 font-poppins">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#EEEEEE]">
        Hubungi Kami
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Info Kontak & Lokasi */}
        <div className="space-y-6">
          {/* Lokasi dengan Google Maps */}
          <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg border border-[#00ADB5]">
            <iframe
              title="Lokasi Kami"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.296369807405!2d107.60981047499602!3d-6.917463167651262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e62f7be6c3b1%3A0x401e8f1fc28e770!2sBandung!5e0!3m2!1sid!2sid!4v1698240700000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>

          {/* Info Kontak */}
          <div className="bg-[#393E46] shadow-md rounded-xl p-6 space-y-4 text-[#EEEEEE]">
            <h2 className="text-2xl font-semibold mb-4 text-[#00ADB5]">
              Informasi Kontak
            </h2>
            <p>
              Jika ada pertanyaan terkait event atau registrasi, silakan hubungi
              kami melalui:
            </p>
            <p>📍 Bandung, Indonesia</p>
            <p>📞 +62 812 3456 7890</p>
            <p>📧 info@pushbikeweb.com</p>

            <div className="pt-4 border-t border-[#EEEEEE]/20 text-sm">
              <p className="font-semibold text-[#00ADB5]">Jam Operasional:</p>
              <p>Senin - Jumat: 09.00 - 17.00 WIB</p>
              <p>Sabtu: 10.00 - 14.00 WIB</p>
              <p>Minggu & Hari Libur: Tutup</p>
            </div>
          </div>
        </div>

        {/* Form Kontak */}
        <div className="bg-[#393E46] shadow-md rounded-xl p-6 text-[#EEEEEE]">
          <h2 className="text-2xl font-semibold mb-4 text-[#00ADB5]">
            Kirim Pesan
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="nama"
              placeholder="Nama Anda"
              value={formData.nama}
              onChange={handleChange}
              className="w-full p-3 border border-[#EEEEEE]/30 rounded-lg bg-[#222831] text-[#EEEEEE] focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5] outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Anda"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-[#EEEEEE]/30 rounded-lg bg-[#222831] text-[#EEEEEE] focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5] outline-none"
              required
            />
            <textarea
              name="pesan"
              placeholder="Tulis pesan Anda..."
              value={formData.pesan}
              onChange={handleChange}
              className="w-full p-3 border border-[#EEEEEE]/30 rounded-lg bg-[#222831] text-[#EEEEEE] h-32 focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5] outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#00ADB5] hover:bg-[#0097a7] text-[#EEEEEE] py-3 rounded-lg transition font-semibold"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
