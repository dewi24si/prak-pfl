import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MdReceiptLong, MdClose, MdEdit, MdDelete, MdSearch } from 'react-icons/md'

const tindakanHarga = { 'Scaling':'Rp 250.000','Tambal Gigi':'Rp 350.000','Cabut Gigi':'Rp 300.000','Konsultasi':'Rp 100.000','Pemasangan Behel':'Rp 5.000.000','Veneer':'Rp 2.500.000' }
const initialData = [
  { id:'TRX001', pasien:'Ani Rahayu',     tindakan:'Tambal Gigi',      jumlah:'Rp 350.000',   tanggal:'2025-06-02', status:'Lunas'       },
  { id:'TRX002', pasien:'Eka Putri',      tindakan:'Pemasangan Behel', jumlah:'Rp 5.000.000', tanggal:'2025-06-02', status:'Lunas'       },
  { id:'TRX003', pasien:'Hendra Wijaya',  tindakan:'Tambal Gigi',      jumlah:'Rp 350.000',   tanggal:'2025-06-03', status:'Lunas'       },
  { id:'TRX004', pasien:'Budi Santoso',   tindakan:'Scaling',          jumlah:'Rp 250.000',   tanggal:'2025-06-03', status:'Belum Lunas' },
  { id:'TRX005', pasien:'Citra Dewi',     tindakan:'Konsultasi',       jumlah:'Rp 100.000',   tanggal:'2025-06-04', status:'Lunas'       },
  { id:'TRX006', pasien:'Deni Kurniawan', tindakan:'Cabut Gigi',       jumlah:'Rp 300.000',   tanggal:'2025-06-04', status:'Belum Lunas' },
  { id:'TRX007', pasien:'Gita Lestari',   tindakan:'Veneer',           jumlah:'Rp 2.500.000', tanggal:'2025-06-05', status:'Lunas'       },
  { id:'TRX008', pasien:'Irwan Saputra',  tindakan:'Scaling',          jumlah:'Rp 250.000',   tanggal:'2025-06-05', status:'Lunas'       },
]
const statusBadge = { 'Lunas':'bg-hijau-muda text-hijau','Belum Lunas':'bg-kuning-muda text-kuning' }
const tabs = ['All','Lunas','Belum Lunas']
const emptyForm = { pasien:'', tindakan:'Scaling', tanggal:'', status:'Lunas' }
const inputCls = 'w-full px-4 py-3 border border-garis rounded-xl text-sm text-teks outline-none focus:border-biru focus:ring-2 focus:ring-biru-muda bg-latar transition'
const labelCls = 'block text-sm font-semibold text-teks mb-2'

export default function Pembayaran() {
  const [data, setData]           = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]       = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.pasien || !form.tanggal) return
    setData([...data, { id:`TRX${String(data.length+1).padStart(3,'0')}`, jumlah:tindakanHarga[form.tindakan], ...form }])
    setForm(emptyForm); setShowModal(false)
  }

  const filtered = data.filter(p =>
    (activeTab==='All' || p.status===activeTab) &&
    p.pasien.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="Pembayaran" breadcrumb={['Beranda','Pembayaran']}>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-biru hover:bg-biru-hover text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm">
          <MdReceiptLong className="text-base" /> Buat Kwitansi
        </button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          {label:'Total Transaksi',value:data.length, color:'bg-biru-muda text-biru'},
          {label:'Lunas',          value:data.filter(d=>d.status==='Lunas').length, color:'bg-hijau-muda text-hijau'},
          {label:'Belum Lunas',    value:data.filter(d=>d.status==='Belum Lunas').length, color:'bg-kuning-muda text-kuning'},
        ].map(c => (
          <div key={c.label} className={`${c.color} rounded-2xl p-4 text-center shadow-sm`}>
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-sm font-semibold mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-garis flex-wrap gap-3">
          <div className="flex items-center gap-1">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${activeTab===t?'bg-biru text-white':'text-teks-samping hover:text-teks hover:bg-latar'}`}>{t}</button>
            ))}
          </div>
          <div className="relative mb-3">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-teks-samping text-lg"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pasien..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-latar border-b border-garis">
                {['ID','Pasien','Tindakan','Jumlah','Tanggal','Status','Aksi'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-teks-samping uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-latar transition-colors">
                  <td className="px-5 py-3.5 text-xs text-teks-samping font-mono">{p.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-biru-muda flex items-center justify-center text-biru text-xs font-bold flex-shrink-0">{p.pasien[0]}</div>
                      <span className="font-semibold text-teks">{p.pasien}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-teks-samping">{p.tindakan}</td>
                  <td className="px-5 py-3.5 font-bold text-teks">{p.jumlah}</td>
                  <td className="px-5 py-3.5 text-teks-samping">{p.tanggal}</td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusBadge[p.status]}`}>{p.status}</span></td>
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
          <p className="text-xs text-teks-samping">Showing {filtered.length} of {data.length} entries</p>
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
              <h2 className="font-bold text-teks">Buat Kwitansi Baru</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-latar text-teks-samping hover:text-merah transition-colors"><MdClose className="text-xl"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className={labelCls}>Nama Pasien</label><input name="pasien" value={form.pasien} onChange={handleChange} required className={inputCls} placeholder="Nama pasien"/></div>
              <div><label className={labelCls}>Tindakan</label><select name="tindakan" value={form.tindakan} onChange={handleChange} className={inputCls}>{Object.keys(tindakanHarga).map(t=><option key={t}>{t}</option>)}</select></div>
              <div className="px-4 py-2.5 bg-biru-muda rounded-xl text-sm text-biru font-bold">Tarif: {tindakanHarga[form.tindakan]}</div>
              <div><label className={labelCls}>Tanggal</label><input name="tanggal" value={form.tanggal} onChange={handleChange} required type="date" className={inputCls}/></div>
              <div><label className={labelCls}>Status</label><select name="status" value={form.status} onChange={handleChange} className={inputCls}><option>Lunas</option><option>Belum Lunas</option></select></div>
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
