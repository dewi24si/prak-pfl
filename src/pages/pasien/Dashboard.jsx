import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdStars, MdCalendarToday, MdHistory, MdPayment, MdEventAvailable } from 'react-icons/md'
import PageHeader from '../../components/PageHeader'
import StatCard from '../../components/StatCard'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import Avatar from '../../components/Avatar'
import Spinner from '../../components/Spinner'
import Alert from '../../components/Alert'
import { pasienAPI, jadwalAPI, riwayatAPI, pembayaranAPI } from '../../services/supabaseAPI'
import { useAuth } from '../../context/useAuth'

const tierType   = { Bronze: 'bronze', Silver: 'silver', Gold: 'gold' }
const statusType = { Terjadwal: 'primary', Selesai: 'success', Dibatalkan: 'danger' }
const getTier    = p => p >= 100 ? 'Gold' : p >= 50 ? 'Silver' : 'Bronze'

export default function PasienDashboard() {
  const { user } = useAuth()
  const [pasien, setPasien]     = useState(null)
  const [jadwal, setJadwal]     = useState([])
  const [riwayat, setRiwayat]   = useState([])
  const [bayar, setBayar]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    Promise.all([
      pasienAPI.fetchById(user.pasienId),
      jadwalAPI.fetchByPasien(user.pasienId),
      riwayatAPI.fetchByPasien(user.pasienId),
      pembayaranAPI.fetchByPasien(user.pasienId),
    ]).then(([p, j, r, b]) => {
      setPasien(p); setJadwal(j); setRiwayat(r); setBayar(b)
    }).catch(() => setError('Gagal memuat data dashboard'))
      .finally(() => setLoading(false))
  }, [user.pasienId])

  if (loading) return (
    <div className="flex items-center justify-center gap-3 py-20">
      <Spinner size="md" color="biru"/>
      <span className="text-teks-samping">Memuat dashboard...</span>
    </div>
  )

  if (error) return <div className="mb-4"><Alert type="danger" message={error} onClose={() => setError('')}/></div>

  const today = new Date().toISOString().split('T')[0]
  const jadwalMendatang = jadwal
    .filter(j => j.status === 'Terjadwal' && j.tanggal >= today)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.jam.localeCompare(b.jam))
  const tier = getTier(pasien?.poin_loyalitas || 0)
  const belumLunas = bayar.filter(b => b.status === 'Belum Lunas').length

  const stats = [
    { icon: MdStars,         label: 'Poin Loyalitas', value: String(pasien?.poin_loyalitas || 0), change: tier, up: true, color: 'text-kuning', bg: 'bg-kuning-muda' },
    { icon: MdCalendarToday, label: 'Jadwal Mendatang', value: String(jadwalMendatang.length), change: 'terjadwal', up: true, color: 'text-biru', bg: 'bg-biru-muda' },
    { icon: MdHistory,       label: 'Riwayat Perawatan', value: String(riwayat.length), change: 'total tindakan', up: true, color: 'text-ungu', bg: 'bg-ungu-muda' },
    { icon: MdPayment,       label: 'Belum Lunas', value: String(belumLunas), change: 'transaksi', up: false, color: 'text-merah', bg: 'bg-merah-muda' },
  ]

  return (
    <div>
      <PageHeader title="Beranda" breadcrumb={['Beranda']}>
        <Link to="/pasien/booking">
          <Button type="primary" icon={<MdEventAvailable/>}>Booking Jadwal Baru</Button>
        </Link>
      </PageHeader>

      <div className="bg-biru rounded-2xl p-6 mb-6 relative overflow-hidden flex items-center gap-5">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full"/>
        <Avatar name={pasien?.nama_lengkap || user.email} size="lg"/>
        <div className="relative z-10 flex-1">
          <p className="text-white/60 text-sm">Selamat datang,</p>
          <h2 className="text-white text-xl font-bold">{pasien?.nama_lengkap || user.email}</h2>
          <p className="text-white/50 text-xs mt-0.5">{new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })} · Klinik Gigi Permata</p>
        </div>
        <Badge type={tierType[tier]}>{tier}</Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => <StatCard key={i} {...s}/>)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="p-0">
          <div className="px-5 py-4 border-b border-garis">
            <h3 className="font-bold text-teks">Jadwal Mendatang</h3>
            <p className="text-xs text-teks-samping mt-0.5">Jadwal yang belum lewat</p>
          </div>
          {jadwalMendatang.length === 0 ? (
            <div className="text-center py-10 text-teks-samping text-sm">Belum ada jadwal mendatang.</div>
          ) : (
            <div className="divide-y divide-garis">
              {jadwalMendatang.slice(0, 5).map(j => (
                <div key={j.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-biru-muda rounded-xl flex items-center justify-center flex-shrink-0">
                    <MdCalendarToday className="text-biru text-lg"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-teks text-sm truncate">{j.jenis_perawatan}</p>
                    <p className="text-xs text-teks-samping">{new Date(j.tanggal).toLocaleDateString('id-ID')} · {j.jam} · {j.dokter}</p>
                  </div>
                  <Badge type={statusType[j.status]}>{j.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padding="p-0">
          <div className="px-5 py-4 border-b border-garis">
            <h3 className="font-bold text-teks">Riwayat Terakhir</h3>
            <p className="text-xs text-teks-samping mt-0.5">5 tindakan terakhir</p>
          </div>
          {riwayat.length === 0 ? (
            <div className="text-center py-10 text-teks-samping text-sm">Belum ada riwayat perawatan.</div>
          ) : (
            <div className="divide-y divide-garis">
              {riwayat.slice(0, 5).map(r => (
                <div key={r.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-hijau-muda rounded-xl flex items-center justify-center flex-shrink-0">
                    <MdHistory className="text-hijau text-lg"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-teks text-sm truncate">{r.tindakan}</p>
                    <p className="text-xs text-teks-samping">{new Date(r.tanggal).toLocaleDateString('id-ID')} · {r.dokter}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
