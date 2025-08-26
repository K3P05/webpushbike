import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '@/services/api';
import type { UserType } from '@/types/users';

const initialForm: UserType = {
  id_pendaftaran: 0, // backend akan generate otomatis
  nama: '',
  plat_number: '',
  community: '',
  point1: 0,
  point2: 0,
  email: '', // wajib
};

export default function UserForm() {
  const [form, setForm] = useState<UserType>(initialForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'id_pendaftaran' || name === 'point1' || name === 'point2'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Kirim data sesuai DTO
      await createUser({
        nama: form.nama,
        plat_number: form.plat_number,
        community: form.community,
        point1: form.point1 || undefined,
        point2: form.point2 || undefined,
        email: form.email,
      });
      navigate('/result'); // arah balik ke halaman list
    } catch (err) {
      alert('Gagal menyimpan data User');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-6">Tambah User</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Nama */}
        <div>
          <label className="block text-sm font-medium mb-1">Nama</label>
          <input
            name="nama"
            type="text"
            value={form.nama}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Plat Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Plat Number</label>
          <input
            name="plat_number"
            type="text"
            value={form.plat_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Community */}
        <div>
          <label className="block text-sm font-medium mb-1">Community</label>
          <input
            name="community"
            type="text"
            value={form.community}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Point 1 */}
        <div>
          <label className="block text-sm font-medium mb-1">Point 1</label>
          <input
            name="point1"
            type="number"
            value={form.point1}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded no-spinner"
          />
        </div>

        {/* Point 2 */}
        <div>
          <label className="block text-sm font-medium mb-1">Point 2</label>
          <input
            name="point2"
            type="number"
            value={form.point2}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded no-spinner"
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-between mt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/result')}
            className="text-sm text-gray-500 hover:underline"
          >
            Batal / Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
