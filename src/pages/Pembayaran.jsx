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
import { MdReceiptLong, MdEdit, MdDelete, MdSearch } from 'react-icons/md'
import { pembayaranAPI, pasienAPI } from '../services/supabaseAPI'
import { tindakanList, hargaTindakan } from '../data/tindakan'

const statusType   = { 'Lunas': 'success', 'Belum Lunas': 'warning' }
const tabs         = ['All', 'Lunas', 'Belum Lunas']
const metodeBayar  = ['Cash', 'Transfer Bank', 'QRIS', 'BPJS', 'Kartu Kredit']
const emptyForm    = { pasien_id: '', nama_pasien: '', jenis_perawatan: 'Scaling', tanggal: '', biaya: '', metode_bayar: 'Cash', status: 'Belum Lunas', catatan: '' }

const formatRupiah = n => n ? `Rp ${Number(n).toLocaleString('id-ID')}` : 'Rp 0'

export default function Pembayaran() {
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
    try { setLoading(true); setError(''); const r = await pembayaranAPI.fetchAll(); setData(r) }
    catch { setError('Gagal memuat data pembayaran') }
    finally { setLoading(false) }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleTindakanChange = e => {
    const jenis_perawatan = e.target.value
    // Isi otomatis biaya sesuai harga acuan, tapi tetap bisa diubah manual
    // (misal ada diskon atau biaya tambahan) lewat field Biaya di bawahnya.
    setForm({ ...form, jenis_perawatan, biaya: hargaTindakan[jenis_perawatan] || 0 })
  }

  const handlePasienChange = e => {
    const id = e.target.value
    const pasien = pasienList.find(p => String(p.id) === String(id))
    setForm({ ...form, pasien_id: id, nama_pasien: pasien?.nama_lengkap || '' })
  }

  const handleOpenAdd  = () => { setEditId(null); setForm(emptyForm); setShowModal(true) }
  const handleOpenEdit = p => {
    setEditId(p.id)
    setForm({ pasien_id: p.pasien_id || '', nama_pasien: p.nama_pasien, jenis_perawatan: p.jenis_perawatan, tanggal: p.tanggal, biaya: p.biaya, metode_bayar: p.metode_bayar, status: p.status, catatan: p.catatan || '' })
    setShowModal(true)
  }

  const handleSubmit = async e => {
    e?.preventDefault()
    if (!form.pasien_id || !form.tanggal) return
    setLoading(true); setError('')
    try {
      const payload = { ...form, biaya: Number(form.biaya) || 0 }
      editId ? await pembayaranAPI.update(editId, payload) : await pembayaranAPI.create(payload)
      setSuccess(editId ? 'Pembayaran berhasil diperbarui!' : 'Pembayaran berhasil ditambahkan!')
      setShowModal(false); setForm(emptyForm); setEditId(null)
      loadData(); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError('Gagal menyimpan: ' + err.message) }
    finally { setLoading(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Yakin ingin menghapus data pembayaran ini?')) return
    setLoading(true)
    try { await pembayaranAPI.delete(id); setSuccess('Pembayaran dihapus!'); loadData(); setTimeout(() => setSuccess(''), 3000) }
    catch (err) { setError('Gagal menghapus: ' + err.message) }
    finally { setLoading(false) }
  }

  const filtered = data.filter(p =>
    (activeTab === 'All' || p.status === activeTab) &&
    p.nama_pasien?.toLowerCase().includes(search.toLowerCase())
  )

  const totalLunas    = data.filter(p => p.status === 'Lunas').reduce((a, b) => a + Number(b.biaya), 0)
  const totalBelum    = data.filter(p => p.status === 'Belum Lunas').reduce((a, b) => a + Number(b.biaya), 0)
  const totalSemua    = data.reduce((a, b) => a + Number(b.biaya), 0)

  return (
    <div>
      <PageHeader title="Pembayaran" breadcrumb={['Beranda', 'Pembayaran']}>
        <Button type="primary" icon={<MdReceiptLong/>} onClick={handleOpenAdd}>Buat Kwitansi</Button>
      </PageHeader>

      {error   && <div className="mb-4"><Alert type="danger"  message={error}   onClose={() => setError('')}/></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')}/></div>}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[['Total Pendapatan', formatRupiah(totalSemua), 'text-biru'], ['Sudah Lunas', formatRupiah(totalLunas), 'text-hijau'], ['Belum Lunas', formatRupiah(totalBelum), 'text-merah']].map(([label, val, cls]) => (
          <div key={label} className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] p-5">
            <p className="text-xs text-teks-samping font-semibold mb-1">{label}</p>
            <p className={`text-xl font-bold ${cls}`}>{val}</p>
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
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-teks-samping text-sm">Belum ada data pembayaran.</div>}
        {!loading && filtered.length > 0 && (
          <Table headers={['Pasien', 'Perawatan', 'Sumber', 'Tanggal', 'Biaya', 'Metode', 'Status', 'Aksi']}>
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-latar transition-colors">
                <td className="px-3 py-3.5 font-semibold text-teks">{p.nama_pasien}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{p.jenis_perawatan}</td>
                <td className="px-3 py-3.5"><Badge type={p.jadwal_id ? 'primary' : 'secondary'}>{p.jadwal_id ? 'Booking Jadwal' : 'Manual'}</Badge></td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{p.tanggal ? new Date(p.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                <td className="px-3 py-3.5 text-sm font-semibold text-teks">{formatRupiah(p.biaya)}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{p.metode_bayar}</td>
                <td className="px-3 py-3.5"><Badge type={statusType[p.status]}>{p.status}</Badge></td>
                <td className="px-3 py-3.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => handleOpenEdit(p)} className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
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
        title={editId ? 'Edit Pembayaran' : 'Tambah Pembayaran'}
        footer={<div className="flex gap-3"><Button type="outline" fullWidth onClick={() => { setShowModal(false); setEditId(null) }}>Batal</Button><Button type="primary" fullWidth onClick={handleSubmit} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</Button></div>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField label="Nama Pasien" name="pasien_id" value={form.pasien_id} onChange={handlePasienChange} required
            options={pasienList.map(p => ({ value: p.id, label: p.nama_lengkap }))} placeholder="Pilih pasien..."/>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Jenis Perawatan" name="jenis_perawatan" value={form.jenis_perawatan} onChange={handleTindakanChange} options={tindakanList} placeholder=""/>
            <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} required/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Biaya (Rp)" name="biaya" type="number" value={form.biaya} onChange={handleChange} placeholder="250000"
              hint="Terisi otomatis sesuai harga acuan, bisa diubah manual"/>
            <SelectField label="Metode Bayar" name="metode_bayar" value={form.metode_bayar} onChange={handleChange} options={metodeBayar} placeholder=""/>
          </div>
          <SelectField label="Status" name="status" value={form.status} onChange={handleChange} options={['Lunas','Belum Lunas']} placeholder=""/>
          <InputField label="Catatan" name="catatan" value={form.catatan} onChange={handleChange} placeholder="Catatan tambahan (opsional)"/>
        </form>
      </Modal>
    </div>
  )
}
