import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner'
import { usersAPI } from '../../services/supabaseAPI'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [dataForm, setDataForm] = useState({
    email: '', password: '', confirmPassword: '', role: 'user'
  })

  const handleChange = e => setDataForm({ ...dataForm, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (dataForm.password !== dataForm.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama')
      return
    }
    if (dataForm.password.length < 8) {
      setError('Password minimal 8 karakter')
      return
    }

    setLoading(true)
    try {
      // Cek apakah email sudah terdaftar
      const exists = await usersAPI.checkEmail(dataForm.email)
      if (exists) {
        setError('Email sudah terdaftar, silakan gunakan email lain')
        return
      }

      await usersAPI.register({
        email: dataForm.email,
        password: dataForm.password,
        role: dataForm.role,
      })

      setSuccess('Akun berhasil dibuat! Silakan login.')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat registrasi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-poppins font-bold text-teks mb-1">Sign Up</h2>
      <div className="flex items-center gap-3 mb-6 mt-2">
        <div className="flex-1 h-px bg-garis"/>
        <span className="text-xs text-teks-samping font-medium">Sign up with</span>
        <div className="flex-1 h-px bg-garis"/>
      </div>

      {error && (
        <div className="mb-5">
          <Alert type="danger" message={error} onClose={() => setError('')}/>
        </div>
      )}
      {success && (
        <div className="mb-5">
          <Alert type="success" message={success}/>
        </div>
      )}
      {loading && (
        <div className="mb-5 flex items-center gap-3 bg-biru-muda p-3.5 rounded-xl">
          <Spinner size="sm" color="biru"/>
          <span className="text-sm text-biru font-medium">Mohon Tunggu...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Email" name="email" type="email" value={dataForm.email}
          onChange={handleChange} placeholder="email@klinik.com" required/>
        <InputField label="Password" name="password" type="password" value={dataForm.password}
          onChange={handleChange} placeholder="••••••••" hint="Minimal 8 karakter" required/>
        <InputField label="Konfirmasi Password" name="confirmPassword" type="password"
          value={dataForm.confirmPassword} onChange={handleChange} placeholder="••••••••" required/>
        <label className="flex items-center gap-2 text-sm text-teks-samping cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded accent-biru" required/>
          I agree to <span className="text-biru font-semibold">terms & conditions</span>
        </label>
        <Button type="primary" fullWidth size="lg" disabled={loading}>Sign Up</Button>
      </form>

      <p className="text-center text-sm text-teks-samping mt-5">
        Do you already have an account?{' '}
        <NavLink to="/login" className="text-biru font-bold hover:underline">Log in</NavLink>
      </p>
    </div>
  )
}
