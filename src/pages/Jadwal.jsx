import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import Table from '../components/Table'
import Alert from '../components/Alert'
import Spinner from '../components/Spinner'
import { MdAddCircle, MdEdit, MdDelete, MdSearch } from 'react-icons/md'
import { jadwalAPI, pasienAPI } from '../services/supabaseAPI'

const statusType   = { Terjadwal: 'primary', Selesai: 'success', Dibatalkan: 'danger' }
const tabs         = ['All', 'Terjadwal', 'Selesai', 'Dibatalkan']
const tindakanList = ['Scaling', 'Tambal Gigi', 'Cabut Gigi', 'Konsultasi', 'Pemasangan Behel', 'Veneer', 'Bleaching', 'Implan']
const dokterList   = ['drg. Sari', 'drg. Budi', 'drg. Rina', 'drg. Hendra']
const emptyForm    = { pasien_id: '', nama_pasien: '', dokter: 'drg. Sari', tanggal: '', jam: '', jenis_perawatan: 'Scaling', status: 'Terjadwal', catatan: '' }

export default function Jadwal() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]       = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]       = useState('')
  const [pasienList, setPasienList] = useState([])

  useEffect(() => { loadData(); loadPasien() }, [])

  const loadPasien = async () => {
    try { setPasienList(await pasienAPI.fetchAll()) }
    catch { /* dropdown pasien gagal dimuat, biarkan kosong */ }
  }

  const loadData = async () => {
    try { setLoading(true); setError(''); const r = await jadwalAPI.fetchAll(); setData(r) }
    catch { setError('Gagal memuat data jadwal') }
    finally { setLoading(false) }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePasienChange = e => {
    const id = e.target.value
    const pasien = pasienList.find(p => String(p.id) === String(id))
    setForm({ ...form, pasien_id: id, nama_pasien: pasien?.nama_lengkap || '' })
  }

  const handleOpenAdd = () => { setEditId(null); setForm(emptyForm); setShowModal(true) }
  const handleOpenEdit = j => {
    setEditId(j.id)
    setForm({ pasien_id: j.pasien_id || '', nama_pasien: j.nama_pasien, dokter: j.dokter, tanggal: j.tanggal, jam: j.jam, jenis_perawatan: j.jenis_perawatan, status: j.status, catatan: j.catatan || '' })
    setShowModal(true)
  }

  const handleSubmit = async e => {
    e?.preventDefault()
    if (!form.pasien_id || !form.tanggal || !form.jam) return
    setLoading(true); setError('')
    try {
      editId ? await jadwalAPI.update(editId, form) : await jadwalAPI.create(form)
      setSuccess(editId ? 'Jadwal berhasil diperbarui!' : 'Jadwal berhasil ditambahkan!')
      setShowModal(false); setForm(emptyForm); setEditId(null)
      loadData(); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError('Gagal menyimpan: ' + err.message) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return
    setLoading(true)
    try { await jadwalAPI.delete(id); setSuccess('Jadwal dihapus!'); loadData(); setTimeout(() => setSuccess(''), 3000) }
    catch (err) { setError('Gagal menghapus: ' + err.message) }
    finally { setLoading(false) }
  }

  const filtered = data.filter(j =>
    (activeTab === 'All' || j.status === activeTab) &&
    j.nama_pasien?.toLowerCase().includes(search.toLowerCase())
  )

  const countByStatus = s => data.filter(j => j.status === s).length

  return (
    <div>
      <PageHeader title="Jadwal & Reminder" breadcrumb={['Beranda', 'Jadwal & Reminder']}>
        <Button type="primary" icon={<MdAddCircle/>} onClick={handleOpenAdd}>Tambah Jadwal</Button>
      </PageHeader>

      {error   && <div className="mb-4"><Alert type="danger"  message={error}   onClose={() => setError('')}/></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')}/></div>}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[['Terjadwal','bg-biru-muda text-biru'],['Selesai','bg-hijau-muda text-hijau'],['Dibatalkan','bg-merah-muda text-merah']].map(([s, cls]) => (
          <div key={s} className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] p-5">
            <p className="text-xs text-teks-samping font-semibold mb-1">{s}</p>
            <p className={`text-3xl font-bold ${cls.split(' ')[1]}`}>{countByStatus(s)}</p>
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
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping"/>
          </div>
        </div>

        {loading && <div className="flex items-center justify-center gap-3 py-10"><Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat data...</span></div>}
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-teks-samping text-sm">Belum ada data jadwal.</div>}
        {!loading && filtered.length > 0 && (
          <Table headers={['Pasien', 'Dokter', 'Tanggal', 'Jam', 'Perawatan', 'Status', 'Aksi']}>
            {filtered.map(j => (
              <tr key={j.id} className="hover:bg-latar transition-colors">
                <td className="px-3 py-3.5 font-semibold text-teks">{j.nama_pasien}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{j.dokter}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{j.tanggal ? new Date(j.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{j.jam}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{j.jenis_perawatan}</td>
                <td className="px-3 py-3.5"><Badge type={statusType[j.status]}>{j.status}</Badge></td>
                <td className="px-3 py-3.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => handleOpenEdit(j)} className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                    <button onClick={() => handleDelete(j.id)} className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
        <div className="px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Showing {filtered.length} of {data.length} entries</p>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditId(null) }}
        title={editId ? 'Edit Jadwal' : 'Tambah Jadwal'}
        footer={<div className="flex gap-3"><Button type="outline" fullWidth onClick={() => { setShowModal(false); setEditId(null) }}>Batal</Button><Button type="primary" fullWidth onClick={handleSubmit} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</Button></div>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField label="Nama Pasien" name="pasien_id" value={form.pasien_id} onChange={handlePasienChange} required
            options={pasienList.map(p => ({ value: p.id, label: p.nama_lengkap }))} placeholder="Pilih pasien..."/>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} required/>
            <InputField label="Jam" name="jam" type="time" value={form.jam} onChange={handleChange} required/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Dokter" name="dokter" value={form.dokter} onChange={handleChange} options={dokterList} placeholder=""/>
            <SelectField label="Jenis Perawatan" name="jenis_perawatan" value={form.jenis_perawatan} onChange={handleChange} options={tindakanList} placeholder=""/>
          </div>
          <SelectField label="Status" name="status" value={form.status} onChange={handleChange} options={['Terjadwal','Selesai','Dibatalkan']} placeholder=""/>
          <InputField label="Catatan" name="catatan" value={form.catatan} onChange={handleChange} placeholder="Catatan tambahan (opsional)"/>
        </form>
      </Modal>
    </div>
  )
}
