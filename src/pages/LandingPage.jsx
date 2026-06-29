import { useNavigate } from 'react-router-dom'
import { FaTooth } from 'react-icons/fa'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Footer from '../components/Footer'

const LAYANAN = [
  { icon: '🦷', title: 'Pemeriksaan Gigi', desc: 'Pemeriksaan menyeluruh oleh dokter gigi berpengalaman untuk menjaga kesehatan gigi dan mulut Anda.' },
  { icon: '✨', title: 'Scaling & Pembersihan', desc: 'Bersihkan karang gigi dan plak secara profesional untuk senyum yang lebih cerah dan sehat.' },
  { icon: '😁', title: 'Perawatan Ortodonti', desc: 'Koreksi susunan gigi dengan behel atau aligner untuk hasil yang rapi dan estetis.' },
]

const TIERS = [
  { label: 'Bronze',   min: 0,     max: 999,  diskon: '5%',  color: 'bronze', bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  { label: 'Silver',   min: 1000,  max: 4999, diskon: '10%', color: 'silver', bg: 'bg-gray-50',    border: 'border-gray-200' },
  { label: 'Gold',     min: 5000,  max: 9999, diskon: '15%', color: 'gold',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  { label: 'Platinum', min: 10000, max: null, diskon: '20%', color: 'purple', bg: 'bg-ungu-muda',  border: 'border-ungu/20' },
]

const STATS = [
  { angka: '500+', label: 'Pasien Aktif' },
  { angka: '10+',  label: 'Dokter Gigi' },
  { angka: '5 Thn', label: 'Pengalaman' },
  { angka: '98%',  label: 'Kepuasan Pasien' },
]

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
        <div className="hidden md:flex items-center gap-6">
          {['Layanan', 'Loyalitas'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-teks-samping hover:text-teks font-medium transition-colors">{item}</a>
          ))}
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
          Senyum Sehat,<br /><span className="text-white/80">Dimulai dari Sini</span>
        </h1>
        <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed max-w-lg">
          Klinik Gigi Permata hadir dengan layanan modern, dokter berpengalaman,
          dan program loyalitas eksklusif untuk menjaga senyum terbaik Anda.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Button type="ghost" shape="pill" size="lg" onClick={onDaftar} className="!bg-white !text-biru !border-white hover:!bg-biru-muda">
            Daftar Sekarang
          </Button>
          <button onClick={onLayanan} className="text-white/70 hover:text-white text-sm font-semibold transition-colors underline underline-offset-2">
            Lihat Layanan →
          </button>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STATS.map(s => (
        <Card key={s.label} className="text-center">
          <p className="text-3xl font-poppins font-bold text-biru mb-1">{s.angka}</p>
          <p className="text-xs text-teks-samping font-medium">{s.label}</p>
        </Card>
      ))}
    </div>
  )
}

function LayananSection() {
  return (
    <section id="layanan">
      <div className="text-center mb-8">
        <Badge type="primary">Layanan Kami</Badge>
        <h2 className="text-2xl font-poppins font-bold text-teks mt-3 mb-2">Layanan Unggulan Klinik</h2>
        <p className="text-teks-samping text-sm max-w-md mx-auto">Kami menyediakan berbagai layanan kesehatan gigi dengan standar medis terkini.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {LAYANAN.map(l => (
          <Card key={l.title} hover className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-biru-muda rounded-xl flex items-center justify-center text-2xl">{l.icon}</div>
            <div>
              <h3 className="font-poppins font-bold text-teks text-base mb-1">{l.title}</h3>
              <p className="text-teks-samping text-sm leading-relaxed">{l.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function LoyalitasSection() {
  return (
    <section id="loyalitas" className="bg-latar rounded-2xl p-8 md:p-10">
      <div className="text-center mb-8">
        <Badge type="purple">Program Loyalitas</Badge>
        <h2 className="text-2xl font-poppins font-bold text-teks mt-3 mb-2">Kumpulkan Poin, Dapat Diskon</h2>
        <p className="text-teks-samping text-sm max-w-md mx-auto">Setiap transaksi menghasilkan poin. Semakin tinggi tier, semakin besar diskon yang kamu dapatkan.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TIERS.map(t => (
          <div key={t.label} className={`${t.bg} border ${t.border} rounded-2xl p-5 text-center flex flex-col gap-2`}>
            <Badge type={t.color}>{t.label}</Badge>
            <p className="text-3xl font-poppins font-bold text-teks mt-1">{t.diskon}</p>
            <p className="text-xs text-teks-samping font-medium">Diskon Transaksi</p>
            <p className="text-[11px] text-teks-samping">
              {t.max ? `${t.min.toLocaleString()} – ${t.max.toLocaleString()} poin` : `${t.min.toLocaleString()}+ poin`}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const goLogin   = () => navigate('/login')
  const goDaftar  = () => navigate('/register')
  const goLayanan = () => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-latar font-montserrat">
      <Navbar onLogin={goLogin} onDaftar={goDaftar} />
      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-14">
        <HeroSection onDaftar={goDaftar} onLayanan={goLayanan} />
        <StatsSection />
        <LayananSection />
        <LoyalitasSection />
      </main>
      <Footer />
    </div>
  )
}
