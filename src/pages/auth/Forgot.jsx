import { NavLink } from 'react-router-dom'

export default function Forgot() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-teks mb-1 text-center">Lupa Password?</h2>
      <p className="text-sm text-teks-samping mb-6 text-center">
        Masukkan email dan kami akan mengirimkan tautan reset password.
      </p>

      <form>
        <div className="mb-5">
          <label className="block text-sm font-medium text-teks mb-1">Alamat Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 bg-latar border border-garis rounded-xl shadow-sm placeholder-gray-400 outline-none focus:border-biru"
            placeholder="nama@klinik.com"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-biru hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
        >
          Kirim Tautan Reset
        </button>
      </form>

      <p className="text-center text-sm text-teks-samping mt-4">
        Ingat password?{' '}
        <NavLink to="/login" className="text-biru hover:underline">Kembali ke Login</NavLink>
      </p>
    </div>
  )
}
