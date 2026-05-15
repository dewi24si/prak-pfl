import { NavLink } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'

const inputCls = 'w-full px-4 py-3 border border-garis rounded-xl text-sm text-teks outline-none focus:border-biru focus:ring-2 focus:ring-biru-muda bg-latar transition placeholder:text-teks-samping'

export default function Forgot() {
  return (
    <div>
      <h2 className="text-3xl font-poppins font-bold text-teks mb-2">Forgot Password?</h2>
      <p className="text-sm text-teks-samping mb-8">Masukkan email untuk mendapatkan tautan reset password.</p>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-teks mb-2">Email</label>
          <input type="email" className={inputCls} placeholder="nama@klinik.com" />
        </div>
        <button type="submit"
          className="w-full bg-biru hover:bg-biru-hover text-white font-bold py-3 px-4 rounded-full transition-colors text-sm">
          Kirim Tautan Reset
        </button>
      </form>
      <NavLink to="/login" className="flex items-center justify-center gap-1.5 text-sm text-teks-samping hover:text-biru mt-6 transition-colors font-semibold">
        <MdArrowBack /> Kembali ke Login
      </NavLink>
    </div>
  )
}
