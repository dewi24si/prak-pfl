import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import StatCard from '../components/StatCard'
import Table from '../components/Table'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'
import { MdDownload, MdTrendingUp, MdPerson, MdPayment, MdCalendarToday, MdHelpOutline } from 'react-icons/md'
import { pasienAPI, pembayaranAPI, riwayatAPI } from '../services/supabaseAPI'

const formatRp = n => n >= 1000000 ? `Rp ${(n / 1000000).toFixed(1)}jt` : `Rp ${Number(n || 0).toLocaleString('id-ID')}`

const warnaTindakan = ['bg-biru', 'bg-hijau', 'bg-ungu', 'bg-kuning', 'bg-merah']

// 6 bulan terakhir, dari yang paling lama ke paling baru
function getLast6Months() {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      key: d.toISOString().slice(0, 7),
      label: d.toLocaleDateString('id-ID', { month: 'long' }),
    }
  })
}

// ─── Data FAQ untuk DaisyUI Accordion ─────────────────────────────
const faqItems = [
  {
    q: 'Bagaimana cara membaca laporan pendapatan bulanan?',
    a: 'Laporan pendapatan bulanan menampilkan total pemasukan dari seluruh tindakan yang telah selesai dilakukan pada bulan bersangkutan. Pastikan status pembayaran pasien sudah diperbarui agar data akurat.'
  },
  {
    q: 'Apa yang dimaksud dengan Retensi Pasien?',
    a: 'Retensi pasien adalah persentase pasien dengan riwayat perawatan yang kembali melakukan kunjungan lebih dari sekali. Angka ini menunjukkan tingkat kepuasan dan loyalitas pasien terhadap klinik.'
  },
  {
    q: 'Mengapa data tindakan bulan ini berbeda dengan bulan lalu?',
    a: 'Perbedaan jumlah tindakan antar bulan dipengaruhi oleh jumlah hari kerja, hari libur nasional, dan fluktuasi jumlah pasien. Lihat detail per tindakan di tabel Rekap Bulanan untuk analisis lebih lanjut.'
  },
  {
    q: 'Bagaimana cara mengunduh laporan?',
    a: 'Klik tombol "Unduh Laporan" di pojok kanan atas halaman ini untuk mengunduh ringkasan laporan yang sedang ditampilkan.'
  },
]

