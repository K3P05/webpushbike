import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Registrasi from './pages/User/Registrasi/FormRegistrasi';
import TentangKami from './pages/TentangKami';
import Kontak from './pages/Kontak'
import LoginAdmin from './pages/Login/LoginAdmin';
import AdminDashboard from './pages/AdminDashboard';
import ResultList from './pages/LiveResult/ResultList';
import ResultLayout from '@/pages/LiveResult';
import LiveResult from './pages/LiveResult/LiveResult';
import UserForm from '@/pages/LiveResult/ResultForm';
import TambahLomba from './pages/Lomba/TambahLomba'; 

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
