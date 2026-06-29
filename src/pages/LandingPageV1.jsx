import { useNavigate } from 'react-router-dom'
import { FaTooth } from 'react-icons/fa'
import Button from '../components/Button'
import Footer from '../components/Footer'

function Navbar({ onLogin, onDaftar }) {
  return (
    <nav className="bg-white border-b border-garis sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-biru rounded-xl flex items-center justify-center shadow-sm">
            <FaTooth className="text-white text-sm" />
          </div>
          <div className="leading-tight">
            <p className="font-poppins font-bold text-teks text-sm">Permata</p>
            <p className="text-[10px] text-teks-samping">Klinik Gigi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="outline" size="sm" shape="pill" onClick={onLogin}>Masuk</Button>
          <Button type="primary" size="sm" shape="pill" onClick={onDaftar}>Daftar</Button>
        </div>
      </div>
    </nav>
  )
}

function HeroSection({ onDaftar, onLayanan }) {
  return (
    <section className="bg-gradient-to-br from-biru to-biru-hover rounded-2xl p-10 md:p-16 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute bottom-[-50px] right-28 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute top-8 right-12 w-24 h-24 bg-white/8 rounded-full" />
      <div className="relative z-10 max-w-2xl">
        <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full mb-5">
          🦷 Klinik Terpercaya #1 di Pekanbaru
        </span>
        <h1 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4 leading-tight">
          Senyum Sehat,<br />
          <span className="text-white/80">Dimulai dari Sini</span>
        </h1>
        <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed max-w-lg">
          Klinik Gigi Permata hadir dengan layanan modern, dokter berpengalaman,
          dan program loyalitas eksklusif untuk menjaga senyum terbaik Anda.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            type="ghost" shape="pill" size="lg" onClick={onDaftar}
            className="!bg-white !text-biru !border-white hover:!bg-biru-muda"
          >
            Daftar Sekarang
          </Button>
          <button
            onClick={onLayanan}
            className="text-white/70 hover:text-white text-sm font-semibold transition-colors underline underline-offset-2"
          >
            Lihat Layanan →
          </button>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const goLogin   = () => navigate('/login')
  const goDaftar  = () => navigate('/register')
  const goLayanan = () => {}

  return (
    <div className="min-h-screen bg-latar font-montserrat">
      <Navbar onLogin={goLogin} onDaftar={goDaftar} />
      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-14">
        <HeroSection onDaftar={goDaftar} onLayanan={goLayanan} />
      </main>
      <Footer />
    </div>
  )
}
