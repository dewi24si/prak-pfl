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
import { MdAddCircle, MdEdit, MdDelete } from 'react-icons/md'
import { dokterAPI, tindakanAPI } from '../services/supabaseAPI'

const emptyDokter   = { nama: '', spesialisasi: '', aktif: true }
const emptyTindakan = { nama: '', harga: '', aktif: true }

export default function MasterData() {
  const [tab, setTab]             = useState('dokter')
  const [dokterList, setDokterList]     = useState([])
  const [tindakanList, setTindakanList] = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]       = useState(null)
  const [formDokter, setFormDokter]     = useState(emptyDokter)
  const [formTindakan, setFormTindakan] = useState(emptyTindakan)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true); setError('')
      const [d, t] = await Promise.all([dokterAPI.fetchAll(), tindakanAPI.fetchAll()])
      setDokterList(d); setTindakanList(t)
    } catch { setError('Gagal memuat master data') }
    finally { setLoading(false) }
  }

  const handleOpenAdd = () => {
    setEditId(null)
    setFormDokter(emptyDokter); setFormTindakan(emptyTindakan)
    setShowModal(true)
  }

  const handleOpenEdit = item => {
    setEditId(item.id)
    if (tab === 'dokter') setFormDokter({ nama: item.nama, spesialisasi: item.spesialisasi || '', aktif: item.aktif })
    else setFormTindakan({ nama: item.nama, harga: item.harga, aktif: item.aktif })
    setShowModal(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      if (tab === 'dokter') {
        if (!formDokter.nama) { setLoading(false); return }
        editId ? await dokterAPI.update(editId, formDokter) : await dokterAPI.create(formDokter)
      } else {
        if (!formTindakan.nama) { setLoading(false); return }
        const payload = { ...formTindakan, harga: Number(formTindakan.harga) || 0 }
        editId ? await tindakanAPI.update(editId, payload) : await tindakanAPI.create(payload)
      }
      setSuccess(editId ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!')
      setShowModal(false); setEditId(null)
      loadData(); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError('Gagal menyimpan: ' + err.message) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id, nama) => {
    if (!confirm(`Yakin ingin menghapus "${nama}"? Data yang sudah dipakai di jadwal/riwayat lama tidak akan ikut berubah.`)) return
    setLoading(true)
    try {
      tab === 'dokter' ? await dokterAPI.delete(id) : await tindakanAPI.delete(id)
      setSuccess('Data berhasil dihapus!')
      loadData(); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError('Gagal menghapus: ' + err.message) }
    finally { setLoading(false) }
  }

  const data = tab === 'dokter' ? dokterList : tindakanList

  return (
    <div>
      <PageHeader title="Master Data" breadcrumb={['Beranda', 'Master Data']}>
        <Button type="primary" icon={<MdAddCircle/>} onClick={handleOpenAdd}>
          {tab === 'dokter' ? 'Tambah Dokter' : 'Tambah Tindakan'}
        </Button>
      </PageHeader>

      {error   && <div className="mb-4"><Alert type="danger"  message={error}   onClose={() => setError('')}/></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')}/></div>}

      <div className="flex items-center gap-1 mb-4">
        {[['dokter', 'Dokter'], ['tindakan', 'Tindakan & Harga']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${tab===key?'bg-biru text-white':'bg-white text-teks-samping hover:text-teks hover:bg-latar border border-garis'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        {loading && <div className="flex items-center justify-center gap-3 py-10"><Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat data...</span></div>}
        {!loading && data.length === 0 && <div className="text-center py-12 text-teks-samping text-sm">Belum ada data.</div>}

        {!loading && data.length > 0 && tab === 'dokter' && (
          <Table headers={['Nama', 'Spesialisasi', 'Status', 'Aksi']}>
            {dokterList.map(d => (
              <tr key={d.id} className="hover:bg-latar transition-colors">
                <td className="px-5 py-3.5 font-semibold text-teks">{d.nama}</td>
                <td className="px-5 py-3.5 text-sm text-teks-samping">{d.spesialisasi || '-'}</td>
                <td className="px-5 py-3.5"><Badge type={d.aktif ? 'success' : 'secondary'}>{d.aktif ? 'Aktif' : 'Nonaktif'}</Badge></td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => handleOpenEdit(d)} className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                    <button onClick={() => handleDelete(d.id, d.nama)} className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}

        {!loading && data.length > 0 && tab === 'tindakan' && (
          <Table headers={['Nama Tindakan', 'Harga', 'Status', 'Aksi']}>
            {tindakanList.map(t => (
              <tr key={t.id} className="hover:bg-latar transition-colors">
                <td className="px-5 py-3.5 font-semibold text-teks">{t.nama}</td>
                <td className="px-5 py-3.5 text-sm text-teks-samping">Rp {Number(t.harga).toLocaleString('id-ID')}</td>
                <td className="px-5 py-3.5"><Badge type={t.aktif ? 'success' : 'secondary'}>{t.aktif ? 'Aktif' : 'Nonaktif'}</Badge></td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => handleOpenEdit(t)} className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                    <button onClick={() => handleDelete(t.id, t.nama)} className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditId(null) }}
        title={`${editId ? 'Edit' : 'Tambah'} ${tab === 'dokter' ? 'Dokter' : 'Tindakan'}`}
        footer={<div className="flex gap-3"><Button type="outline" fullWidth onClick={() => { setShowModal(false); setEditId(null) }}>Batal</Button><Button type="primary" fullWidth onClick={handleSubmit} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</Button></div>}>
        {tab === 'dokter' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Nama Dokter" name="nama" value={formDokter.nama}
              onChange={e => setFormDokter({ ...formDokter, nama: e.target.value })}
              placeholder="drg. Nama Lengkap" required/>
            <InputField label="Spesialisasi" name="spesialisasi" value={formDokter.spesialisasi}
              onChange={e => setFormDokter({ ...formDokter, spesialisasi: e.target.value })}
              placeholder="misal: Gigi Umum, Ortodonti"/>
            <SelectField label="Status" name="aktif" value={formDokter.aktif ? 'Aktif' : 'Nonaktif'}
              onChange={e => setFormDokter({ ...formDokter, aktif: e.target.value === 'Aktif' })}
              options={['Aktif', 'Nonaktif']} placeholder=""
              hint="Dokter nonaktif tidak muncul lagi di pilihan booking baru"/>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Nama Tindakan" name="nama" value={formTindakan.nama}
              onChange={e => setFormTindakan({ ...formTindakan, nama: e.target.value })}
              placeholder="misal: Scaling" required/>
            <InputField label="Harga (Rp)" name="harga" type="number" value={formTindakan.harga}
              onChange={e => setFormTindakan({ ...formTindakan, harga: e.target.value })}
              placeholder="150000" required/>
            <SelectField label="Status" name="aktif" value={formTindakan.aktif ? 'Aktif' : 'Nonaktif'}
              onChange={e => setFormTindakan({ ...formTindakan, aktif: e.target.value === 'Aktif' })}
              options={['Aktif', 'Nonaktif']} placeholder=""
              hint="Tindakan nonaktif tidak muncul lagi di pilihan booking baru"/>
          </form>
        )}
      </Modal>
    </div>
  )
}
