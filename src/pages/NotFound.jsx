import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-latar flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-[0_2px_30px_rgba(0,0,0,0.08)] p-12 text-center max-w-md w-full">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-3xl font-poppins font-bold text-biru mb-2">Ooops... 404!</h1>
        <p className="text-teks-samping text-sm mb-6">The page you requested could not be found.</p>
        <button onClick={() => navigate('/dashboard')}
          className="bg-biru hover:bg-biru-hover text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors">
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
