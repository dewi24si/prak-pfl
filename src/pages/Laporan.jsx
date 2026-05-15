import PageHeader from '../components/PageHeader'
import { MdDownload, MdTrendingUp, MdPerson, MdPayment, MdCalendarToday } from 'react-icons/md'

const monthlyData = [
  {bulan:'Januari', pasien:38,pendapatan:'Rp 28.500.000',tindakan:45,bar:65},
  {bulan:'Februari',pasien:41,pendapatan:'Rp 31.200.000',tindakan:50,bar:72},
  {bulan:'Maret',   pasien:35,pendapatan:'Rp 27.800.000',tindakan:42,bar:60},
  {bulan:'April',   pasien:48,pendapatan:'Rp 38.400.000',tindakan:58,bar:88},
  {bulan:'Mei',     pasien:52,pendapatan:'Rp 42.100.000',tindakan:63,bar:100},
  {bulan:'Juni',    pasien:44,pendapatan:'Rp 35.600.000',tindakan:54,bar:82},
]

const tindakanPopuler = [
  {nama:'Scaling',          jumlah:85,persen:34,color:'bg-biru'},
  {nama:'Tambal Gigi',      jumlah:72,persen:29,color:'bg-hijau'},
  {nama:'Konsultasi',       jumlah:45,persen:18,color:'bg-ungu'},
  {nama:'Cabut Gigi',       jumlah:28,persen:11,color:'bg-kuning'},
  {nama:'Pemasangan Behel', jumlah:20,persen:8, color:'bg-merah'},
]

const kpi = [
  {Icon:MdPerson,        label:'Total Pasien',   value:'248',     color:'text-biru',   bg:'bg-biru-muda'},
  {Icon:MdCalendarToday, label:'Total Tindakan', value:'312',     color:'text-hijau',  bg:'bg-hijau-muda'},
  {Icon:MdPayment,       label:'Pendapatan YTD', value:'Rp 203jt',color:'text-kuning', bg:'bg-kuning-muda'},
  {Icon:MdTrendingUp,    label:'Retensi Pasien', value:'78%',     color:'text-ungu',   bg:'bg-ungu-muda'},
]

export default function Laporan() {
  return (
    <div>
      <PageHeader title="Laporan" breadcrumb={['Beranda','Laporan']}>
        <button className="flex items-center gap-1.5 bg-biru hover:bg-biru-hover text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm">
          <MdDownload className="text-base"/> Unduh Laporan
        </button>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {kpi.map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.10)] transition-shadow">
            <div className={`${k.bg} p-2.5 rounded-xl w-fit mb-3`}><k.Icon className={`text-[18px] ${k.color}`}/></div>
            <p className="text-2xl font-bold text-teks">{k.value}</p>
            <p className="text-sm text-teks-samping mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-4 border-b border-garis">
            <h3 className="font-bold text-teks text-sm">Rekap Bulanan 2025</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-latar border-b border-garis">
                {['Bulan','Pasien','Tindakan','Pendapatan'].map(h=>(
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-teks-samping uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {monthlyData.map(m => (
                <tr key={m.bulan} className="hover:bg-latar transition-colors">
                  <td className="px-5 py-3 font-semibold text-teks">{m.bulan}</td>
                  <td className="px-5 py-3 text-teks-samping">{m.pasien}</td>
                  <td className="px-5 py-3 text-teks-samping">{m.tindakan}</td>
                  <td className="px-5 py-3 font-bold text-teks">{m.pendapatan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
          <h3 className="font-bold text-teks text-sm mb-1">Tindakan Paling Sering</h3>
          <p className="text-xs text-teks-samping mb-5">250 total tindakan tercatat</p>
          <div className="space-y-4">
            {tindakanPopuler.map(t => (
              <div key={t.nama}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${t.color} flex-shrink-0`}/>
                    <span className="text-sm font-semibold text-teks">{t.nama}</span>
                  </div>
                  <span className="text-xs text-teks-samping font-semibold">{t.jumlah}x · {t.persen}%</span>
                </div>
                <div className="w-full bg-latar rounded-full h-2">
                  <div className={`${t.color} h-2 rounded-full transition-all`} style={{width:`${t.persen*2.9}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
