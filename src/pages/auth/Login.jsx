import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import axios from 'axios'
import { BsFillExclamationDiamondFill } from 'react-icons/bs'
import { ImSpinner2 } from 'react-icons/im'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [dataForm, setDataForm] = useState({ username: '', password: '' })

  const handleChange = (e) => setDataForm({ ...dataForm, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    axios.post('https://dummyjson.com/auth/login', dataForm)
      .then(r => { if (r.status === 200) navigate('/dashboard') })
      .catch(e => setError(e.response?.data?.message || e.message || 'Terjadi kesalahan'))
      .finally(() => setLoading(false))
  }

  const inputCls = 'w-full px-4 py-3 border border-garis rounded-xl text-sm text-teks outline-none focus:border-biru focus:ring-2 focus:ring-biru-muda bg-latar transition placeholder:text-teks-samping'

  return (
    <div>
      <h2 className="text-3xl font-poppins font-bold text-teks mb-1">Sign In</h2>
      <div className="flex items-center gap-3 mb-6 mt-2">
        <div className="flex-1 h-px bg-garis" />
        <span className="text-xs text-teks-samping font-medium">Sign in with</span>
        <div className="flex-1 h-px bg-garis" />
      </div>

      {error && (
        <div className="bg-merah-muda mb-5 p-3.5 text-sm text-merah rounded-xl flex items-center gap-2 border border-red-100">
          <BsFillExclamationDiamondFill className="flex-shrink-0" /> {error}
        </div>
      )}
      {loading && (
        <div className="bg-biru-muda mb-5 p-3.5 text-sm text-biru rounded-xl flex items-center gap-2">
          <ImSpinner2 className="animate-spin flex-shrink-0" /> Mohon Tunggu...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-teks mb-2">Username</label>
          <input type="text" name="username" onChange={handleChange} className={inputCls} placeholder="emilys" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-teks mb-2">Password</label>
          <input type="password" name="password" onChange={handleChange} className={inputCls} placeholder="••••••••" />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-teks-samping cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-biru" />
            Remember Me
          </label>
          <NavLink to="/forgot" className="text-sm font-semibold text-biru hover:underline">Forgot Password?</NavLink>
        </div>
        <button type="submit"
          className="w-full bg-biru hover:bg-biru-hover text-white font-bold py-3 px-4 rounded-full transition-colors duration-200 text-sm">
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-teks-samping mt-6">
        Belum punya akun?{' '}
        <NavLink to="/register" className="text-biru font-bold hover:underline">Create an account</NavLink>
      </p>
    </div>
  )
}
