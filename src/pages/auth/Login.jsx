import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import axios from 'axios'
import { BsFillExclamationDiamondFill } from 'react-icons/bs'
import { ImSpinner2 } from 'react-icons/im'

export default function Login() {
  /* navigate, state & handleChange */
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dataForm, setDataForm] = useState({ username: '', password: '' })

  const handleChange = (evt) => {
    const { name, value } = evt.target
    setDataForm({ ...dataForm, [name]: value })
  }

  /* process form */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    axios
      .post('https://dummyjson.com/auth/login', {
        username: dataForm.username,
        password: dataForm.password,
      })
      .then((response) => {
        if (response.status !== 200) {
          setError(response.data.message)
          return
        }
        navigate('/dashboard')
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message || 'Terjadi kesalahan')
        } else {
          setError(err.message || 'Kesalahan tidak diketahui')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /* error & loading status */
  const errorInfo = error ? (
    <div className="bg-red-50 mb-5 p-4 text-sm text-merah rounded-lg flex items-center gap-2 border border-red-200">
      <BsFillExclamationDiamondFill className="text-merah shrink-0" />
      {error}
    </div>
  ) : null

  const loadingInfo = loading ? (
    <div className="bg-biru-muda mb-5 p-4 text-sm text-biru rounded-lg flex items-center gap-2">
      <ImSpinner2 className="animate-spin shrink-0" />
      Mohon Tunggu...
    </div>
  ) : null

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teks mb-1 text-center">Selamat Datang 👋</h2>
      <p className="text-center text-teks-samping text-sm mb-6">Masuk ke akun Klinik Gigi Permata</p>

      {errorInfo}
      {loadingInfo}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-teks mb-1">Username</label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-latar border border-garis rounded-xl shadow-sm placeholder-gray-400 outline-none focus:border-biru"
            placeholder="emilys"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-teks mb-1">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full px-4 py-2 bg-latar border border-garis rounded-xl shadow-sm placeholder-gray-400 outline-none focus:border-biru"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-biru hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
        >
          Masuk
        </button>
      </form>

      <div className="flex justify-between mt-4 text-sm">
        <NavLink to="/forgot" className="text-biru hover:underline">Lupa Password?</NavLink>
        <NavLink to="/register" className="text-biru hover:underline">Daftar Akun</NavLink>
      </div>
    </div>
  )
}
