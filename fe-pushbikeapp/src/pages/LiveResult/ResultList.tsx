import { useNavigate } from "react-router-dom";

export default function ResultList() {
  const navigate = useNavigate();

  // Dummy lomba (nanti ganti fetch API)
  const lombaList = [
    { id: 1, name: "Push Bike Cup 2024", date: "20 Agustus 2024" },
    { id: 2, name: "Push Bike Championship 2024", date: "15 September 2024" },
    { id: 3, name: "Push Bike Fun Race 2025", date: "2 Januari 2025" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        Pilih Lomba untuk Melihat Hasil 🚴
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lombaList.map((lomba) => (
          <div
            key={lomba.id}
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between hover:shadow-xl transition"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{lomba.name}</h2>
              <p className="text-gray-500 text-sm">{lomba.date}</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate(`/live/${lomba.id}/girl`)}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow"
              >
                Girl
              </button>
              <button
                onClick={() => navigate(`/live/${lomba.id}/boy`)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
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
