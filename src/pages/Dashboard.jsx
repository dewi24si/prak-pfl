import { MdPerson, MdCalendarToday, MdPayment, MdTrendingUp } from 'react-icons/md'
import PageHeader from '../components/PageHeader'

const stats = [
  { id: 'pasien',      icon: <MdPerson />,        label: 'Total Pasien',        value: '248',     color: 'bg-biru',   light: 'bg-biru-muda',   text: 'text-biru' },
  { id: 'jadwal',      icon: <MdCalendarToday />,  label: 'Jadwal Hari Ini',     value: '12',      color: 'bg-hijau',  light: 'bg-green-100',   text: 'text-hijau' },
  { id: 'pembayaran',  icon: <MdPayment />,        label: 'Pendapatan Bulan Ini',value: 'Rp 42jt', color: 'bg-kuning', light: 'bg-yellow-100',  text: 'text-kuning' },
  { id: 'baru',        icon: <MdTrendingUp />,     label: 'Pasien Baru',         value: '18',      color: 'bg-ungu',   light: 'bg-purple-100',  text: 'text-ungu' },
]

export default function Dashboard() {
  return (
    <div id="dashboard-container">
      <PageHeader title="Dashboard" breadcrumb={['Beranda', 'Dashboard']} />

      {/* Stat Cards */}
      <div id="dashboard-grid" className="p-2 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.id} className="flex items-center space-x-4 bg-white rounded-xl shadow-sm p-4">
            <div className={`${s.color} rounded-full p-4`}>
              <span className="text-3xl text-white">{s.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-teks">{s.value}</span>
              <span className="text-teks-samping text-sm">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="p-2 mt-2 grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-teks mb-3">Jadwal Hari Ini</h3>
          {['09:00 — drg. Sari → Budi Santoso (Scaling)', '10:30 — drg. Reza → Ani Rahayu (Tambal)', '13:00 — drg. Sari → Citra Dewi (Konsultasi)'].map((j, i) => (
            <div key={i} className="text-sm text-teks-samping py-2 border-b border-garis last:border-0">{j}</div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-teks mb-3">Pasien Terbaru</h3>
          {['Budi Santoso — Scaling — Bronze', 'Ani Rahayu — Tambal Gigi — Silver', 'Citra Dewi — Konsultasi — Gold'].map((p, i) => (
            <div key={i} className="text-sm text-teks-samping py-2 border-b border-garis last:border-0">{p}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
