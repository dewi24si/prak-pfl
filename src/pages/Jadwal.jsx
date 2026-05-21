import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import Table from '../components/Table'
import { MdAddCircle, MdEdit, MdDelete, MdSearch } from 'react-icons/md'

const initialData = [
  { id:'J001', pasien:'Budi Santoso',   dokter:'drg. Sari', tanggal:'2025-06-02', jam:'09:00', tindakan:'Scaling',          status:'Terjadwal' },
  { id:'J002', pasien:'Ani Rahayu',     dokter:'drg. Reza', tanggal:'2025-06-02', jam:'10:30', tindakan:'Tambal Gigi',       status:'Selesai'   },
  { id:'J003', pasien:'Citra Dewi',     dokter:'drg. Sari', tanggal:'2025-06-02', jam:'13:00', tindakan:'Konsultasi',        status:'Terjadwal' },
  { id:'J004', pasien:'Deni Kurniawan', dokter:'drg. Reza', tanggal:'2025-06-03', jam:'08:30', tindakan:'Cabut Gigi',        status:'Terjadwal' },
  { id:'J005', pasien:'Eka Putri',      dokter:'drg. Sari', tanggal:'2025-06-03', jam:'11:00', tindakan:'Pemasangan Behel',  status:'Selesai'   },
  { id:'J006', pasien:'Fajar Hidayat',  dokter:'drg. Reza', tanggal:'2025-06-03', jam:'14:00', tindakan:'Scaling',           status:'Dibatalkan'},
  { id:'J007', pasien:'Gita Lestari',   dokter:'drg. Sari', tanggal:'2025-06-04', jam:'09:30', tindakan:'Veneer',            status:'Terjadwal' },
  { id:'J008', pasien:'Hendra Wijaya',  dokter:'drg. Reza', tanggal:'2025-06-04', jam:'10:00', tindakan:'Tambal Gigi',       status:'Selesai'   },
]

const statusType = { Terjadwal:'primary', Selesai:'success', Dibatalkan:'danger' }
const tabs = ['All','Terjadwal','Selesai','Dibatalkan']
const emptyForm = { pasien:'', dokter:'drg. Sari', tanggal:'', jam:'', tindakan:'Scaling', status:'Terjadwal' }
const tindakanList = ['Scaling','Tambal Gigi','Cabut Gigi','Konsultasi','Pemasangan Behel','Veneer']

export default function Jadwal() {
  const [data, setData]           = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]       = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = e => {
    e?.preventDefault()
    if (!form.pasien || !form.tanggal) return
    setData([...data, { id:`J${String(data.length+1).padStart(3,'0')}`, ...form }])
    setForm(emptyForm); setShowModal(false)
  }

  const filtered = data.filter(j =>
    (activeTab==='All' || j.status===activeTab) &&
    j.pasien.toLowerCase().includes(search.toLowerCase())
  )

  const summaryCards = [
    { label:'Terjadwal', type:'primary' },
    { label:'Selesai',   type:'success' },
    { label:'Dibatalkan',type:'danger'  },
  ]

  return (
    <div>
      <PageHeader title="Jadwal & Reminder" breadcrumb={['Beranda','Jadwal & Reminder']}>
        <Button type="primary" icon={<MdAddCircle/>} onClick={() => setShowModal(true)}>
          Tambah Jadwal
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {summaryCards.map(c => (
          <div key={c.label} className={`rounded-2xl p-4 text-center shadow-sm ${
            c.type==='primary'?'bg-biru-muda text-biru':c.type==='success'?'bg-hijau-muda text-hijau':'bg-merah-muda text-merah'}`}>
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
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-teks-samping text-lg"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pasien..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping"/>
          </div>
        </div>

        <Table headers={['Pasien','Dokter','Tanggal','Jam','Tindakan','Status','Aksi']}>
          {filtered.map(j => (
            <tr key={j.id} className="hover:bg-latar transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <Avatar name={j.pasien} size="sm"/>
                  <span className="font-semibold text-teks text-sm">{j.pasien}</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-sm text-teks-samping">{j.dokter}</td>
              <td className="px-5 py-3.5 text-sm text-teks-samping">{j.tanggal}</td>
              <td className="px-5 py-3.5 text-sm font-semibold text-teks">{j.jam}</td>
              <td className="px-5 py-3.5 text-sm text-teks-samping">{j.tindakan}</td>
              <td className="px-5 py-3.5">
                <Badge type={statusType[j.status]}>{j.status}</Badge>
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
          <p className="text-xs text-teks-samping">Showing {filtered.length} entries</p>
          <div className="flex items-center gap-1">
            {['<','1','2','>'].map((p,i) => (
              <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${i===1?'bg-biru text-white':'text-teks-samping hover:bg-latar'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Jadwal Baru"
        footer={
          <div className="flex gap-3">
            <Button type="outline" fullWidth onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="primary" fullWidth onClick={handleSubmit}>Simpan</Button>
          </div>
        }>
        <div className="space-y-4">
          <InputField label="Nama Pasien" name="pasien" value={form.pasien} onChange={handleChange} required placeholder="Nama pasien"/>
          <SelectField label="Dokter" name="dokter" value={form.dokter} onChange={handleChange}
            options={['drg. Sari','drg. Reza']} placeholder=""/>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} required/>
            <InputField label="Jam" name="jam" type="time" value={form.jam} onChange={handleChange} required/>
          </div>
          <SelectField label="Tindakan" name="tindakan" value={form.tindakan} onChange={handleChange}
            options={tindakanList} placeholder=""/>
          <SelectField label="Status" name="status" value={form.status} onChange={handleChange}
            options={['Terjadwal','Selesai','Dibatalkan']} placeholder=""/>
        </div>
      </Modal>
    </div>
  )
}
