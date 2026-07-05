import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner'
import { usersAPI, pasienAPI } from '../../services/supabaseAPI'

export default function Forgot() {
  const navigate = useNavigate()
  const [step, setStep]         = useState(1) // 1 = verifikasi identitas, 2 = set password baru
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [email, setEmail]       = useState('')
  const [noHp, setNoHp]         = useState('')
  const [user, setUser]         = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const normalisasiHp = s => (s || '').replace(/\D/g, '')

  const handleFindEmail = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const found = await usersAPI.findByEmail(email)
      if (!found) {
        setError('Email tidak terdaftar. Periksa kembali atau daftar akun baru.')
        return
      }
      if (found.role === 'admin') {
        setError('Reset password akun admin tidak bisa dilakukan mandiri. Hubungi admin/developer klinik untuk mengubahnya langsung.')
        return
      }
      const pasien = await pasienAPI.findByUserId(found.id)
      if (!pasien?.no_hp || normalisasiHp(pasien.no_hp) !== normalisasiHp(noHp)) {
        setError('No. HP tidak cocok dengan data akun ini.')
        return
      }
      setUser(found)
      setStep(2)
    } catch {
      setError('Terjadi kesalahan, coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async e => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password minimal 8 karakter')
      return
    }
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama')
      return
    }
    setLoading(true)
    try {
      await usersAPI.update(user.id, { password })
      setSuccess('Password berhasil diubah! Mengarahkan ke halaman login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Gagal mengubah password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-poppins font-bold text-teks mb-2">Forgot Password?</h2>
      <p className="text-sm text-teks-samping mb-8">
        {step === 1
          ? 'Masukkan email dan No. HP yang terdaftar untuk verifikasi akun kamu.'
          : `Buat password baru untuk ${user?.email}.`}
      </p>

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

      {step === 1 ? (
        <form onSubmit={handleFindEmail} className="space-y-5">
          <InputField label="Email" name="email" type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="nama@klinik.com" required/>
          <InputField label="No. HP / WhatsApp Terdaftar" name="noHp" value={noHp}
            onChange={e => setNoHp(e.target.value)} placeholder="08xx-xxxx-xxxx" required/>
          <Button type="primary" fullWidth size="lg" disabled={loading}>Cari Akun</Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <InputField label="Password Baru" name="password" type="password" value={password}
            onChange={e => setPassword(e.target.value)} placeholder="••••••••" hint="Minimal 8 karakter" required/>
          <InputField label="Konfirmasi Password Baru" name="confirmPassword" type="password" value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required/>
          <Button type="primary" fullWidth size="lg" disabled={loading}>Reset Password</Button>
        </form>
      )}

      <NavLink to="/login" className="flex items-center justify-center gap-1.5 text-sm text-teks-samping hover:text-biru mt-6 transition-colors font-semibold">
        <MdArrowBack/> Kembali ke Login
      </NavLink>
    </div>
  )
}
