import PageHeader from '../components/PageHeader'
import { MdDownload, MdTrendingUp, MdPerson, MdPayment, MdCalendarToday } from 'react-icons/md'

const monthlyData = [
  { bulan:'Januari', pasien:38, pendapatan:'Rp 28.500.000', tindakan:45 },
  { bulan:'Februari', pasien:41, pendapatan:'Rp 31.200.000', tindakan:50 },
  { bulan:'Maret',    pasien:35, pendapatan:'Rp 27.800.000', tindakan:42 },
  { bulan:'April',    pasien:48, pendapatan:'Rp 38.400.000', tindakan:58 },
  { bulan:'Mei',      pasien:52, pendapatan:'Rp 42.100.000', tindakan:63 },
  { bulan:'Juni',     pasien:44, pendapatan:'Rp 35.600.000', tindakan:54 },
]

const tindakanPopuler = [
  { nama:'Scaling',         jumlah:85, persen:34 },
  { nama:'Tambal Gigi',     jumlah:72, persen:29 },
  { nama:'Konsultasi',      jumlah:45, persen:18 },
  { nama:'Cabut Gigi',      jumlah:28, persen:11 },
  { nama:'Pemasangan Behel',jumlah:20, persen:8  },
]

export default function Laporan() {
  return (
    <div>
      <PageHeader title="Laporan" breadcrumb={['Beranda', 'Laporan']}>
        <button className="flex items-center gap-1 bg-biru text-white px-4 py-2 rounded-lg text-sm font-medium">
          <MdDownload /> Unduh Laporan
        </button>
      </PageHeader>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 px-2">
        {[
          { icon:<MdPerson/>,       label:'Total Pasien',       value:'248',          color:'bg-biru-muda text-biru' },
          { icon:<MdCalendarToday/>,label:'Total Tindakan',      value:'312',          color:'bg-green-100 text-hijau' },
          { icon:<MdPayment/>,      label:'Pendapatan YTD',     value:'Rp 203jt',     color:'bg-yellow-100 text-kuning' },
          { icon:<MdTrendingUp/>,   label:'Retensi Pasien',     value:'78%',          color:'bg-purple-100 text-ungu' },
        ].map(k => (
          <div key={k.label} className={`${k.color} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-2 text-xl">{k.icon}</div>
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-sm mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 px-2">
        {/* Monthly table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-garis">
            <h3 className="font-semibold text-teks">Rekap Bulanan 2025</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-biru-muda text-biru">
              <tr>{['Bulan','Pasien','Tindakan','Pendapatan'].map(h => (
                <th key={h} className="text-left p-3 font-semibold">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {monthlyData.map(m => (
                <tr key={m.bulan} className="border-b border-garis hover:bg-latar">
                  <td className="p-3 font-medium text-teks">{m.bulan}</td>
                  <td className="p-3 text-teks-samping">{m.pasien}</td>
                  <td className="p-3 text-teks-samping">{m.tindakan}</td>
                  <td className="p-3 font-semibold text-teks">{m.pendapatan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tindakan populer */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-teks mb-4">Tindakan Paling Sering</h3>
          <div className="space-y-4">
            {tindakanPopuler.map(t => (
              <div key={t.nama}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-teks font-medium">{t.nama}</span>
                  <span className="text-teks-samping">{t.jumlah}x ({t.persen}%)</span>
                </div>
                <div className="w-full bg-biru-muda rounded-full h-2.5">
                  <div
                    className="bg-biru h-2.5 rounded-full transition-all"
                    style={{ width: `${t.persen * 2.8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
