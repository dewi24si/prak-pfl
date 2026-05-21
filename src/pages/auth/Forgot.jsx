import { NavLink } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import InputField from '../../components/InputField'
import Button from '../../components/Button'

export default function Forgot() {
  return (
    <div>
      <h2 className="text-3xl font-poppins font-bold text-teks mb-2">Forgot Password?</h2>
      <p className="text-sm text-teks-samping mb-8">Masukkan email untuk mendapatkan tautan reset password.</p>
      <form className="space-y-5">
        <InputField label="Email" name="email" type="email" placeholder="nama@klinik.com" required/>
        <Button type="primary" fullWidth size="lg">Kirim Tautan Reset</Button>
      </form>
      <NavLink to="/login" className="flex items-center justify-center gap-1.5 text-sm text-teks-samping hover:text-biru mt-6 transition-colors font-semibold">
        <MdArrowBack/> Kembali ke Login
      </NavLink>
    </div>
  )
}
