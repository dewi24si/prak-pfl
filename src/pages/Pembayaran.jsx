import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import Table from '../components/Table'
import { MdReceiptLong, MdEdit, MdDelete, MdSearch } from 'react-icons/md'

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
const statusType = { 'Lunas':'success', 'Belum Lunas':'warning' }
const tabs = ['All','Lunas','Belum Lunas']
const emptyForm = { pasien:'', tindakan:'Scaling', tanggal:'', status:'Lunas' }

export default function Pembayaran() {
  const [data, setData]           = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]       = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = () => {
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
        <Button type="primary" icon={<MdReceiptLong/>} onClick={() => setShowModal(true)}>
          Buat Kwitansi
        </Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label:'Total Transaksi', value:data.length, cls:'bg-biru-muda text-biru' },
          { label:'Lunas',           value:data.filter(d=>d.status==='Lunas').length,       cls:'bg-hijau-muda text-hijau' },
          { label:'Belum Lunas',     value:data.filter(d=>d.status==='Belum Lunas').length, cls:'bg-kuning-muda text-kuning' },
        ].map(c => (
          <div key={c.label} className={`${c.cls} rounded-2xl p-4 text-center shadow-sm`}>
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

        <Table headers={['ID','Pasien','Tindakan','Jumlah','Tanggal','Status','Aksi']}>
          {filtered.map(p => (
            <tr key={p.id} className="hover:bg-latar transition-colors">
              <td className="px-5 py-3.5 text-xs text-teks-samping font-mono">{p.id}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <Avatar name={p.pasien} size="sm"/>
                  <span className="font-semibold text-teks text-sm">{p.pasien}</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-sm text-teks-samping">{p.tindakan}</td>
              <td className="px-5 py-3.5 text-sm font-bold text-teks">{p.jumlah}</td>
              <td className="px-5 py-3.5 text-sm text-teks-samping">{p.tanggal}</td>
              <td className="px-5 py-3.5">
                <Badge type={statusType[p.status]}>{p.status}</Badge>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                  <button className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        <div className="flex items-center justify-between px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Showing {filtered.length} of {data.length} entries</p>
          <div className="flex items-center gap-1">
            {['<','1','2','>'].map((p,i) => (
              <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${i===1?'bg-biru text-white':'text-teks-samping hover:bg-latar'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Buat Kwitansi Baru"
        footer={
          <div className="flex gap-3">
            <Button type="outline" fullWidth onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="primary" fullWidth onClick={handleSubmit}>Simpan</Button>
          </div>
        }>
        <div className="space-y-4">
          <InputField label="Nama Pasien" name="pasien" value={form.pasien} onChange={handleChange} required placeholder="Nama pasien"/>
          <SelectField label="Tindakan" name="tindakan" value={form.tindakan} onChange={handleChange}
            options={Object.keys(tindakanHarga)} placeholder=""/>
          {form.tindakan && (
            <div className="px-4 py-2.5 bg-biru-muda rounded-xl text-sm text-biru font-bold">
              Tarif: {tindakanHarga[form.tindakan]}
            </div>
          )}
          <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} required/>
          <SelectField label="Status" name="status" value={form.status} onChange={handleChange}
            options={['Lunas','Belum Lunas']} placeholder=""/>
        </div>
      </Modal>
    </div>
  )
}
