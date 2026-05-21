import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import TextArea from '../components/TextArea'
import Table from '../components/Table'
import { MdAddCircle, MdEdit, MdDelete, MdSearch } from 'react-icons/md'

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

const tindakanType = { 'Scaling':'primary','Tambal Gigi':'success','Konsultasi':'purple','Cabut Gigi':'danger','Pemasangan Behel':'warning','Veneer':'pink' }
const emptyForm = { pasien:'', dokter:'drg. Sari', tindakan:'Scaling', tanggal:'', catatan:'' }

export default function Riwayat() {
  const [data, setData]           = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [search, setSearch]       = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = () => {
    if (!form.pasien || !form.tanggal) return
    setData([...data, { id:`R${String(data.length+1).padStart(3,'0')}`, ...form }])
    setForm(emptyForm); setShowModal(false)
  }

  const filtered = data.filter(r => r.pasien.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageHeader title="Riwayat Perawatan" breadcrumb={['Beranda','Riwayat Perawatan']}>
        <Button type="primary" icon={<MdAddCircle/>} onClick={() => setShowModal(true)}>
          Tambah Riwayat
        </Button>
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

        <Table headers={['Pasien','Dokter','Tindakan','Tanggal','Catatan','Aksi']}>
          {filtered.map(r => (
            <tr key={r.id} className="hover:bg-latar transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <Avatar name={r.pasien} size="sm"/>
                  <span className="font-semibold text-teks text-sm whitespace-nowrap">{r.pasien}</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-sm text-teks-samping whitespace-nowrap">{r.dokter}</td>
              <td className="px-5 py-3.5 whitespace-nowrap">
                <Badge type={tindakanType[r.tindakan] || 'secondary'}>{r.tindakan}</Badge>
              </td>
              <td className="px-5 py-3.5 text-sm text-teks-samping whitespace-nowrap">{r.tanggal}</td>
              <td className="px-5 py-3.5 text-sm text-teks-samping max-w-xs truncate">{r.catatan}</td>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Riwayat Perawatan"
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
            <SelectField label="Tindakan" name="tindakan" value={form.tindakan} onChange={handleChange}
              options={['Scaling','Tambal Gigi','Cabut Gigi','Konsultasi','Pemasangan Behel','Veneer']} placeholder=""/>
            <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} required/>
          </div>
          <TextArea label="Catatan Dokter" name="catatan" value={form.catatan} onChange={handleChange}
            rows={3} placeholder="Catatan tindakan dan kondisi pasien..."/>
        </div>
      </Modal>
    </div>
  )
}
