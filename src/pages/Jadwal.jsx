import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MdAddCircle, MdClose, MdEdit, MdDelete, MdSearch } from 'react-icons/md'

const initialData = [
  { id:'J001', pasien:'Budi Santoso',   dokter:'drg. Sari',  tanggal:'2025-06-02', jam:'09:00', tindakan:'Scaling',         status:'Terjadwal' },
  { id:'J002', pasien:'Ani Rahayu',     dokter:'drg. Reza',  tanggal:'2025-06-02', jam:'10:30', tindakan:'Tambal Gigi',      status:'Selesai'   },
  { id:'J003', pasien:'Citra Dewi',     dokter:'drg. Sari',  tanggal:'2025-06-02', jam:'13:00', tindakan:'Konsultasi',       status:'Terjadwal' },
  { id:'J004', pasien:'Deni Kurniawan', dokter:'drg. Reza',  tanggal:'2025-06-03', jam:'08:30', tindakan:'Cabut Gigi',       status:'Terjadwal' },
  { id:'J005', pasien:'Eka Putri',      dokter:'drg. Sari',  tanggal:'2025-06-03', jam:'11:00', tindakan:'Pemasangan Behel', status:'Selesai'   },
  { id:'J006', pasien:'Fajar Hidayat',  dokter:'drg. Reza',  tanggal:'2025-06-03', jam:'14:00', tindakan:'Scaling',          status:'Dibatalkan'},
  { id:'J007', pasien:'Gita Lestari',   dokter:'drg. Sari',  tanggal:'2025-06-04', jam:'09:30', tindakan:'Veneer',           status:'Terjadwal' },
  { id:'J008', pasien:'Hendra Wijaya',  dokter:'drg. Reza',  tanggal:'2025-06-04', jam:'10:00', tindakan:'Tambal Gigi',      status:'Selesai'   },
]

const statusBadge = {
  Terjadwal:  'bg-biru-muda text-biru',
  Selesai:    'bg-hijau-muda text-hijau',
  Dibatalkan: 'bg-merah-muda text-merah',
}

const tabs = ['All','Terjadwal','Selesai','Dibatalkan']
const emptyForm = { pasien:'', dokter:'drg. Sari', tanggal:'', jam:'', tindakan:'Scaling', status:'Terjadwal' }
const inputCls = 'w-full px-4 py-3 border border-garis rounded-xl text-sm text-teks outline-none focus:border-biru focus:ring-2 focus:ring-biru-muda bg-latar transition'
const labelCls = 'block text-sm font-semibold text-teks mb-2'

export default function Jadwal() {
  const [data, setData]           = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]       = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.pasien || !form.tanggal) return
    setData([...data, { id:`J${String(data.length+1).padStart(3,'0')}`, ...form }])
    setForm(emptyForm); setShowModal(false)
  }

  const filtered = data.filter(j =>
    (activeTab==='All' || j.status===activeTab) &&
    j.pasien.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="Jadwal & Reminder" breadcrumb={['Beranda','Jadwal & Reminder']}>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-biru hover:bg-biru-hover text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm">
          <MdAddCircle className="text-base" /> Tambah Jadwal
        </button>
      </PageHeader>

      {/* Summary mini-cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          {label:'Terjadwal', color:'bg-biru-muda text-biru'},
          {label:'Selesai',   color:'bg-hijau-muda text-hijau'},
          {label:'Dibatalkan',color:'bg-merah-muda text-merah'},
        ].map(c => (
          <div key={c.label} className={`${c.color} rounded-2xl p-4 text-center shadow-sm`}>
            <p className="text-3xl font-bold">{data.filter(d=>d.status===c.label).length}</p>
            <p className="text-sm font-semibold mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-garis flex-wrap gap-3">
          <div className="flex items-center gap-1">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${activeTab===t?'bg-biru text-white':'text-teks-samping hover:text-teks hover:bg-latar'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative mb-3">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-teks-samping text-lg" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pasien..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-latar border-b border-garis">
                {['Pasien','Dokter','Tanggal','Jam','Tindakan','Status','Aksi'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-teks-samping uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {filtered.map(j => (
                <tr key={j.id} className="hover:bg-latar transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-biru-muda flex items-center justify-center text-biru text-xs font-bold flex-shrink-0">{j.pasien[0]}</div>
                      <span className="font-semibold text-teks">{j.pasien}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-teks-samping">{j.dokter}</td>
                  <td className="px-5 py-3.5 text-teks-samping">{j.tanggal}</td>
                  <td className="px-5 py-3.5 font-semibold text-teks">{j.jam}</td>
                  <td className="px-5 py-3.5 text-teks-samping">{j.tindakan}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusBadge[j.status]}`}>{j.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                      <button className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Showing {filtered.length} entries</p>
          <div className="flex items-center gap-1">
            {['<','1','2','>'].map((p,i) => (
              <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${i===1?'bg-biru text-white':'text-teks-samping hover:bg-latar'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-garis">
              <h2 className="font-bold text-teks">Tambah Jadwal Baru</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-latar text-teks-samping hover:text-merah transition-colors"><MdClose className="text-xl"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className={labelCls}>Nama Pasien</label><input name="pasien" value={form.pasien} onChange={handleChange} required className={inputCls} placeholder="Nama pasien"/></div>
              <div><label className={labelCls}>Dokter</label><select name="dokter" value={form.dokter} onChange={handleChange} className={inputCls}><option>drg. Sari</option><option>drg. Reza</option></select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Tanggal</label><input name="tanggal" value={form.tanggal} onChange={handleChange} required type="date" className={inputCls}/></div>
                <div><label className={labelCls}>Jam</label><input name="jam" value={form.jam} onChange={handleChange} required type="time" className={inputCls}/></div>
              </div>
              <div><label className={labelCls}>Tindakan</label><select name="tindakan" value={form.tindakan} onChange={handleChange} className={inputCls}>{['Scaling','Tambal Gigi','Cabut Gigi','Konsultasi','Pemasangan Behel','Veneer'].map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className={labelCls}>Status</label><select name="status" value={form.status} onChange={handleChange} className={inputCls}><option>Terjadwal</option><option>Selesai</option><option>Dibatalkan</option></select></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-full border border-garis text-teks-samping text-sm font-semibold hover:bg-latar transition">Batal</button>
                <button type="submit" className="flex-1 py-2.5 rounded-full bg-biru hover:bg-biru-hover text-white text-sm font-bold transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
