import { MdPerson, MdCalendarToday, MdPayment, MdTrendingUp } from 'react-icons/md'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Card from '../components/Card'
import Button from '../components/Button'

const stats = [
  { Icon:MdPerson,        label:'Total Pasien',         value:'248',     change:'+12%', up:true,  color:'text-biru',   bg:'bg-biru-muda'   },
  { Icon:MdCalendarToday, label:'Jadwal Hari Ini',      value:'12',      change:'+3',   up:true,  color:'text-hijau',  bg:'bg-hijau-muda'  },
  { Icon:MdPayment,       label:'Pendapatan Bulan Ini', value:'Rp 42jt', change:'+8%',  up:true,  color:'text-kuning', bg:'bg-kuning-muda' },
  { Icon:MdTrendingUp,    label:'Pasien Baru',          value:'18',      change:'-2',   up:false, color:'text-ungu',   bg:'bg-ungu-muda'   },
]

const sparkline = (pts) => {
  const w=80, h=30, max=Math.max(...pts), min=Math.min(...pts)
  const xs=pts.map((_,i)=>(i/(pts.length-1))*w)
  const ys=pts.map(p=>h-((p-min)/(max-min||1))*h)
  return xs.map((x,i)=>`${x},${ys[i]}`).join(' ')
}
const linePath=(pts,w=280,h=80)=>pts.map((p,i)=>{
  const x=(i/(pts.length-1))*w
  const y=h-((p-Math.min(...pts))/(Math.max(...pts)-Math.min(...pts)||1))*(h-10)-5
  return `${i===0?'M':'L'}${x},${y}`
}).join(' ')

const deliveredPts=[20,35,28,45,38,50,42]
const completedPts=[10,18,14,22,16,28,20]
const viewerPts=[3,7,5,10,8,14,11,9,13,12,8,11]
const activityPts=[8,3,6,2,14,4,7,3,5,9,3,6]
const activity=[
  {label:'Reach',value:'17K',active:false},{label:'Projects',value:'447',active:false},
  {label:'Likes',value:'1.2K',active:true},{label:'Followers',value:'2.5K',active:false},
]
const recentPatients=[
  {n:'Budi Santoso', tier:'Bronze'},{n:'Ani Rahayu',tier:'Silver'},{n:'Citra Dewi',tier:'Gold'},
]

export default function Dashboard() {
  return (
    <div id="dashboard-container">
      <PageHeader title="Dashboard" breadcrumb={['Beranda','Dashboard']}>
        <Button type="primary">View Reports</Button>
      </PageHeader>

      {/* Welcome banner */}
      <div className="bg-biru rounded-2xl p-6 mb-6 relative overflow-hidden flex items-center gap-5">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full"/>
        <div className="absolute bottom-0 right-28 w-24 h-24 bg-white/5 rounded-full translate-y-1/2"/>
        <Avatar src="https://avatar.iran.liara.run/public/girl/5" name="drg. Sari" size="lg"/>
        <div className="relative z-10 flex-1">
          <p className="text-white/60 text-sm">Welcome back,</p>
          <h2 className="text-white text-xl font-bold">drg. Sari</h2>
          <p className="text-white/50 text-xs mt-0.5">Kamis, 21 Mei 2026 · Klinik Gigi Permata</p>
        </div>
        <div className="relative z-10 flex gap-3">
          <Button type="outline" size="sm">View Reports</Button>
          <button className="px-4 py-2 bg-white text-biru text-xs font-bold rounded-full hover:bg-blue-50 transition-colors">
            Manage Clinic
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s,i) => <StatCard key={i} {...s}/>)}
      </div>

      {/* Mini cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card padding="p-5">
          <p className="text-xs text-teks-samping mb-1 font-semibold">Perawatan Selesai</p>
          <p className="text-2xl font-bold text-teks mb-3">Rp 35jt</p>
          <svg viewBox="0 0 80 30" className="w-full h-8">
            <polyline points={sparkline(deliveredPts)} fill="none" stroke="#3D40E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-xs text-teks-samping mt-2">Delivered</p>
        </Card>
        <Card padding="p-5">
          <p className="text-xs text-teks-samping mb-1 font-semibold">Tagihan Lunas</p>
          <p className="text-2xl font-bold text-teks mb-3">Rp 7jt</p>
          <svg viewBox="0 0 80 30" className="w-full h-8">
            <polyline points={sparkline(completedPts)} fill="none" stroke="#E53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-xs text-teks-samping mt-2">Completed</p>
        </Card>
        <Card padding="p-5" className="flex flex-col items-center justify-center">
          <p className="text-xs text-teks-samping mb-3 font-semibold self-start">Team Efficiency</p>
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="30" fill="none" stroke="#ECEEFF" strokeWidth="10"/>
              <circle cx="40" cy="40" r="30" fill="none" stroke="#3D40E0" strokeWidth="10"
                strokeDasharray={`${2*Math.PI*30*0.85} ${2*Math.PI*30}`} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-teks">85%</span>
            </div>
          </div>
          <Badge type="success" className="mt-2">Good</Badge>
        </Card>
        <Card padding="p-5">
          <p className="text-xs text-teks-samping mb-3 font-semibold">Pasien Terbaru</p>
          <div className="space-y-2.5">
            {recentPatients.map((p,i) => (
              <div key={i} className="flex items-center gap-2">
                <Avatar name={p.n} size="xs"/>
                <p className="text-xs font-semibold text-teks flex-1 truncate">{p.n}</p>
                <Badge type={p.tier.toLowerCase()}>{p.tier}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card padding="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-teks text-sm">Viewers</h3>
              <p className="text-xs text-teks-samping">Kunjungan pasien per minggu</p>
            </div>
            <select className="text-xs border border-garis rounded-full px-3 py-1.5 text-teks-samping bg-latar outline-none">
              <option>Last Week</option><option>Last Month</option>
            </select>
          </div>
          <div className="relative h-24">
            <svg viewBox="0 0 280 80" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3D40E0" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#3D40E0" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={`${linePath(viewerPts)} L280,80 L0,80 Z`} fill="url(#lineGrad)"/>
              <path d={linePath(viewerPts)} fill="none" stroke="#3D40E0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex justify-between mt-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
              <span key={d} className="text-[10px] text-teks-samping">{d}</span>
            ))}
          </div>
        </Card>
        <Card padding="p-5">
          <h3 className="font-bold text-teks text-sm mb-4">Activity Overview</h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {activity.map(a=>(
              <div key={a.label} className={`rounded-xl p-3 text-center ${a.active?'bg-biru text-white':'bg-latar'}`}>
                <p className={`text-base font-bold ${a.active?'text-white':'text-teks'}`}>{a.value}</p>
                <p className={`text-[10px] font-semibold mt-0.5 ${a.active?'text-white/70':'text-teks-samping'}`}>{a.label}</p>
              </div>
            ))}
          </div>
          <div className="relative h-20">
            <svg viewBox="0 0 280 60" className="w-full h-full" preserveAspectRatio="none">
              <path d={linePath(activityPts,280,60)} fill="none" stroke="#3D40E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex justify-between mt-1">
            {['Jan 31','Feb 7','Feb 14','Feb 21','Feb 28'].map(d=>(
              <span key={d} className="text-[10px] text-teks-samping">{d}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
