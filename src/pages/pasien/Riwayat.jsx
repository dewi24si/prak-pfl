import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import Table from '../../components/Table'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner'
import { riwayatAPI } from '../../services/supabaseAPI'
import { useAuth } from '../../context/useAuth'

const tindakanType = { 'Scaling':'primary','Tambal Gigi':'success','Konsultasi':'purple','Cabut Gigi':'danger','Pemasangan Behel':'warning','Veneer':'pink','Bleaching':'primary','Implan':'success' }
const formatRupiah = n => n ? `Rp ${Number(n).toLocaleString('id-ID')}` : '-'

export default function PasienRiwayat() {
  const { user } = useAuth()
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); setError(''); setData(await riwayatAPI.fetchByPasien(user.pasienId)) }
      catch { setError('Gagal memuat riwayat perawatan') }
      finally { setLoading(false) }
    }
    load()
  }, [user.pasienId])

  return (
    <div>
      <PageHeader title="Riwayat Perawatan" breadcrumb={['Beranda', 'Riwayat Perawatan']}/>

      {error && <div className="mb-4"><Alert type="danger" message={error} onClose={() => setError('')}/></div>}

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-5 py-4 border-b border-garis">
          <p className="text-sm font-semibold text-teks">Total: {data.length} riwayat</p>
        </div>

        {loading && <div className="flex items-center justify-center gap-3 py-10"><Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat data...</span></div>}
        {!loading && data.length === 0 && <div className="text-center py-12 text-teks-samping text-sm">Belum ada riwayat perawatan.</div>}
        {!loading && data.length > 0 && (
          <Table headers={['Dokter', 'Tindakan', 'Tanggal', 'Biaya', 'Catatan']}>
            {data.map(r => (
              <tr key={r.id} className="hover:bg-latar transition-colors">
                <td className="px-3 py-3.5 text-sm text-teks-samping">{r.dokter}</td>
                <td className="px-3 py-3.5"><Badge type={tindakanType[r.tindakan] || 'primary'}>{r.tindakan}</Badge></td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{r.tanggal ? new Date(r.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                <td className="px-3 py-3.5 text-sm font-semibold text-teks">{formatRupiah(r.biaya)}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping max-w-xs truncate">{r.catatan || '-'}</td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  )
}
