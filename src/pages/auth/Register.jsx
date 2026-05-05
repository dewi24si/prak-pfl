import { NavLink } from 'react-router-dom'

export default function Register() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-teks mb-1 text-center">Buat Akun Baru ✨</h2>
      <p className="text-center text-teks-samping text-sm mb-6">Daftarkan akun staf klinik baru</p>

      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-teks mb-1">Nama Lengkap</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-latar border border-garis rounded-xl shadow-sm placeholder-gray-400 outline-none focus:border-biru"
            placeholder="drg. Nama Lengkap"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-teks mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 bg-latar border border-garis rounded-xl shadow-sm placeholder-gray-400 outline-none focus:border-biru"
            placeholder="nama@klinik.com"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-teks mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 bg-latar border border-garis rounded-xl shadow-sm placeholder-gray-400 outline-none focus:border-biru"
            placeholder="••••••••"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-teks mb-1">Konfirmasi Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 bg-latar border border-garis rounded-xl shadow-sm placeholder-gray-400 outline-none focus:border-biru"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-biru hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
        >
          Daftar
        </button>
      </form>

      <p className="text-center text-sm text-teks-samping mt-4">
        Sudah punya akun?{' '}
        <NavLink to="/login" className="text-biru hover:underline">Masuk di sini</NavLink>
      </p>
    </div>
  )
}
