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
import { MdAddCircle, MdEdit, MdDelete, MdSearch, MdDownload } from 'react-icons/md'
import { riwayatAPI, pasienAPI, dokterAPI, tindakanAPI } from '../services/supabaseAPI'
import { POIN_PER_KUNJUNGAN } from '../data/tindakan'
import Pagination from '../components/Pagination'
import { exportToCSV } from '../utils/csv'

const tindakanType = { 'Scaling':'primary','Tambal Gigi':'success','Konsultasi':'purple','Cabut Gigi':'danger','Pemasangan Behel':'warning','Veneer':'pink','Bleaching':'primary','Implan':'success' }
const emptyForm    = { pasien_id: '', nama_pasien: '', dokter: '', tindakan: '', tanggal: '', biaya: '', catatan: '' }
const PAGE_SIZE    = 10

const formatRupiah = n => n ? `Rp ${Number(n).toLocaleString('id-ID')}` : '-'

export default function Riwayat() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]       = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [pasienList, setPasienList] = useState([])
  const [dokterList, setDokterList]     = useState([])
  const [tindakanList, setTindakanList] = useState([])

  const hargaTindakan = Object.fromEntries(tindakanList.map(t => [t.nama, t.harga]))

  useEffect(() => { loadData(); loadPasien(); loadMasterData() }, [])
  useEffect(() => { setPage(1) }, [search])

  const loadPasien = async () => {
    try { setPasienList(await pasienAPI.fetchAll()) }
    catch { /* dropdown pasien gagal dimuat, biarkan kosong */ }
  }

  const loadMasterData = async () => {
    try {
      const [d, t] = await Promise.all([dokterAPI.fetchAll(), tindakanAPI.fetchAll()])
      setDokterList(d.filter(x => x.aktif))
      setTindakanList(t.filter(x => x.aktif))
    } catch { /* dropdown gagal dimuat, biarkan kosong */ }
  }

  const loadData = async () => {
    try { setLoading(true); setError(''); const r = await riwayatAPI.fetchAll(); setData(r) }
    catch { setError('Gagal memuat riwayat perawatan') }
    finally { setLoading(false) }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleTindakanChange = e => {
    const tindakan = e.target.value
    // Isi otomatis biaya sesuai harga acuan, tapi tetap bisa diubah manual.
    setForm({ ...form, tindakan, biaya: hargaTindakan[tindakan] || 0 })
  }

  const handlePasienChange = e => {
    const id = e.target.value
    const pasien = pasienList.find(p => String(p.id) === String(id))
    setForm({ ...form, pasien_id: id, nama_pasien: pasien?.nama_lengkap || '' })
  }

  const handleOpenAdd  = () => {
    setEditId(null)
    setForm({ ...emptyForm, dokter: dokterList[0]?.nama || '', tindakan: tindakanList[0]?.nama || '' })
    setShowModal(true)
  }
  const handleOpenEdit = r => {
    setEditId(r.id)
    setForm({ pasien_id: r.pasien_id || '', nama_pasien: r.nama_pasien, dokter: r.dokter, tindakan: r.tindakan, tanggal: r.tanggal, biaya: r.biaya || '', catatan: r.catatan || '' })
    setShowModal(true)
  }

  const handleSubmit = async e => {
    e?.preventDefault()
    if (!form.pasien_id || !form.tanggal) return
    setLoading(true); setError('')
    try {
      const payload = { ...form, biaya: Number(form.biaya) || 0 }
      if (editId) {
        await riwayatAPI.update(editId, payload)
      } else {
        await riwayatAPI.create(payload)
        // Tindakan baru yang dicatat manual (misal input riwayat lama)
        // juga otomatis menambah poin loyalitas pasien.
        const pasien = pasienList.find(p => String(p.id) === String(form.pasien_id))
        await pasienAPI.update(form.pasien_id, {
          poin_loyalitas: (pasien?.poin_loyalitas || 0) + POIN_PER_KUNJUNGAN,
        })
      }
      setSuccess(editId ? 'Riwayat berhasil diperbarui!' : 'Riwayat berhasil ditambahkan!')
      setShowModal(false); setForm(emptyForm); setEditId(null)
      loadData(); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError('Gagal menyimpan: ' + err.message) }
    finally { setLoading(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Yakin ingin menghapus riwayat ini?')) return
    setLoading(true)
    try { await riwayatAPI.delete(id); setSuccess('Riwayat dihapus!'); loadData(); setTimeout(() => setSuccess(''), 3000) }
    catch (err) { setError('Gagal menghapus: ' + err.message) }
    finally { setLoading(false) }
  }

  const filtered = data.filter(r => r.nama_pasien?.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleExportCSV = () => {
    const headers = ['Pasien', 'Dokter', 'Tindakan', 'Tanggal', 'Biaya', 'Catatan']
    const rows = filtered.map(r => [r.nama_pasien, r.dokter, r.tindakan, r.tanggal, r.biaya, r.catatan])
    exportToCSV(`riwayat-${new Date().toISOString().slice(0,10)}.csv`, headers, rows)
  }

  return (
    <div>
      <PageHeader title="Riwayat Perawatan" breadcrumb={['Beranda','Riwayat Perawatan']}>
        <div className="flex gap-2">
          <Button type="outline" icon={<MdDownload/>} onClick={handleExportCSV}>Export CSV</Button>
          <Button type="primary" icon={<MdAddCircle/>} onClick={handleOpenAdd}>Tambah Riwayat</Button>
        </div>
      </PageHeader>

      {error   && <div className="mb-4"><Alert type="danger"  message={error}   onClose={() => setError('')}/></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')}/></div>}

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-garis">
          <p className="text-sm font-semibold text-teks">Total: {data.length} riwayat</p>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-teks-samping text-lg"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pasien..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping"/>
          </div>
        </div>

        {loading && <div className="flex items-center justify-center gap-3 py-10"><Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat data...</span></div>}
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-teks-samping text-sm">Belum ada riwayat perawatan.</div>}
        {!loading && filtered.length > 0 && (
          <Table headers={['Pasien','Dokter','Tindakan','Tanggal','Biaya','Catatan','Aksi']}>
            {paged.map(r => (
              <tr key={r.id} className="hover:bg-latar transition-colors">
                <td className="px-3 py-3.5 font-semibold text-teks">{r.nama_pasien}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{r.dokter}</td>
                <td className="px-3 py-3.5"><Badge type={tindakanType[r.tindakan] || 'primary'}>{r.tindakan}</Badge></td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{r.tanggal ? new Date(r.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                <td className="px-3 py-3.5 text-sm font-semibold text-teks">{formatRupiah(r.biaya)}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping max-w-xs truncate">{r.catatan || '-'}</td>
                <td className="px-3 py-3.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => handleOpenEdit(r)} className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                    <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
        <div className="px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Showing {paged.length} of {filtered.length} entries</p>
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage}/>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditId(null) }}
        title={editId ? 'Edit Riwayat' : 'Tambah Riwayat'}
        footer={<div className="flex gap-3"><Button type="outline" fullWidth onClick={() => { setShowModal(false); setEditId(null) }}>Batal</Button><Button type="primary" fullWidth onClick={handleSubmit} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</Button></div>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField label="Nama Pasien" name="pasien_id" value={form.pasien_id} onChange={handlePasienChange} required
            options={pasienList.map(p => ({ value: p.id, label: p.nama_lengkap }))} placeholder="Pilih pasien..."/>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Dokter" name="dokter" value={form.dokter} onChange={handleChange}
              options={dokterList.map(d => d.nama)} placeholder=""/>
            <SelectField label="Tindakan" name="tindakan" value={form.tindakan} onChange={handleTindakanChange}
              options={tindakanList.map(t => t.nama)} placeholder=""/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} required/>
            <InputField label="Biaya (Rp)" name="biaya" type="number" value={form.biaya} onChange={handleChange} placeholder="250000"
              hint={!editId ? `Otomatis +${POIN_PER_KUNJUNGAN} poin loyalitas` : undefined}/>
          </div>
          <InputField label="Catatan Dokter" name="catatan" value={form.catatan} onChange={handleChange} placeholder="Catatan hasil perawatan"/>
        </form>
      </Modal>
    </div>
  )
}
