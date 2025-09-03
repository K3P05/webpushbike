import { useNavigate } from "react-router-dom";

export default function ResultList() {
  const navigate = useNavigate();

  const lombaList = [
    { id: 1, name: "Push Bike Cup 2024", date: "20 Agustus 2024" },
    { id: 2, name: "Push Bike Championship 2024", date: "15 September 2024" },
    { id: 3, name: "Push Bike Fun Race 2025", date: "2 Januari 2025" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#222831] min-h-screen font-poppins">
      <h1 className="text-3xl font-bold text-[#00ADB5] mb-6 text-center">
        Pilih Lomba untuk Melihat Hasil 🚴
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lombaList.map((lomba) => (
          <div
            key={lomba.id}
            className="bg-[#393E46] shadow-lg rounded-xl p-6 flex flex-col justify-between hover:shadow-xl transition"
          >
            <div>
              <h2 className="text-xl font-semibold text-[#EEEEEE]">
                {lomba.name}
              </h2>
              <p className="text-gray-300 text-sm">{lomba.date}</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate(`/live/${lomba.id}/girl`)}
                className="flex-1 bg-[#EC4899] hover:bg-[#BE185D] text-[#EEEEEE] px-4 py-2 rounded-lg shadow transition"
              >
                Girl
              </button>
              <button
                onClick={() => navigate(`/live/${lomba.id}/boy`)}
                className="flex-1 bg-[#00ADB5] hover:bg-[#019ca4] text-[#EEEEEE] px-4 py-2 rounded-lg shadow transition"
              >
                Boy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
