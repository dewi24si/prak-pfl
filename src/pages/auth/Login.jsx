import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner'
import { usersAPI, pasienAPI } from '../../services/supabaseAPI'
import { useAuth } from '../../context/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [remember, setRemember] = useState(false)
  const [dataForm, setDataForm] = useState({ email: '', password: '' })

  const handleChange = e => setDataForm({ ...dataForm, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const account = await usersAPI.login(dataForm.email, dataForm.password)

      if (account.role === 'admin') {
        login(account, remember)
        navigate('/admin/dashboard')
        return
      }

      // Pasien: pastikan profil pasien miliknya sudah ada (akun lama belum tentu punya)
      let pasien = await pasienAPI.findByUserId(account.id)
      if (!pasien) {
        // Cek dulu apakah sudah ada profil pasien walk-in dengan email yang
        // sama tapi belum disambungkan ke akun manapun, sebelum bikin baru.
        const pasienLama = await pasienAPI.findByEmail(account.email)
        pasien = pasienLama && !pasienLama.user_id
          ? await pasienAPI.update(pasienLama.id, { user_id: account.id })
          : await pasienAPI.create({
              nama_lengkap: account.email.split('@')[0],
              email: account.email,
              user_id: account.id,
            })
      }
      login({ ...account, pasienId: pasien.id, namaLengkap: pasien.nama_lengkap }, remember)
      navigate('/pasien/dashboard')
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-poppins font-bold text-teks mb-1">Sign In</h2>
      <div className="flex items-center gap-3 mb-6 mt-2">
        <div className="flex-1 h-px bg-garis"/>
        <span className="text-xs text-teks-samping font-medium">Sign in with</span>
        <div className="flex-1 h-px bg-garis"/>
      </div>

      {error && <div className="mb-5"><Alert type="danger" message={error} onClose={() => setError('')}/></div>}
      {loading && (
        <div className="mb-5 flex items-center gap-3 bg-biru-muda p-3.5 rounded-xl">
          <Spinner size="sm" color="biru"/>
          <span className="text-sm text-biru font-medium">Mohon Tunggu...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField label="Email" name="email" type="email" value={dataForm.email}
          onChange={handleChange} placeholder="email@klinik.com" required/>
        <InputField label="Password" name="password" type="password" value={dataForm.password}
          onChange={handleChange} placeholder="••••••••" required/>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-teks-samping cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-biru" checked={remember}
              onChange={e => setRemember(e.target.checked)}/> Remember Me
          </label>
          <NavLink to="/forgot" className="text-sm font-semibold text-biru hover:underline">Forgot Password?</NavLink>
        </div>
        <Button type="primary" fullWidth size="lg">Sign In</Button>
      </form>

      <p className="text-center text-sm text-teks-samping mt-6">
        Belum punya akun?{' '}
        <NavLink to="/register" className="text-biru font-bold hover:underline">Create an account</NavLink>
      </p>
    </div>
  )
}
