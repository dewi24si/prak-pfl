import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import StatCard from '../components/StatCard'
import Table from '../components/Table'
import { MdDownload, MdTrendingUp, MdPerson, MdPayment, MdCalendarToday, MdHelpOutline } from 'react-icons/md'

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
  {Icon:MdPerson,        label:'Total Pasien',   value:'248',      change:'+12%', up:true,  color:'text-biru',   bg:'bg-biru-muda'  },
  {Icon:MdCalendarToday, label:'Total Tindakan', value:'312',      change:'+8%',  up:true,  color:'text-hijau',  bg:'bg-hijau-muda' },
  {Icon:MdPayment,       label:'Pendapatan YTD', value:'Rp 203jt', change:'+18%', up:true,  color:'text-kuning', bg:'bg-kuning-muda'},
  {Icon:MdTrendingUp,    label:'Retensi Pasien', value:'78%',      change:'-2%',  up:false, color:'text-ungu',   bg:'bg-ungu-muda'  },
]

// ── Data FAQ untuk DaisyUI Accordion ─────────────────────────────
const faqItems = [
  {
    q: 'Bagaimana cara membaca laporan pendapatan bulanan?',
    a: 'Laporan pendapatan bulanan menampilkan total pemasukan dari seluruh tindakan yang telah selesai dilakukan pada bulan bersangkutan. Pastikan status pembayaran pasien sudah diperbarui agar data akurat.'
  },
  {
    q: 'Apa yang dimaksud dengan Retensi Pasien?',
    a: 'Retensi pasien adalah persentase pasien lama yang kembali melakukan kunjungan dalam periode tertentu. Angka ini menunjukkan tingkat kepuasan dan loyalitas pasien terhadap klinik.'
  },
  {
    q: 'Mengapa data tindakan bulan ini berbeda dengan bulan lalu?',
    a: 'Perbedaan jumlah tindakan antar bulan dipengaruhi oleh jumlah hari kerja, hari libur nasional, dan fluktuasi jumlah pasien. Lihat detail per tindakan di tabel Rekap Bulanan untuk analisis lebih lanjut.'
  },
  {
    q: 'Bagaimana cara mengunduh laporan?',
    a: 'Klik tombol "Unduh Laporan" di pojok kanan atas halaman ini. Laporan akan diunduh dalam format PDF dan mencakup semua data yang ditampilkan pada halaman ini.'
  },
]

export default function Laporan() {
  return (
    <div>
      <PageHeader title="Laporan" breadcrumb={['Beranda','Laporan']}>
        <Button type="primary" icon={<MdDownload/>}>Unduh Laporan</Button>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {kpi.map((k,i) => <StatCard key={i} {...k}/>)}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-4 border-b border-garis">
            <h3 className="font-bold text-teks text-sm">Rekap Bulanan 2025</h3>
          </div>
          <Table headers={['Bulan','Pasien','Tindakan','Pendapatan']}>
            {monthlyData.map(m => (
              <tr key={m.bulan} className="hover:bg-latar transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-teks">{m.bulan}</td>
                <td className="px-5 py-3 text-sm text-teks-samping">{m.pasien}</td>
                <td className="px-5 py-3 text-sm text-teks-samping">{m.tindakan}</td>
                <td className="px-5 py-3 text-sm font-bold text-teks">{m.pendapatan}</td>
              </tr>
            ))}
          </Table>
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

      {/* ── DaisyUI Accordion · FAQ Laporan ────────────────────── */}
      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] p-6">
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
