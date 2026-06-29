import { useNavigate } from 'react-router-dom'
import { FaTooth, FaStar, FaShieldAlt, FaUserMd, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Footer from '../components/Footer'

// ─── DATA ────────────────────────────────────────────────────────────────────

const LAYANAN = [
  {
    icon: '🦷',
    title: 'Pemeriksaan Gigi',
    desc: 'Pemeriksaan menyeluruh oleh dokter gigi berpengalaman untuk menjaga kesehatan gigi dan mulut Anda.',
  },
  {
    icon: '✨',
    title: 'Scaling & Pembersihan',
    desc: 'Bersihkan karang gigi dan plak secara profesional untuk senyum yang lebih cerah dan sehat.',
  },
  {
    icon: '😁',
    title: 'Perawatan Ortodonti',
    desc: 'Koreksi susunan gigi dengan behel atau aligner untuk hasil yang rapi dan estetis.',
  },
]

const TIERS = [
  { label: 'Bronze', min: 0, max: 999, diskon: '5%', color: 'bronze', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { label: 'Silver', min: 1000, max: 4999, diskon: '10%', color: 'silver', bg: 'bg-gray-50', border: 'border-gray-200' },
  { label: 'Gold', min: 5000, max: 9999, diskon: '15%', color: 'gold', bg: 'bg-amber-50', border: 'border-amber-200' },
  { label: 'Platinum', min: 10000, max: null, diskon: '20%', color: 'purple', bg: 'bg-ungu-muda', border: 'border-ungu/20' },
]

const TESTIMONI = [
  { nama: 'Rina Sari', bintang: 5, teks: 'Pelayanan sangat ramah dan profesional. Dokternya sabar menjelaskan kondisi gigi saya. Recommended banget!', tier: 'Gold' },
  { nama: 'Budi Santoso', bintang: 5, teks: 'Klinik bersih, peralatan modern, dan antrian cepat. Poin loyalitas nya juga bikin hemat!', tier: 'Silver' },
  { nama: 'Dewi Kusuma', bintang: 5, teks: 'Udah langganan 2 tahun di sini. Diskon Platinum 20% sangat membantu. Gak mau pindah ke tempat lain.', tier: 'Platinum' },
]

const FAQS = [
  { q: 'Apakah layanan ini gratis?', a: 'Pemeriksaan awal gratis untuk member baru. Layanan lainnya menggunakan sistem poin yang bisa ditukar diskon sesuai tier keanggotaan.' },
  { q: 'Bagaimana cara mendaftar sebagai member?', a: 'Klik tombol "Daftar Sekarang" di halaman ini, isi data diri, dan akun member Anda langsung aktif. Mulai dari tier Bronze secara otomatis.' },
  { q: 'Bagaimana sistem poin bekerja?', a: 'Setiap transaksi menghasilkan poin. Semakin banyak poin terkumpul, tier Anda naik dan diskon yang didapat semakin besar.' },
  { q: 'Apakah poin bisa kadaluarsa?', a: 'Poin tidak kadaluarsa selama akun Anda aktif melakukan transaksi minimal 1x dalam 12 bulan.' },
]

const STATS = [
  { angka: '500+', label: 'Pasien Aktif' },
  { angka: '10+', label: 'Dokter Gigi' },
  { angka: '5 Thn', label: 'Pengalaman' },
  { angka: '98%', label: 'Kepuasan Pasien' },
]

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function Navbar({ onLogin, onDaftar }) {
  return (
    <nav className="bg-white border-b border-garis sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-biru rounded-xl flex items-center justify-center shadow-sm">
            <FaTooth className="text-white text-sm" />
          </div>
          <div className="leading-tight">
            <p className="font-poppins font-bold text-teks text-sm">Permata</p>
            <p className="text-[10px] text-teks-samping">Klinik Gigi</p>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {['Layanan', 'Loyalitas', 'Testimoni', 'FAQ'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-teks-samping hover:text-teks font-medium transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Button type="outline" size="sm" shape="pill" onClick={onLogin}>
            Masuk
          </Button>
          <Button type="primary" size="sm" shape="pill" onClick={onDaftar}>
            Daftar
          </Button>
        </div>
      </div>
    </nav>
  )
}

function HeroSection({ onDaftar, onLayanan }) {
  return (
    <section className="bg-gradient-to-br from-biru to-biru-hover rounded-2xl p-10 md:p-16 relative overflow-hidden">
      {/* Decorative circles */}
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
            type="ghost"
            shape="pill"
            size="lg"
            onClick={onDaftar}
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

function StatsSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STATS.map((s) => (
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
        <h2 className="text-2xl font-poppins font-bold text-teks mt-3 mb-2">
          Layanan Unggulan Klinik
        </h2>
        <p className="text-teks-samping text-sm max-w-md mx-auto">
          Kami menyediakan berbagai layanan kesehatan gigi dengan standar medis terkini.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {LAYANAN.map((l) => (
          <Card key={l.title} hover className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-biru-muda rounded-xl flex items-center justify-center text-2xl">
              {l.icon}
            </div>
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
        <h2 className="text-2xl font-poppins font-bold text-teks mt-3 mb-2">
          Kumpulkan Poin, Dapat Diskon
        </h2>
        <p className="text-teks-samping text-sm max-w-md mx-auto">
          Setiap transaksi menghasilkan poin. Semakin tinggi tier, semakin besar diskon yang kamu dapatkan.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TIERS.map((t) => (
          <div
            key={t.label}
            className={`${t.bg} border ${t.border} rounded-2xl p-5 text-center flex flex-col gap-2`}
          >
            <Badge type={t.color}>{t.label}</Badge>
            <p className="text-3xl font-poppins font-bold text-teks mt-1">{t.diskon}</p>
            <p className="text-xs text-teks-samping font-medium">Diskon Transaksi</p>
            <p className="text-[11px] text-teks-samping">
              {t.max
                ? `${t.min.toLocaleString()} – ${t.max.toLocaleString()} poin`
                : `${t.min.toLocaleString()}+ poin`}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function TestimoniSection() {
  return (
    <section id="testimoni">
      <div className="text-center mb-8">
        <Badge type="success">Testimoni</Badge>
        <h2 className="text-2xl font-poppins font-bold text-teks mt-3 mb-2">
          Apa Kata Pasien Kami
        </h2>
        <p className="text-teks-samping text-sm">
          Ribuan pasien sudah mempercayakan kesehatan gigi mereka kepada kami.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {TESTIMONI.map((t) => (
          <Card key={t.nama} className="flex flex-col gap-4">
            <div className="flex gap-0.5">
              {Array.from({ length: t.bintang }).map((_, i) => (
                <FaStar key={i} className="text-kuning text-sm" />
              ))}
            </div>
            <p className="text-teks-samping text-sm leading-relaxed italic">"{t.teks}"</p>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-garis">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-biru-muda rounded-full flex items-center justify-center">
                  <FaUserMd className="text-biru text-xs" />
                </div>
                <p className="text-sm font-semibold text-teks">{t.nama}</p>
              </div>
              <Badge type={t.tier === 'Platinum' ? 'purple' : t.tier === 'Gold' ? 'gold' : 'silver'}>
                {t.tier}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq">
      <div className="text-center mb-8">
        <Badge type="warning">FAQ</Badge>
        <h2 className="text-2xl font-poppins font-bold text-teks mt-3 mb-2">
          Pertanyaan yang Sering Ditanyakan
        </h2>
      </div>
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {FAQS.map((f, i) => (
          <Card key={i} padding="p-0">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-semibold text-teks text-sm pr-4">{f.q}</span>
              {open === i
                ? <FaChevronUp className="text-biru flex-shrink-0 text-xs" />
                : <FaChevronDown className="text-teks-samping flex-shrink-0 text-xs" />
              }
            </button>
            {open === i && (
              <div className="px-5 pb-5">
                <p className="text-teks-samping text-sm leading-relaxed">{f.a}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}

function CTABottom({ onDaftar, onLogin }) {
  return (
    <section className="bg-gradient-to-br from-teks to-biru rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-white/5 rounded-full" />
      <div className="relative z-10">
        <FaShieldAlt className="text-white/30 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-poppins font-bold text-white mb-3">
          Mulai Perjalanan Senyum Sehatmu
        </h2>
        <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
          Daftar sekarang dan nikmati keuntungan program loyalitas eksklusif dari Klinik Gigi Permata.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button
            type="ghost"
            shape="pill"
            size="lg"
            onClick={onDaftar}
            className="!bg-white !text-teks !border-white hover:!bg-latar"
          >
            Daftar Sekarang — Gratis!
          </Button>
          <button
            onClick={onLogin}
            className="text-white/60 hover:text-white text-sm font-semibold transition-colors underline underline-offset-2"
          >
            Sudah punya akun? Masuk →
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate()

  const goLogin  = () => navigate('/login')
  const goDaftar = () => navigate('/register')
  const goLayanan = () => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-latar font-montserrat">
      <Navbar onLogin={goLogin} onDaftar={goDaftar} />

      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-14">
        {/* PRD v1 — Hero */}
        <HeroSection onDaftar={goDaftar} onLayanan={goLayanan} />

        {/* PRD v2 — Stats + Layanan + Loyalitas */}
        <StatsSection />
        <LayananSection />
        <LoyalitasSection />

        {/* PRD v3 — Testimoni + FAQ + CTA Bottom */}
        <TestimoniSection />
        <FAQSection />
        <CTABottom onDaftar={goDaftar} onLogin={goLogin} />
      </main>

      <Footer />
    </div>
  )
}
