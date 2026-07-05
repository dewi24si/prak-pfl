import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import Table from '../../components/Table'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner'
import { pembayaranAPI } from '../../services/supabaseAPI'
import { useAuth } from '../../context/useAuth'

const statusType = { 'Lunas': 'success', 'Belum Lunas': 'warning' }
const formatRupiah = n => n ? `Rp ${Number(n).toLocaleString('id-ID')}` : 'Rp 0'

export default function PasienPembayaran() {
  const { user } = useAuth()
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); setError(''); setData(await pembayaranAPI.fetchByPasien(user.pasienId)) }
      catch { setError('Gagal memuat data pembayaran') }
      finally { setLoading(false) }
    }
    load()
  }, [user.pasienId])

  const totalLunas = data.filter(p => p.status === 'Lunas').reduce((a, b) => a + Number(b.biaya), 0)
  const totalBelum = data.filter(p => p.status === 'Belum Lunas').reduce((a, b) => a + Number(b.biaya), 0)

  return (
    <div>
      <PageHeader title="Pembayaran" breadcrumb={['Beranda', 'Pembayaran']}/>

      {error && <div className="mb-4"><Alert type="danger" message={error} onClose={() => setError('')}/></div>}

      <div className="grid grid-cols-2 gap-4 mb-6">
        {[['Sudah Lunas', formatRupiah(totalLunas), 'text-hijau'], ['Belum Lunas', formatRupiah(totalBelum), 'text-merah']].map(([label, val, cls]) => (
          <div key={label} className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] p-5">
            <p className="text-xs text-teks-samping font-semibold mb-1">{label}</p>
            <p className={`text-xl font-bold ${cls}`}>{val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        {loading && <div className="flex items-center justify-center gap-3 py-10"><Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat data...</span></div>}
        {!loading && data.length === 0 && <div className="text-center py-12 text-teks-samping text-sm">Belum ada data pembayaran.</div>}
        {!loading && data.length > 0 && (
          <Table headers={['Perawatan', 'Tanggal', 'Biaya', 'Metode', 'Status']}>
            {data.map(p => (
              <tr key={p.id} className="hover:bg-latar transition-colors">
                <td className="px-3 py-3.5 font-semibold text-teks">{p.jenis_perawatan}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{p.tanggal ? new Date(p.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                <td className="px-3 py-3.5 text-sm font-semibold text-teks">{formatRupiah(p.biaya)}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{p.metode_bayar}</td>
                <td className="px-3 py-3.5"><Badge type={statusType[p.status]}>{p.status}</Badge></td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  )
}