export default function Laporan() {
  const [pasien, setPasien]     = useState([])
  const [bayar, setBayar]       = useState([])
  const [riwayat, setRiwayat]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    Promise.all([pasienAPI.fetchAll(), pembayaranAPI.fetchAll(), riwayatAPI.fetchAll()])
      .then(([p, b, r]) => { setPasien(p); setBayar(b); setRiwayat(r) })
      .catch(() => setError('Gagal memuat data laporan'))
      .finally(() => setLoading(false))
  }, [])

  const bulanIni = new Date().toISOString().slice(0, 7)

  const pasienBulanIni   = pasien.filter(p => p.tanggal_registrasi?.startsWith(bulanIni)).length
  const riwayatBulanIni  = riwayat.filter(r => r.tanggal?.startsWith(bulanIni)).length
  const bayarLunas       = bayar.filter(b => b.status === 'Lunas')
  const totalPendapatan  = bayarLunas.reduce((a, b) => a + Number(b.biaya || 0), 0)

  // Retensi: dari pasien yang punya riwayat, berapa persen yang datang lebih dari sekali
  const riwayatPerPasien = riwayat.reduce((acc, r) => {
    if (r.pasien_id) acc[r.pasien_id] = (acc[r.pasien_id] || 0) + 1
    return acc
  }, {})
  const pasienDenganRiwayat = Object.keys(riwayatPerPasien).length
  const pasienKembali       = Object.values(riwayatPerPasien).filter(c => c > 1).length
  const retensi             = pasienDenganRiwayat ? Math.round((pasienKembali / pasienDenganRiwayat) * 100) : 0

  const kpi = [
    { icon: MdPerson,        label: 'Total Pasien',   value: String(pasien.length),      change: `+${pasienBulanIni} bulan ini`,  up: true, color: 'text-biru',   bg: 'bg-biru-muda'   },
    { icon: MdCalendarToday, label: 'Total Tindakan', value: String(riwayat.length),      change: `+${riwayatBulanIni} bulan ini`, up: true, color: 'text-hijau',  bg: 'bg-hijau-muda'  },
    { icon: MdPayment,       label: 'Pendapatan',     value: formatRp(totalPendapatan),   change: `${bayarLunas.length} transaksi lunas`, up: true, color: 'text-kuning', bg: 'bg-kuning-muda' },
    { icon: MdTrendingUp,    label: 'Retensi Pasien', value: `${retensi}%`,               change: `${pasienKembali} pasien kembali`, up: true, color: 'text-ungu', bg: 'bg-ungu-muda' },
  ]

  const monthlyData = getLast6Months().map(({ key, label }) => ({
    bulan: label,
    pasien: pasien.filter(p => p.tanggal_registrasi?.startsWith(key)).length,
    tindakan: riwayat.filter(r => r.tanggal?.startsWith(key)).length,
    pendapatan: bayar.filter(b => b.status === 'Lunas' && b.tanggal?.startsWith(key)).reduce((a, b) => a + Number(b.biaya || 0), 0),
  }))

  const tindakanPopuler = Object.entries(
    riwayat.reduce((acc, r) => { acc[r.tindakan] = (acc[r.tindakan] || 0) + 1; return acc }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nama, jumlah], i) => ({
      nama, jumlah,
      persen: riwayat.length ? Math.round((jumlah / riwayat.length) * 100) : 0,
      color: warnaTindakan[i % warnaTindakan.length],
    }))

  if (loading) return (
    <div className="flex items-center justify-center gap-3 py-20">
      <Spinner size="md" color="biru"/>
      <span className="text-teks-samping">Memuat laporan...</span>
    </div>
  )

  const handleDownload = () => window.print()

  return (
    <div>
      <PageHeader title="Laporan" breadcrumb={['Beranda','Laporan']}>
        <div className="print:hidden">
          <Button type="primary" icon={<MdDownload/>} onClick={handleDownload}>Unduh Laporan</Button>
        </div>
      </PageHeader>

      {error && <div className="mb-4"><Alert type="danger" message={error} onClose={() => setError('')}/></div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {kpi.map((k,i) => <StatCard key={i} {...k}/>)}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-4 border-b border-garis">
            <h3 className="font-bold text-teks text-sm">Rekap 6 Bulan Terakhir</h3>
          </div>
          <Table headers={['Bulan','Pasien Baru','Tindakan','Pendapatan']}>
            {monthlyData.map(m => (
              <tr key={m.bulan} className="hover:bg-latar transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-teks">{m.bulan}</td>
                <td className="px-5 py-3 text-sm text-teks-samping">{m.pasien}</td>
                <td className="px-5 py-3 text-sm text-teks-samping">{m.tindakan}</td>
                <td className="px-5 py-3 text-sm font-bold text-teks">{formatRp(m.pendapatan)}</td>
              </tr>
            ))}
          </Table>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
          <h3 className="font-bold text-teks text-sm mb-1">Tindakan Paling Sering</h3>
          <p className="text-xs text-teks-samping mb-5">{riwayat.length} total tindakan tercatat</p>
          {tindakanPopuler.length === 0 ? (
            <div className="text-center py-6 text-teks-samping text-sm">Belum ada data tindakan.</div>
          ) : (
            <div className="space-y-4">
              {tindakanPopuler.map(t => (
                <div key={t.nama}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${t.color} flex-shrink-0`}/>
                      <span className="text-sm font-semibold text-teks">{t.nama}</span>
                    </div>
                    <span className="text-xs text-teks-samping font-semibold">{t.jumlah}x &middot; {t.persen}%</span>
                  </div>
                  <div className="w-full bg-latar rounded-full h-2">
                    <div className={`${t.color} h-2 rounded-full transition-all`} style={{width:`${t.persen}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── DaisyUI Accordion · FAQ Laporan ────────────────────── */}
      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] p-6 print:hidden">
        <div className="flex items-center gap-2 mb-4">
          <MdHelpOutline className="text-biru text-xl"/>
          <h3 className="font-bold text-teks text-sm">Pertanyaan Umum Seputar Laporan</h3>
        </div>
        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <div key={i} className="collapse collapse-arrow bg-latar rounded-xl border border-garis">
              <input type="radio" name="faq-accordion" defaultChecked={i === 0} />
              <div className="collapse-title text-sm font-semibold text-teks">
                {item.q}
              </div>
              <div className="collapse-content">
                <p className="text-sm text-teks-samping leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
