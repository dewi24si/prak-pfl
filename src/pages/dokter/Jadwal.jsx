import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import Table from '../../components/Table'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner'
import Pagination from '../../components/Pagination'
import { MdSearch, MdCheckCircle, MdCancel } from 'react-icons/md'
import { jadwalAPI, pasienAPI, pembayaranAPI, riwayatAPI, tindakanAPI } from '../../services/supabaseAPI'
import { POIN_PER_KUNJUNGAN } from '../../data/tindakan'
import { useAuth } from '../../context/useAuth'

const statusType = { Terjadwal: 'primary', Selesai: 'success', Dibatalkan: 'danger' }
const tabs        = ['All', 'Terjadwal', 'Selesai', 'Dibatalkan']
const PAGE_SIZE    = 10

export default function DokterJadwal() {
  const { user } = useAuth()
  const [data, setData]           = useState([])
  const [pasienList, setPasienList] = useState([])
  const [tindakanList, setTindakanList] = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)

  const hargaTindakan = Object.fromEntries(tindakanList.map(t => [t.nama, t.harga]))

  useEffect(() => { loadData() }, [])
  useEffect(() => { setPage(1) }, [activeTab, search])

  const loadData = async () => {
    try {
      setLoading(true); setError('')
      const [j, p, t] = await Promise.all([jadwalAPI.fetchAll(), pasienAPI.fetchAll(), tindakanAPI.fetchAll()])
      setData(j.filter(x => x.dokter === user.namaDokter))
      setPasienList(p)
      setTindakanList(t)
    } catch { setError('Gagal memuat jadwal') }
    finally { setLoading(false) }
  }

  const handleSelesai = async j => {
    if (!confirm(`Tandai kunjungan "${j.nama_pasien}" sebagai selesai? Riwayat perawatan & poin loyalitas akan tercatat otomatis.`)) return
    setLoading(true); setError('')
    try {
      await jadwalAPI.update(j.id, { ...j, status: 'Selesai' })
      await riwayatAPI.create({
        pasien_id: j.pasien_id, nama_pasien: j.nama_pasien, dokter: j.dokter,
        tindakan: j.jenis_perawatan, tanggal: j.tanggal,
        biaya: hargaTindakan[j.jenis_perawatan] || 0, catatan: j.catatan,
      })
      const pasien = pasienList.find(p => String(p.id) === String(j.pasien_id))
      await pasienAPI.update(j.pasien_id, { poin_loyalitas: (pasien?.poin_loyalitas || 0) + POIN_PER_KUNJUNGAN })
      setSuccess('Kunjungan ditandai selesai, riwayat & poin loyalitas tercatat!')
      loadData(); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError('Gagal menyimpan: ' + err.message) }
    finally { setLoading(false) }
  }

  const handleBatalkan = async j => {
    if (!confirm(`Batalkan jadwal "${j.nama_pasien}"?`)) return
    setLoading(true); setError('')
    try {
      await jadwalAPI.update(j.id, { ...j, status: 'Dibatalkan' })
      const tagihan = await pembayaranAPI.fetchByJadwal(j.id)
      const belumLunas = tagihan.find(t => t.status === 'Belum Lunas')
      if (belumLunas) await pembayaranAPI.delete(belumLunas.id)
      setSuccess('Jadwal dibatalkan.')
      loadData(); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError('Gagal membatalkan: ' + err.message) }
    finally { setLoading(false) }
  }

  const filtered = data.filter(j =>
    (activeTab === 'All' || j.status === activeTab) &&
    j.nama_pasien?.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <PageHeader title="Jadwal Saya" breadcrumb={['Beranda', 'Jadwal Saya']}/>

      {error   && <div className="mb-4"><Alert type="danger"  message={error}   onClose={() => setError('')}/></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')}/></div>}

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
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pasien..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping"/>
          </div>
        </div>

        {loading && <div className="flex items-center justify-center gap-3 py-10"><Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat data...</span></div>}
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-teks-samping text-sm">Belum ada jadwal.</div>}
        {!loading && filtered.length > 0 && (
          <Table headers={['Pasien', 'Tanggal', 'Jam', 'Perawatan', 'Status', 'Aksi']}>
            {paged.map(j => (
              <tr key={j.id} className="hover:bg-latar transition-colors">
                <td className="px-3 py-3.5 font-semibold text-teks">{j.nama_pasien}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{j.tanggal ? new Date(j.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{j.jam}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{j.jenis_perawatan}</td>
                <td className="px-3 py-3.5"><Badge type={statusType[j.status]}>{j.status}</Badge></td>
                <td className="px-3 py-3.5">
                  {j.status === 'Terjadwal' && (
                    <div className="flex gap-1.5">
                      <button onClick={() => handleSelesai(j)} title="Tandai Selesai"
                        className="p-1.5 rounded-lg hover:bg-hijau-muda text-teks-samping hover:text-hijau transition-colors"><MdCheckCircle/></button>
                      <button onClick={() => handleBatalkan(j)} title="Batalkan"
                        className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdCancel/></button>
                    </div>
                  )}
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
    </div>
  )
}
