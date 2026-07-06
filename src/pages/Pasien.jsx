import { useState, useRef, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import TextArea from '../components/TextArea'
import Table from '../components/Table'
import Alert from '../components/Alert'
import Spinner from '../components/Spinner'
import { MdPersonAdd, MdEdit, MdDelete, MdSearch, MdVisibility, MdWarning, MdDownload } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { pasienAPI, dokterAPI } from '../services/supabaseAPI'
import Pagination from '../components/Pagination'
import { exportToCSV } from '../utils/csv'

const statusOptions = ['Aktif', 'Tidak Aktif']
const loyalitasMap  = { Bronze: 'bronze', Silver: 'silver', Gold: 'gold' }
const tiers         = ['All', 'Bronze', 'Silver', 'Gold']
const PAGE_SIZE      = 10

const emptyForm = {
  nama_lengkap: '', jenis_kelamin: 'Laki-laki', tanggal_lahir: '',
  no_hp: '', email: '', alamat: '', status_pasien: 'Aktif', alergi: '',
  keluhan_utama: '', riwayat_perawatan: '', jadwal_kontrol: '',
  dokter_penanggung_jawab: '', poin_loyalitas: 0,
  catatan_dokter: '',
}

export default function Pasien() {
  const [data, setData]           = useState([])
  const [dokterList, setDokterList] = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]       = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const searchRef = useRef(null)

  useEffect(() => { searchRef.current?.focus() }, [])
  useEffect(() => { loadData(); loadDokter() }, [])
  useEffect(() => { setPage(1) }, [activeTab, search])

  const loadData = async () => {
    try {
      setLoading(true); setError('')
      const result = await pasienAPI.fetchAll()
      setData(result)
    } catch (err) {
      setError('Gagal memuat data pasien')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadDokter = async () => {
    try { setDokterList((await dokterAPI.fetchAll()).filter(d => d.aktif)) }
    catch { /* dropdown gagal dimuat, biarkan kosong */ }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleOpenAdd = () => {
    setEditId(null)
    setForm({ ...emptyForm, dokter_penanggung_jawab: dokterList[0]?.nama || '' })
    setShowModal(true)
  }

  const handleOpenEdit = (pasien) => {
    setEditId(pasien.id)
    setForm({
      nama_lengkap: pasien.nama_lengkap || '',
      jenis_kelamin: pasien.jenis_kelamin || 'Laki-laki',
      tanggal_lahir: pasien.tanggal_lahir || '',
      no_hp: pasien.no_hp || '',
      email: pasien.email || '',
      alamat: pasien.alamat || '',
      status_pasien: pasien.status_pasien || 'Aktif',
      alergi: pasien.alergi || '',
      keluhan_utama: pasien.keluhan_utama || '',
      riwayat_perawatan: pasien.riwayat_perawatan || '',
      jadwal_kontrol: pasien.jadwal_kontrol || '',
      dokter_penanggung_jawab: pasien.dokter_penanggung_jawab || dokterList[0]?.nama || '',
      poin_loyalitas: pasien.poin_loyalitas || 0,
      catatan_dokter: pasien.catatan_dokter || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.nama_lengkap) return
    setLoading(true); setError('')
    try {
      if (editId) {
        await pasienAPI.update(editId, form)
        setSuccess('Data pasien berhasil diperbarui!')
      } else {
        if (form.email) {
          const existing = await pasienAPI.findByEmail(form.email)
          if (existing) {
            setError(`Pasien dengan email ini sudah terdaftar atas nama "${existing.nama_lengkap}". Gunakan tombol Edit di data yang sudah ada, bukan menambah baru.`)
            setLoading(false)
            return
          }
        }
        await pasienAPI.create(form)
        setSuccess('Pasien baru berhasil ditambahkan!')
      }
      setShowModal(false); setForm(emptyForm); setEditId(null)
      loadData(); setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Gagal menyimpan data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, nama) => {
    if (!confirm(`Yakin ingin menghapus pasien "${nama}"?`)) return
    setLoading(true)
    try {
      await pasienAPI.delete(id)
      setSuccess('Pasien berhasil dihapus!')
      loadData(); setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Gagal menghapus data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const getTier = (poin) => {
    if (poin >= 100) return 'Gold'
    if (poin >= 50)  return 'Silver'
    return 'Bronze'
  }

  const filtered = data.filter(p => {
    const tier = getTier(p.poin_loyalitas)
    return (
      (activeTab === 'All' || tier === activeTab) &&
      (p.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
       p.email?.toLowerCase().includes(search.toLowerCase()))
    )
  })
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleExportCSV = () => {
    const headers = ['Nama Lengkap', 'Email', 'No. HP', 'Jenis Kelamin', 'Alamat', 'Dokter Penanggung Jawab', 'Tier', 'Poin Loyalitas', 'Status', 'Alergi']
    const rows = filtered.map(p => [
      p.nama_lengkap, p.email, p.no_hp, p.jenis_kelamin, p.alamat,
      p.dokter_penanggung_jawab, getTier(p.poin_loyalitas), p.poin_loyalitas || 0, p.status_pasien, p.alergi,
    ])
    exportToCSV(`data-pasien-${new Date().toISOString().slice(0,10)}.csv`, headers, rows)
  }

  return (
    <div>
      <PageHeader title="Data Pasien" breadcrumb={['Beranda', 'Data Pasien']}>
        <div className="flex gap-2">
          <Button type="outline" icon={<MdDownload/>} onClick={handleExportCSV}>Export CSV</Button>
          <Button type="primary" icon={<MdPersonAdd/>} onClick={handleOpenAdd}>
            Tambah Pasien Baru
          </Button>
        </div>
      </PageHeader>

      {error   && <div className="mb-4"><Alert type="danger"  message={error}   onClose={() => setError('')}/></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')}/></div>}

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-garis flex-wrap gap-3">
          <div className="flex items-center gap-1">
            {tiers.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${activeTab===t?'bg-biru text-white':'text-teks-samping hover:text-teks hover:bg-latar'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative mb-3">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-teks-samping text-lg"/>
            <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping"/>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 py-10 text-teks-samping">
            <Spinner size="sm" color="biru"/>
            <span className="text-sm">Memuat data...</span>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-teks-samping text-sm">Belum ada data pasien.</div>
        )}

        {!loading && filtered.length > 0 && (
          <Table headers={['Avatar', 'Nama Lengkap', 'Email', 'No. HP', 'Dokter', 'Tier', 'Status', 'Aksi']}>
            {paged.map(p => {
              const tier = getTier(p.poin_loyalitas)
              return (
                <tr key={p.id} className="hover:bg-latar transition-colors">
                  <td className="px-3 py-3.5"><Avatar name={p.nama_lengkap} size="sm"/></td>
                  <td className="px-3 py-3.5 font-semibold text-teks">
                    <div className="flex items-center gap-1.5">
                      {p.nama_lengkap}
                      {p.alergi && <MdWarning className="text-kuning" title={`Alergi: ${p.alergi}`}/>}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-sm text-teks-samping">{p.email || '-'}</td>
                  <td className="px-3 py-3.5 text-sm text-teks-samping">{p.no_hp || '-'}</td>
                  <td className="px-3 py-3.5 text-sm text-teks-samping">{p.dokter_penanggung_jawab || '-'}</td>
                  <td className="px-3 py-3.5"><Badge type={loyalitasMap[tier]}>{tier}</Badge></td>
                  <td className="px-3 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.status_pasien === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.status_pasien}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Link to={`/admin/pasien/${p.id}`}
                        className="p-1.5 rounded-lg hover:bg-hijau-muda text-teks-samping hover:text-hijau transition-colors"
                        title="Lihat Detail">
                        <MdVisibility/>
                      </Link>
                      <button onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"
                        title="Edit">
                        <MdEdit/>
                      </button>
                      <button onClick={() => handleDelete(p.id, p.nama_lengkap)}
                        className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"
                        title="Hapus">
                        <MdDelete/>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </Table>
        )}

        <div className="flex items-center justify-between px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Showing {paged.length} of {filtered.length} entries</p>
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage}/>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditId(null) }}
        title={editId ? 'Edit Data Pasien' : 'Tambah Pasien Baru'}
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button type="outline" fullWidth onClick={() => { setShowModal(false); setEditId(null) }}>Batal</Button>
            <Button type="primary" fullWidth onClick={handleSubmit} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        }>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs font-bold text-teks-samping uppercase tracking-wider">Data Diri</p>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Nama Lengkap" name="nama_lengkap" value={form.nama_lengkap}
              onChange={handleChange} required placeholder="Nama pasien"/>
            <SelectField label="Jenis Kelamin" name="jenis_kelamin" value={form.jenis_kelamin}
              onChange={handleChange} options={['Laki-laki', 'Perempuan']} placeholder=""/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Tanggal Lahir" name="tanggal_lahir" type="date"
              value={form.tanggal_lahir} onChange={handleChange}/>
            <InputField label="No. HP / WhatsApp" name="no_hp" value={form.no_hp}
              onChange={handleChange} placeholder="08xx-xxxx-xxxx"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Email" name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="email@contoh.com"/>
            <SelectField label="Status Pasien" name="status_pasien" value={form.status_pasien}
              onChange={handleChange} options={statusOptions} placeholder=""/>
          </div>
          <InputField label="Alamat" name="alamat" value={form.alamat}
            onChange={handleChange} placeholder="Alamat lengkap pasien"/>
          <TextArea label="Alergi / Catatan Medis Penting" name="alergi" value={form.alergi}
            onChange={handleChange} rows={2}
            placeholder="misal: alergi anestesi lokal, penisilin, dll (kosongkan jika tidak ada)"/>

          <p className="text-xs font-bold text-teks-samping uppercase tracking-wider pt-2 border-t border-garis">Data Klinis</p>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Keluhan Utama" name="keluhan_utama" value={form.keluhan_utama}
              onChange={handleChange} placeholder="Keluhan awal pasien"/>
            <SelectField label="Dokter Penanggung Jawab" name="dokter_penanggung_jawab"
              value={form.dokter_penanggung_jawab} onChange={handleChange}
              options={dokterList.map(d => d.nama)} placeholder=""/>
          </div>

          {/* Field berikut hanya relevan setelah pasien pernah ditangani, jadi baru muncul saat edit */}
          {editId && (
            <>
              <InputField label="Riwayat Perawatan" name="riwayat_perawatan" value={form.riwayat_perawatan}
                onChange={handleChange} placeholder="Riwayat tindakan medis sebelumnya"/>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Rekomendasi Kontrol Berikutnya" name="jadwal_kontrol" type="date"
                  value={form.jadwal_kontrol} onChange={handleChange}
                  hint="Tanggal rekomendasi kontrol dari dokter"/>
                <InputField label="Poin Loyalitas" name="poin_loyalitas" type="number"
                  value={form.poin_loyalitas} onChange={handleChange} placeholder="0"
                  hint="Bronze <50 | Silver 50-99 | Gold ≥100"/>
              </div>
              <InputField label="Catatan Dokter" name="catatan_dokter" value={form.catatan_dokter}
                onChange={handleChange} placeholder="Catatan tambahan dari dokter"/>
            </>
          )}
        </form>
      </Modal>
    </div>
  )
}
