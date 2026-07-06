import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdCalendarToday, MdPeople, MdHistory, MdEventAvailable } from 'react-icons/md'
import PageHeader from '../../components/PageHeader'
import StatCard from '../../components/StatCard'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import Spinner from '../../components/Spinner'
import Alert from '../../components/Alert'
import { jadwalAPI, riwayatAPI, pasienAPI } from '../../services/supabaseAPI'
import { useAuth } from '../../context/useAuth'

const statusType = { Terjadwal: 'primary', Selesai: 'success', Dibatalkan: 'danger' }

export default function DokterDashboard() {
  const { user } = useAuth()
  const [jadwal, setJadwal]   = useState([])
  const [riwayat, setRiwayat] = useState([])
  const [pasien, setPasien]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    Promise.all([jadwalAPI.fetchAll(), riwayatAPI.fetchAll(), pasienAPI.fetchAll()])
      .then(([j, r, p]) => {
        setJadwal(j.filter(x => x.dokter === user.namaDokter))
        setRiwayat(r.filter(x => x.dokter === user.namaDokter))
        setPasien(p.filter(x => x.dokter_penanggung_jawab === user.namaDokter))
      })
      .catch(() => setError('Gagal memuat dashboard'))
      .finally(() => setLoading(false))
  }, [user.namaDokter])

  if (loading) return (
    <div className="flex items-center justify-center gap-3 py-20">
      <Spinner size="md" color="biru"/><span className="text-teks-samping">Memuat dashboard...</span>
    </div>
  )

  if (error) return <div className="mb-4"><Alert type="danger" message={error} onClose={() => setError('')}/></div>

  const today = new Date().toISOString().split('T')[0]
  const jadwalHariIni  = jadwal.filter(j => j.status === 'Terjadwal' && j.tanggal === today)
  const jadwalMendatang = jadwal
    .filter(j => j.status === 'Terjadwal' && j.tanggal >= today)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.jam.localeCompare(b.jam))

  const stats = [
    { icon: MdCalendarToday, label: 'Jadwal Hari Ini',   value: String(jadwalHariIni.length), change: 'terjadwal',    up: true, color: 'text-biru',  bg: 'bg-biru-muda'  },
    { icon: MdEventAvailable,label: 'Jadwal Mendatang',  value: String(jadwalMendatang.length),change: 'akan datang',  up: true, color: 'text-kuning',bg: 'bg-kuning-muda' },
    { icon: MdPeople,        label: 'Pasien Ditangani',  value: String(pasien.length),         change: 'total pasien', up: true, color: 'text-hijau', bg: 'bg-hijau-muda' },
    { icon: MdHistory,       label: 'Tindakan Selesai',  value: String(riwayat.length),         change: 'total tindakan', up: true, color: 'text-ungu', bg: 'bg-ungu-muda' },
  ]

  return (
    <div>
      <PageHeader title="Beranda" breadcrumb={['Beranda']}/>

      <div className="bg-biru rounded-2xl p-6 mb-6 relative overflow-hidden flex items-center gap-5">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full"/>
        <Avatar name={user.namaDokter} size="lg"/>
        <div className="relative z-10 flex-1">
          <p className="text-white/60 text-sm">Selamat datang,</p>
          <h2 className="text-white text-xl font-bold">{user.namaDokter}</h2>
          <p className="text-white/50 text-xs mt-0.5">{new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })} · Klinik Gigi Permata</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => <StatCard key={i} {...s}/>)}
      </div>

      <Card padding="p-0">
        <div className="px-5 py-4 border-b border-garis flex items-center justify-between">
          <div>
            <h3 className="font-bold text-teks">Jadwal Mendatang</h3>
            <p className="text-xs text-teks-samping mt-0.5">Jadwal yang belum lewat</p>
          </div>
          <Link to="/dokter/jadwal" className="text-xs font-semibold text-biru hover:underline">Lihat semua</Link>
        </div>
        {jadwalMendatang.length === 0 ? (
          <div className="text-center py-10 text-teks-samping text-sm">Belum ada jadwal mendatang.</div>
        ) : (
          <div className="divide-y divide-garis">
            {jadwalMendatang.slice(0, 8).map(j => (
              <div key={j.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-10 h-10 bg-biru-muda rounded-xl flex items-center justify-center flex-shrink-0">
                  <MdCalendarToday className="text-biru text-lg"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-teks text-sm truncate">{j.nama_pasien} · {j.jenis_perawatan}</p>
                  <p className="text-xs text-teks-samping">{new Date(j.tanggal).toLocaleDateString('id-ID')} · {j.jam}</p>
                </div>
                <Badge type={statusType[j.status]}>{j.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
