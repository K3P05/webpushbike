import { Outlet, useNavigate } from 'react-router-dom';

export default function ResultLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 font-poppins">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#EEEEEE]">Manajemen Hasil</h1>
        <button
          onClick={() => navigate('/result/new')}
          className="bg-[#00ADB5] text-[#EEEEEE] px-4 py-2 rounded-lg shadow hover:bg-[#393E46] transition"
        >
          ➕ Hasil Baru
        </button>
      </div>

      {/* Halaman yang di-nest akan ditampilkan di sini */}
      <div className="bg-[#393E46] p-4 rounded-lg shadow">
        <Outlet />
      </div>
    </div>
  );
}
