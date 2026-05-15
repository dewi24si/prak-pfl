import { NavLink } from 'react-router-dom'

const inputCls = 'w-full px-4 py-3 border border-garis rounded-xl text-sm text-teks outline-none focus:border-biru focus:ring-2 focus:ring-biru-muda bg-latar transition placeholder:text-teks-samping'

export default function Register() {
  return (
    <div>
      <h2 className="text-3xl font-poppins font-bold text-teks mb-1">Sign Up</h2>
      <div className="flex items-center gap-3 mb-6 mt-2">
        <div className="flex-1 h-px bg-garis" />
        <span className="text-xs text-teks-samping font-medium">Sign up with</span>
        <div className="flex-1 h-px bg-garis" />
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-teks mb-2">Nama</label>
            <input type="text" className={inputCls} placeholder="drg. Nama" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teks mb-2">Email</label>
            <input type="email" className={inputCls} placeholder="email@klinik.com" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-teks mb-2">Password</label>
          <input type="password" className={inputCls} placeholder="••••••••" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-teks mb-2 flex items-center gap-1 text-red-500 text-xs">Minimal 8 karakter</label>
        </div>
        <label className="flex items-center gap-2 text-sm text-teks-samping cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded accent-biru" />
          I agree to <span className="text-biru font-semibold">terms & conditions</span>
        </label>
        <button type="submit"
          className="w-full bg-biru hover:bg-biru-hover text-white font-bold py-3 px-4 rounded-full transition-colors text-sm">
          Sign Up I'm free
        </button>
      </form>

      <p className="text-center text-sm text-teks-samping mt-5">
        Do you already have an account?{' '}
        <NavLink to="/login" className="text-biru font-bold hover:underline">Log in</NavLink>
      </p>
    </div>
  )
}
