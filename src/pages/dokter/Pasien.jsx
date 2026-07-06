import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import Table from '../../components/Table'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner'
import Pagination from '../../components/Pagination'
import { MdSearch, MdVisibility, MdWarning } from 'react-icons/md'
import { pasienAPI } from '../../services/supabaseAPI'
import { useAuth } from '../../context/useAuth'

const loyalitasMap = { Bronze: 'bronze', Silver: 'silver', Gold: 'gold' }
const getTier = p => p >= 100 ? 'Gold' : p >= 50 ? 'Silver' : 'Bronze'
const PAGE_SIZE = 10

export default function DokterPasien() {
  const { user } = useAuth()
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)

  useEffect(() => {
    pasienAPI.fetchAll()
      .then(p => setData(p.filter(x => x.dokter_penanggung_jawab === user.namaDokter)))
      .catch(() => setError('Gagal memuat data pasien'))
      .finally(() => setLoading(false))
  }, [user.namaDokter])

  const handleSearch = e => { setSearch(e.target.value); setPage(1) }

  const filtered = data.filter(p =>
    p.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <PageHeader title="Pasien Saya" breadcrumb={['Beranda', 'Pasien Saya']}/>

      {error && <div className="mb-4"><Alert type="danger" message={error} onClose={() => setError('')}/></div>}

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center justify-end px-5 pt-4 pb-0 border-b border-garis">
          <div className="relative mb-3">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-teks-samping text-lg"/>
            <input value={search} onChange={handleSearch} placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping"/>
          </div>
        </div>

        {loading && <div className="flex items-center justify-center gap-3 py-10"><Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat data...</span></div>}
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-teks-samping text-sm">Belum ada pasien yang ditangani.</div>}

        {!loading && filtered.length > 0 && (
          <Table headers={['Avatar', 'Nama Lengkap', 'Email', 'No. HP', 'Tier', 'Status', 'Aksi']}>
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
                  <td className="px-3 py-3.5"><Badge type={loyalitasMap[tier]}>{tier}</Badge></td>
                  <td className="px-3 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.status_pasien === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.status_pasien}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <Link to={`/dokter/pasien/${p.id}`} title="Lihat Detail"
                      className="p-1.5 rounded-lg hover:bg-hijau-muda text-teks-samping hover:text-hijau transition-colors inline-flex">
                      <MdVisibility/>
                    </Link>
                  </td>
                </tr>
              )
            })}
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
