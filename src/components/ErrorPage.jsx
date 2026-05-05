import { useNavigate } from 'react-router-dom'
import { MdHome, MdArrowBack } from 'react-icons/md'

export default function ErrorPage({ kodeError, deskripsiError, gambarError }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-latar text-center px-4">
      {/* Gambar / Ilustrasi */}
      {gambarError && (
        <img src={gambarError} alt={`Error ${kodeError}`} className="w-48 h-48 object-contain mb-6" />
      )}

      {/* Kode Error */}
      <h1 className="font-poppins font-[900] text-8xl text-biru mb-2">
        {kodeError}
      </h1>

      {/* Deskripsi */}
      <h2 className="text-xl font-semibold text-teks mb-2">
        {labelError(kodeError)}
      </h2>
      <p className="text-teks-samping mb-8 max-w-sm text-sm">
        {deskripsiError}
      </p>

      {/* Tombol aksi */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border border-garis text-teks-samping px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white transition"
        >
          <MdArrowBack /> Kembali
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-biru text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-700 transition"
        >
          <MdHome /> Dashboard
        </button>
      </div>
    </div>
  )
}

function labelError(kode) {
  const labels = {
    400: 'Permintaan Tidak Valid',
    401: 'Tidak Terautentikasi',
    403: 'Akses Ditolak',
    404: 'Halaman Tidak Ditemukan',
    500: 'Kesalahan Server',
  }
  return labels[kode] ?? 'Terjadi Kesalahan'
}
