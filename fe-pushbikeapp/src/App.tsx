import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Registrasi from './pages/Registrasi';
import TentangKami from './pages/TentangKami';
import Kontak from './pages/Kontak'
import LoginAdmin from './pages/Login/LoginAdmin';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import ResultList from './pages/HasilLomba';
import ResultLayout from '@/pages/Hasil';
import LiveResult from './pages/Hasil/LiveResult';
import UserForm from '@/pages/Hasil/ResultForm';
import TambahLomba from './pages/Lomba/TambahLomba'; 
import DaftarPeserta from './pages/Peserta/DaftarPeserta';
import DaftarLomba from './pages/Lomba/DaftarLomba';
import KelolaLomba from './pages/Lomba/KelolaLomba';
import Statistik from './pages/Statistik';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Redirect default ke /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registrasi" element={<Registrasi />} />
          <Route path="/tentangkami" element={<TentangKami />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/resultlist" element={<ResultList />} />
          <Route path="/loginadmin" element={<LoginAdmin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />

          {/* Nested route di bawah dashboard */}
          <Route path="/admindashboard/tambahLomba" element={<TambahLomba />} />
          <Route path="/admindashboard/daftarpeserta" element={<DaftarPeserta />} />
          <Route path="/admindashboard/daftarlomba" element={<DaftarLomba />} />
          <Route path="/admindashboard/kelolalomba" element={<KelolaLomba />} />
          <Route path="/admindashboard/statistik" element={<Statistik />} />

          {/* Nested route untuk Result */}
          <Route path="/result" element={<ResultLayout />}>
            <Route index element={<LiveResult />} />
            <Route path="new" element={<UserForm />} />
          </Route>
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
