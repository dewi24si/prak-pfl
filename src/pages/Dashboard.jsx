import { useState, useEffect } from 'react'
import { MdPerson, MdCalendarToday, MdPayment, MdTrendingUp } from 'react-icons/md'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import { pasienAPI, jadwalAPI, pembayaranAPI, riwayatAPI } from '../services/supabaseAPI'

const tierType = { Bronze: 'bronze', Silver: 'silver', Gold: 'gold' }
const getTier  = p => p >= 100 ? 'Gold' : p >= 50 ? 'Silver' : 'Bronze'
const formatRp = n => n >= 1000000 ? `Rp ${(n/1000000).toFixed(1)}jt` : `Rp ${Number(n).toLocaleString('id-ID')}`

export default function Dashboard() {
  const [pasien, setPasien]         = useState([])
  const [jadwal, setJadwal]         = useState([])
  const [bayar, setBayar]           = useState([])
  const [riwayat, setRiwayat]       = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      pasienAPI.fetchAll(),
      jadwalAPI.fetchAll(),
      pembayaranAPI.fetchAll(),
      riwayatAPI.fetchAll(),
    ]).then(([p, j, b, r]) => {
      setPasien(p); setJadwal(j); setBayar(b); setRiwayat(r)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  const today          = new Date().toISOString().split('T')[0]
  const jadwalHariIni  = jadwal.filter(j => j.tanggal === today)
  const totalPendapatan = bayar.filter(b => b.status === 'Lunas').reduce((a, b) => a + Number(b.biaya), 0)
  const bulanIni       = new Date().toISOString().slice(0, 7)
  const pasienBulanIni = pasien.filter(p => p.tanggal_registrasi?.startsWith(bulanIni))
  const recentPasien   = [...pasien].slice(0, 5)
  const jadwalAktif    = jadwal.filter(j => j.status === 'Terjadwal').slice(0, 5)

  const stats = [
    { Icon: MdPerson,        label: 'Total Pasien',         value: String(pasien.length),       change: `+${pasienBulanIni.length} bulan ini`, up: true,  color: 'text-biru',   bg: 'bg-biru-muda'   },
    { Icon: MdCalendarToday, label: 'Jadwal Hari Ini',      value: String(jadwalHariIni.length), change: `${jadwal.filter(j=>j.status==='Terjadwal').length} terjadwal`, up: true, color: 'text-hijau', bg: 'bg-hijau-muda' },
    { Icon: MdPayment,       label: 'Total Pendapatan',     value: formatRp(totalPendapatan),   change: `${bayar.filter(b=>b.status==='Lunas').length} transaksi`, up: true, color: 'text-kuning', bg: 'bg-kuning-muda' },
    { Icon: MdTrendingUp,    label: 'Riwayat Perawatan',   value: String(riwayat.length),      change: 'total tindakan', up: true, color: 'text-ungu', bg: 'bg-ungu-muda' },
  ]

  // Data user yang login
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  return (
    <div id="dashboard-container">
      <PageHeader title="Dashboard" breadcrumb={['Beranda', 'Dashboard']}/>

      {/* Welcome banner */}
      <div className="bg-biru rounded-2xl p-6 mb-6 relative overflow-hidden flex items-center gap-5">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full"/>
        <div className="absolute bottom-0 right-28 w-24 h-24 bg-white/5 rounded-full translate-y-1/2"/>
        <Avatar src="https://avatar.iran.liara.run/public/girl/5" name="Admin" size="lg"/>
        <div className="relative z-10 flex-1">
          <p className="text-white/60 text-sm">Welcome back,</p>
          <h2 className="text-white text-xl font-bold">{user.email || 'Admin'}</h2>
          <p className="text-white/50 text-xs mt-0.5">{new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })} · Klinik Gigi Permata</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20">
          <Spinner size="md" color="biru"/>
          <span className="text-teks-samping">Memuat dashboard...</span>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => <StatCard key={i} {...s}/>)}
          </div>

          {/* Content grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Jadwal hari ini */}
            <Card padding="p-0">
              <div className="px-5 py-4 border-b border-garis">
                <h3 className="font-bold text-teks">Jadwal Hari Ini</h3>
                <p className="text-xs text-teks-samping mt-0.5">{new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
              </div>
              {jadwalAktif.length === 0 ? (
                <div className="text-center py-10 text-teks-samping text-sm">Tidak ada jadwal aktif</div>
              ) : (
                <div className="divide-y divide-garis">
                  {jadwalAktif.map(j => (
                    <div key={j.id} className="px-5 py-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 bg-biru-muda rounded-xl flex items-center justify-center flex-shrink-0">
                        <MdCalendarToday className="text-biru text-lg"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-teks text-sm truncate">{j.nama_pasien}</p>
                        <p className="text-xs text-teks-samping">{j.jenis_perawatan} · {j.jam} · {j.dokter}</p>
                      </div>
                      <span className="text-xs font-semibold bg-biru-muda text-biru px-2 py-1 rounded-full">{j.jam}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Pasien terbaru */}
            <Card padding="p-0">
              <div className="px-5 py-4 border-b border-garis">
                <h3 className="font-bold text-teks">Pasien Terbaru</h3>
                <p className="text-xs text-teks-samping mt-0.5">5 pasien terakhir terdaftar</p>
              </div>
              {recentPasien.length === 0 ? (
                <div className="text-center py-10 text-teks-samping text-sm">Belum ada data pasien</div>
              ) : (
                <div className="divide-y divide-garis">
                  {recentPasien.map(p => {
                    const tier = getTier(p.poin_loyalitas || 0)
                    return (
                      <div key={p.id} className="px-5 py-3.5 flex items-center gap-3">
                        <Avatar name={p.nama_lengkap} size="sm"/>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-teks text-sm truncate">{p.nama_lengkap}</p>
                          <p className="text-xs text-teks-samping truncate">{p.email || p.no_hp || '-'}</p>
                        </div>
                        <Badge type={tierType[tier]}>{tier}</Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>

            {/* Ringkasan pembayaran */}
            <Card padding="p-5">
              <h3 className="font-bold text-teks mb-4">Ringkasan Pembayaran</h3>
              <div className="space-y-3">
                {[['Total Transaksi', bayar.length, 'text-teks'], ['Sudah Lunas', bayar.filter(b=>b.status==='Lunas').length, 'text-hijau'], ['Belum Lunas', bayar.filter(b=>b.status==='Belum Lunas').length, 'text-merah']].map(([label, val, cls]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-teks-samping">{label}</span>
                    <span className={`font-bold text-lg ${cls}`}>{val}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-garis">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-teks">Total Pendapatan</span>
                    <span className="font-bold text-lg text-biru">{formatRp(totalPendapatan)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Ringkasan riwayat */}
            <Card padding="p-5">
              <h3 className="font-bold text-teks mb-4">Tindakan Terbanyak</h3>
              {riwayat.length === 0 ? (
                <div className="text-center py-6 text-teks-samping text-sm">Belum ada riwayat</div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(
                    riwayat.reduce((acc, r) => { acc[r.tindakan] = (acc[r.tindakan] || 0) + 1; return acc }, {})
                  ).sort((a,b) => b[1]-a[1]).slice(0,5).map(([tindakan, count]) => (
                    <div key={tindakan} className="flex items-center gap-3">
                      <span className="text-sm text-teks flex-1">{tindakan}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-biru rounded-full" style={{ width: `${(count / riwayat.length) * 100}%` }}/>
                        </div>
                        <span className="text-xs font-bold text-teks-samping w-4">{count}x</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
