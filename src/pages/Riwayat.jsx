import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MdAddCircle, MdClose, MdEdit, MdDelete, MdSearch } from 'react-icons/md'

const initialData = [
  { id:'R001', pasien:'Budi Santoso',   dokter:'drg. Sari', tindakan:'Scaling',         tanggal:'2025-03-10', catatan:'Karang gigi bersih, disarankan scaling 6 bulan lagi.' },
  { id:'R002', pasien:'Ani Rahayu',     dokter:'drg. Reza', tindakan:'Tambal Gigi',      tanggal:'2025-04-02', catatan:'Gigi geraham kiri bawah, tambalan komposit.' },
  { id:'R003', pasien:'Citra Dewi',     dokter:'drg. Sari', tindakan:'Konsultasi',       tanggal:'2025-04-15', catatan:'Keluhan sensitif, disarankan pasta gigi sensitif.' },
  { id:'R004', pasien:'Deni Kurniawan', dokter:'drg. Reza', tindakan:'Cabut Gigi',       tanggal:'2025-05-01', catatan:'Gigi bungsu kanan atas, pencabutan normal.' },
  { id:'R005', pasien:'Eka Putri',      dokter:'drg. Sari', tindakan:'Pemasangan Behel', tanggal:'2025-05-20', catatan:'Behel metal, kontrol berikutnya 1 bulan.' },
  { id:'R006', pasien:'Fajar Hidayat',  dokter:'drg. Reza', tindakan:'Scaling',          tanggal:'2025-05-25', catatan:'Scaling selesai, gusi sedikit berdarah — rutin flossing.' },
  { id:'R007', pasien:'Gita Lestari',   dokter:'drg. Sari', tindakan:'Veneer',           tanggal:'2025-06-01', catatan:'2 veneer gigi depan, hasil memuaskan.' },
  { id:'R008', pasien:'Hendra Wijaya',  dokter:'drg. Reza', tindakan:'Tambal Gigi',      tanggal:'2025-06-03', catatan:'Tambalan sementara, kembali 1 minggu.' },
]

const tindakanBadge = {
  'Scaling':'bg-biru-muda text-biru','Tambal Gigi':'bg-hijau-muda text-hijau',
  'Konsultasi':'bg-ungu-muda text-ungu','Cabut Gigi':'bg-merah-muda text-merah',
  'Pemasangan Behel':'bg-kuning-muda text-kuning','Veneer':'bg-pink-muda text-pink',
}

const emptyForm = { pasien:'', dokter:'drg. Sari', tindakan:'Scaling', tanggal:'', catatan:'' }
const inputCls = 'w-full px-4 py-3 border border-garis rounded-xl text-sm text-teks outline-none focus:border-biru focus:ring-2 focus:ring-biru-muda bg-latar transition'
const labelCls = 'block text-sm font-semibold text-teks mb-2'

export default function Riwayat() {
  const [data, setData]           = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [search, setSearch]       = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.pasien || !form.tanggal) return
    setData([...data, { id:`R${String(data.length+1).padStart(3,'0')}`, ...form }])
    setForm(emptyForm); setShowModal(false)
  }

  const filtered = data.filter(r => r.pasien.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageHeader title="Riwayat Perawatan" breadcrumb={['Beranda','Riwayat Perawatan']}>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-biru hover:bg-biru-hover text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm">
          <MdAddCircle className="text-base" /> Tambah Riwayat
        </button>
      </PageHeader>

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-garis">
          <div>
            <h3 className="font-bold text-teks text-sm">Rekam Medis Pasien</h3>
            <p className="text-xs text-teks-samping mt-0.5">{data.length} rekam medis</p>
          </div>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-teks-samping text-lg"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pasien..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-latar border-b border-garis">
                {['Pasien','Dokter','Tindakan','Tanggal','Catatan','Aksi'].map(h=>(
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-teks-samping uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-latar transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-biru-muda flex items-center justify-center text-biru text-xs font-bold flex-shrink-0">{r.pasien[0]}</div>
                      <span className="font-semibold text-teks whitespace-nowrap">{r.pasien}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-teks-samping whitespace-nowrap">{r.dokter}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${tindakanBadge[r.tindakan]||'bg-latar text-teks-samping'}`}>{r.tindakan}</span>
                  </td>
                  <td className="px-5 py-3.5 text-teks-samping whitespace-nowrap">{r.tanggal}</td>
                  <td className="px-5 py-3.5 text-teks-samping text-xs max-w-xs truncate">{r.catatan}</td>
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
            {['<','1','2','>'].map((p,i)=>(
              <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${i===1?'bg-biru text-white':'text-teks-samping hover:bg-latar'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-garis">
              <h2 className="font-bold text-teks">Tambah Riwayat Perawatan</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-latar text-teks-samping hover:text-merah transition-colors"><MdClose className="text-xl"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className={labelCls}>Nama Pasien</label><input name="pasien" value={form.pasien} onChange={handleChange} required className={inputCls} placeholder="Nama pasien"/></div>
              <div><label className={labelCls}>Dokter</label><select name="dokter" value={form.dokter} onChange={handleChange} className={inputCls}><option>drg. Sari</option><option>drg. Reza</option></select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Tindakan</label><select name="tindakan" value={form.tindakan} onChange={handleChange} className={inputCls}>{['Scaling','Tambal Gigi','Cabut Gigi','Konsultasi','Pemasangan Behel','Veneer'].map(t=><option key={t}>{t}</option>)}</select></div>
                <div><label className={labelCls}>Tanggal</label><input name="tanggal" value={form.tanggal} onChange={handleChange} required type="date" className={inputCls}/></div>
              </div>
              <div><label className={labelCls}>Catatan Dokter</label><textarea name="catatan" value={form.catatan} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Catatan tindakan..."/></div>
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
