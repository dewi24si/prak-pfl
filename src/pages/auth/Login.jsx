import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import axios from 'axios'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [dataForm, setDataForm] = useState({ username: '', password: '' })

  const handleChange = e => setDataForm({ ...dataForm, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true); setError('')
    axios.post('https://dummyjson.com/auth/login', dataForm)
      .then(r => { if (r.status === 200) navigate('/dashboard') })
      .catch(e => setError(e.response?.data?.message || e.message || 'Terjadi kesalahan'))
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <h2 className="text-3xl font-poppins font-bold text-teks mb-1">Sign In</h2>
      <div className="flex items-center gap-3 mb-6 mt-2">
        <div className="flex-1 h-px bg-garis"/>
        <span className="text-xs text-teks-samping font-medium">Sign in with</span>
        <div className="flex-1 h-px bg-garis"/>
      </div>

      {error && (
        <div className="mb-5">
          <Alert type="danger" message={error} onClose={() => setError('')}/>
        </div>
      )}
      {loading && (
        <div className="mb-5 flex items-center gap-3 bg-biru-muda p-3.5 rounded-xl">
          <Spinner size="sm" color="biru"/>
          <span className="text-sm text-biru font-medium">Mohon Tunggu...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField label="Username" name="username" value={dataForm.username}
          onChange={handleChange} placeholder="emilys" required/>
        <InputField label="Password" name="password" type="password" value={dataForm.password}
          onChange={handleChange} placeholder="••••••••" required/>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-teks-samping cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-biru"/> Remember Me
          </label>
          <NavLink to="/forgot" className="text-sm font-semibold text-biru hover:underline">
            Forgot Password?
          </NavLink>
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
