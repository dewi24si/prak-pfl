import { NavLink } from 'react-router-dom'
import InputField from '../../components/InputField'
import Button from '../../components/Button'

export default function Register() {
  return (
    <div>
      <h2 className="text-3xl font-poppins font-bold text-teks mb-1">Sign Up</h2>
      <div className="flex items-center gap-3 mb-6 mt-2">
        <div className="flex-1 h-px bg-garis"/>
        <span className="text-xs text-teks-samping font-medium">Sign up with</span>
        <div className="flex-1 h-px bg-garis"/>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Nama" name="nama" placeholder="drg. Nama"/>
          <InputField label="Email" name="email" type="email" placeholder="email@klinik.com"/>
        </div>
        <InputField label="Password" name="password" type="password" placeholder="••••••••"
          hint="Minimal 8 karakter"/>
        <label className="flex items-center gap-2 text-sm text-teks-samping cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded accent-biru"/>
          I agree to <span className="text-biru font-semibold">terms & conditions</span>
        </label>
        <Button type="primary" fullWidth size="lg">Sign Up</Button>
      </form>

      <p className="text-center text-sm text-teks-samping mt-5">
        Do you already have an account?{' '}
        <NavLink to="/login" className="text-biru font-bold hover:underline">Log in</NavLink>
      </p>
    </div>
  )
}
