import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MdStars, MdAddCircle, MdClose } from 'react-icons/md'

const initialData = [
  { id:'P001', nama:'Budi Santoso',   kunjungan:4,  poin:400,  tier:'Bronze', lastVisit:'2025-06-03' },
  { id:'P002', nama:'Ani Rahayu',     kunjungan:12, poin:1200, tier:'Silver', lastVisit:'2025-06-02' },
  { id:'P003', nama:'Citra Dewi',     kunjungan:25, poin:2800, tier:'Gold',   lastVisit:'2025-06-02' },
  { id:'P004', nama:'Deni Kurniawan', kunjungan:3,  poin:300,  tier:'Bronze', lastVisit:'2025-06-04' },
  { id:'P005', nama:'Eka Putri',      kunjungan:15, poin:1650, tier:'Silver', lastVisit:'2025-06-02' },
  { id:'P006', nama:'Fajar Hidayat',  kunjungan:7,  poin:700,  tier:'Bronze', lastVisit:'2025-05-25' },
  { id:'P007', nama:'Gita Lestari',   kunjungan:30, poin:3500, tier:'Gold',   lastVisit:'2025-06-01' },
  { id:'P008', nama:'Hendra Wijaya',  kunjungan:10, poin:1050, tier:'Silver', lastVisit:'2025-06-03' },
]

const tierStyle = {
  Bronze: { badge: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-400' },
  Silver: { badge: 'bg-gray-100 text-gray-600',     bar: 'bg-gray-400'   },
  Gold:   { badge: 'bg-amber-100 text-amber-600',   bar: 'bg-amber-400'  },
}

const tierInfo = [
  { tier: 'Bronze', desc: '0 – 999 poin'       },
  { tier: 'Silver', desc: '1.000 – 1.999 poin' },
  { tier: 'Gold',   desc: '2.000+ poin'        },
]

const getTier = (poin) => {
  if (poin >= 2000) return 'Gold'
  if (poin >= 1000) return 'Silver'
  return 'Bronze'
}

const emptyForm = { nama: '', kunjungan: '', poin: '', lastVisit: '' }

export default function Loyalitas() {
  const [data, setData]           = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nama || !form.kunjungan || !form.poin || !form.lastVisit) return
    const poin      = parseInt(form.poin)
    const kunjungan = parseInt(form.kunjungan)
    const newId     = `P${String(data.length + 1).padStart(3, '0')}`
    setData([...data, { id: newId, nama: form.nama, kunjungan, poin, tier: getTier(poin), lastVisit: form.lastVisit }])
    setForm(emptyForm)
    setShowModal(false)
  }

  return (
    <div>
      <PageHeader title="Program Loyalitas" breadcrumb={['Beranda', 'Program Loyalitas']}>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-biru text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition"
        >
          <MdAddCircle /> Tambah Anggota
        </button>
      </PageHeader>

      {/* Tier info cards */}
      <div className="grid grid-cols-3 gap-4 mb-4 px-2">
        {tierInfo.map(t => (
          <div key={t.tier} className={`${tierStyle[t.tier].badge} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-1">
              <MdStars className="text-xl" />
              <span className="font-bold text-lg">{t.tier}</span>
            </div>
            <p className="text-sm">{t.desc}</p>
            <p className="text-xs mt-1 opacity-70">
              {data.filter(p => p.tier === t.tier).length} pasien
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mx-2">
        <table className="w-full text-sm">
          <thead className="bg-biru-muda text-biru">
            <tr>{['ID','Nama Pasien','Kunjungan','Poin','Progress','Tier','Terakhir Kunjung'].map(h => (
              <th key={h} className="text-left p-4 font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {data.map(p => {
              const maxPoin = p.tier === 'Bronze' ? 1000 : p.tier === 'Silver' ? 2000 : 3500
              const pct     = Math.min((p.poin / maxPoin) * 100, 100)
              return (
                <tr key={p.id} className="border-b border-garis hover:bg-latar">
                  <td className="p-4 text-teks-samping">{p.id}</td>
                  <td className="p-4 font-medium text-teks">{p.nama}</td>
                  <td className="p-4 text-teks-samping">{p.kunjungan}x</td>
                  <td className="p-4 font-semibold text-teks">{p.poin.toLocaleString()}</td>
                  <td className="p-4 w-32">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`${tierStyle[p.tier].bar} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-teks-samping">{Math.round(pct)}%</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierStyle[p.tier].badge}`}>
                      {p.tier}
                    </span>
                  </td>
                  <td className="p-4 text-teks-samping">{p.lastVisit}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-teks">Tambah Anggota Loyalitas</h2>
              <button onClick={() => setShowModal(false)} className="text-teks-samping hover:text-merah">
                <MdClose className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Nama Pasien</label>
                <input name="nama" value={form.nama} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm"
                  placeholder="Nama lengkap pasien" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-teks mb-1">Jumlah Kunjungan</label>
                  <input name="kunjungan" value={form.kunjungan} onChange={handleChange} required type="number" min="1"
                    className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm"
                    placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teks mb-1">Total Poin</label>
                  <input name="poin" value={form.poin} onChange={handleChange} required type="number" min="0"
                    className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm"
                    placeholder="0" />
                </div>
              </div>

              {/* Preview tier otomatis */}
              {form.poin && (
                <div className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${tierStyle[getTier(parseInt(form.poin))].badge}`}>
                  <MdStars />
                  Tier: {getTier(parseInt(form.poin))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-teks mb-1">Tanggal Kunjungan Terakhir</label>
                <input name="lastVisit" value={form.lastVisit} onChange={handleChange} required type="date"
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl border border-garis text-teks-samping text-sm hover:bg-latar transition">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 py-2 rounded-xl bg-biru text-white text-sm font-medium hover:bg-cyan-700 transition">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
