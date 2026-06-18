import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Table from '../components/Table'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'
import { MdStars } from 'react-icons/md'
import { pasienAPI } from '../services/supabaseAPI'

const tierType = { Bronze: 'bronze', Silver: 'silver', Gold: 'gold' }
const tabs     = ['All', 'Bronze', 'Silver', 'Gold']

const getTier = poin => {
  if (poin >= 100) return 'Gold'
  if (poin >= 50)  return 'Silver'
  return 'Bronze'
}

const summaryTiers = [
  { tier: 'Bronze', desc: '0–49 poin',   cls: 'bg-yellow-100 text-yellow-700' },
  { tier: 'Silver', desc: '50–99 poin',  cls: 'bg-gray-100 text-gray-600'    },
  { tier: 'Gold',   desc: '100+ poin',   cls: 'bg-amber-100 text-amber-600'  },
]

export default function Loyalitas() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true); setError('')
      const result = await pasienAPI.fetchAll()
      // urutkan berdasarkan poin tertinggi
      result.sort((a, b) => (b.poin_loyalitas || 0) - (a.poin_loyalitas || 0))
      setData(result)
    } catch { setError('Gagal memuat data loyalitas') }
    finally { setLoading(false) }
  }

  const filtered = data.filter(p =>
    activeTab === 'All' || getTier(p.poin_loyalitas || 0) === activeTab
  )

  const countTier = t => data.filter(p => getTier(p.poin_loyalitas || 0) === t).length

  return (
    <div>
      <PageHeader title="Program Loyalitas" breadcrumb={['Beranda', 'Program Loyalitas']}/>

      {error && <div className="mb-4"><Alert type="danger" message={error} onClose={() => setError('')}/></div>}

      {/* Tier cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {summaryTiers.map(({ tier, desc, cls }) => (
          <div key={tier} className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cls}`}>
              <MdStars className="text-2xl"/>
            </div>
            <div>
              <p className="font-bold text-teks">{tier}</p>
              <p className="text-xs text-teks-samping">{desc}</p>
              <p className="text-lg font-bold text-biru mt-0.5">{countTier(tier)} pasien</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center gap-1 px-5 pt-4 pb-0 border-b border-garis">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-colors mb-1 ${activeTab===t?'bg-biru text-white':'text-teks-samping hover:text-teks hover:bg-latar'}`}>
              {t}
            </button>
          ))}
        </div>

        {loading && <div className="flex items-center justify-center gap-3 py-10"><Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat data...</span></div>}
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-teks-samping text-sm">Belum ada data.</div>}
        {!loading && filtered.length > 0 && (
          <Table headers={['#', 'Pasien', 'Email', 'Poin Loyalitas', 'Tier', 'Status']}>
            {filtered.map((p, i) => {
              const tier = getTier(p.poin_loyalitas || 0)
              return (
                <tr key={p.id} className="hover:bg-latar transition-colors">
                  <td className="px-3 py-3.5 text-sm font-bold text-teks-samping">{i + 1}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <Avatar name={p.nama_lengkap} size="sm"/>
                      <span className="font-semibold text-teks">{p.nama_lengkap}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-sm text-teks-samping">{p.email || '-'}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-biru rounded-full" style={{ width: `${Math.min((p.poin_loyalitas||0)/100*100, 100)}%` }}/>
                      </div>
                      <span className="text-sm font-bold text-teks">{p.poin_loyalitas || 0}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5"><Badge type={tierType[tier]}>{tier}</Badge></td>
                  <td className="px-3 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.status_pasien === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.status_pasien || 'Aktif'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </Table>
        )}
        <div className="px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Total {filtered.length} pasien</p>
        </div>
      </div>
    </div>
  )
}
