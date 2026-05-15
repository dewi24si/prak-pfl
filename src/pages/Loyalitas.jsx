import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MdStars, MdAddCircle, MdClose, MdEdit, MdDelete } from 'react-icons/md'

const initialData = [
  {id:'P001',nama:'Budi Santoso',  kunjungan:4,  poin:400,  tier:'Bronze',lastVisit:'2025-06-03'},
  {id:'P002',nama:'Ani Rahayu',    kunjungan:12, poin:1200, tier:'Silver',lastVisit:'2025-06-02'},
  {id:'P003',nama:'Citra Dewi',    kunjungan:25, poin:2800, tier:'Gold',  lastVisit:'2025-06-02'},
  {id:'P004',nama:'Deni Kurniawan',kunjungan:3,  poin:300,  tier:'Bronze',lastVisit:'2025-06-04'},
  {id:'P005',nama:'Eka Putri',     kunjungan:15, poin:1650, tier:'Silver',lastVisit:'2025-06-02'},
  {id:'P006',nama:'Fajar Hidayat', kunjungan:7,  poin:700,  tier:'Bronze',lastVisit:'2025-05-25'},
  {id:'P007',nama:'Gita Lestari',  kunjungan:30, poin:3500, tier:'Gold',  lastVisit:'2025-06-01'},
  {id:'P008',nama:'Hendra Wijaya', kunjungan:10, poin:1050, tier:'Silver',lastVisit:'2025-06-03'},
]

const tierStyle = {
  Bronze:{badge:'bg-yellow-100 text-yellow-700',bar:'bg-yellow-400'},
  Silver:{badge:'bg-gray-100 text-gray-600',    bar:'bg-gray-400'},
  Gold:  {badge:'bg-amber-100 text-amber-600',  bar:'bg-amber-400'},
}
const getTier = p => p>=2000?'Gold':p>=1000?'Silver':'Bronze'
const tabs = ['All','Bronze','Silver','Gold']
const emptyForm = {nama:'',kunjungan:'',poin:'',lastVisit:''}
const inputCls = 'w-full px-4 py-3 border border-garis rounded-xl text-sm text-teks outline-none focus:border-biru focus:ring-2 focus:ring-biru-muda bg-latar transition'
const labelCls = 'block text-sm font-semibold text-teks mb-2'

export default function Loyalitas() {
  const [data, setData]           = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('All')

  const handleChange = e => setForm({...form,[e.target.name]:e.target.value})
  const handleSubmit = e => {
    e.preventDefault()
    if (!form.nama||!form.poin) return
    const poin=parseInt(form.poin),kunjungan=parseInt(form.kunjungan)
    setData([...data,{id:`P${String(data.length+1).padStart(3,'0')}`,nama:form.nama,kunjungan,poin,tier:getTier(poin),lastVisit:form.lastVisit}])
    setForm(emptyForm); setShowModal(false)
  }

  const filtered = data.filter(p => activeTab==='All'||p.tier===activeTab)

  return (
    <div>
      <PageHeader title="Program Loyalitas" breadcrumb={['Beranda','Program Loyalitas']}>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-biru hover:bg-biru-hover text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm">
          <MdAddCircle className="text-base" /> Tambah Anggota
        </button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          {tier:'Bronze',desc:'0–999 poin'},
          {tier:'Silver',desc:'1.000–1.999 poin'},
          {tier:'Gold',  desc:'2.000+ poin'},
        ].map(t => (
          <div key={t.tier} className={`${tierStyle[t.tier].badge} rounded-2xl p-4 shadow-sm`}>
            <div className="flex items-center gap-2 mb-1"><MdStars className="text-xl"/><span className="font-bold text-base">{t.tier}</span></div>
            <p className="text-sm">{t.desc}</p>
            <p className="text-xs mt-1.5 opacity-70 font-semibold">{data.filter(p=>p.tier===t.tier).length} pasien</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex items-center px-5 pt-4 pb-0 border-b border-garis gap-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-xs font-bold rounded-full mb-3 transition-colors ${activeTab===t?'bg-biru text-white':'text-teks-samping hover:text-teks hover:bg-latar'}`}>{t}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-latar border-b border-garis">
                {['Pasien','Kunjungan','Poin','Progress','Tier','Terakhir Kunjung','Aksi'].map(h=>(
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-teks-samping uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {filtered.map(p => {
                const maxPoin = p.tier==='Bronze'?1000:p.tier==='Silver'?2000:3500
                const pct = Math.min((p.poin/maxPoin)*100,100)
                return (
                  <tr key={p.id} className="hover:bg-latar transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-biru-muda flex items-center justify-center text-biru text-xs font-bold flex-shrink-0">{p.nama[0]}</div>
                        <span className="font-semibold text-teks">{p.nama}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-teks-samping">{p.kunjungan}x</td>
                    <td className="px-5 py-3.5 font-bold text-teks">{p.poin.toLocaleString()}</td>
                    <td className="px-5 py-3.5 w-32">
                      <div className="w-full bg-latar rounded-full h-1.5 mb-1">
                        <div className={`${tierStyle[p.tier].bar} h-1.5 rounded-full`} style={{width:`${pct}%`}}/>
                      </div>
                      <span className="text-[11px] text-teks-samping font-semibold">{Math.round(pct)}%</span>
                    </td>
                    <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${tierStyle[p.tier].badge}`}>{p.tier}</span></td>
                    <td className="px-5 py-3.5 text-teks-samping">{p.lastVisit}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                        <button className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Showing {filtered.length} of {data.length} entries</p>
          <div className="flex items-center gap-1">
            {['<','1','2','>'].map((p,i)=>(
              <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${i===1?'bg-biru text-white':'text-teks-samping hover:bg-latar'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-garis">
              <h2 className="font-bold text-teks">Tambah Anggota Loyalitas</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-latar text-teks-samping hover:text-merah transition-colors"><MdClose className="text-xl"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className={labelCls}>Nama Pasien</label><input name="nama" value={form.nama} onChange={handleChange} required className={inputCls} placeholder="Nama lengkap"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Kunjungan</label><input name="kunjungan" value={form.kunjungan} onChange={handleChange} required type="number" min="1" className={inputCls} placeholder="0"/></div>
                <div><label className={labelCls}>Total Poin</label><input name="poin" value={form.poin} onChange={handleChange} required type="number" min="0" className={inputCls} placeholder="0"/></div>
              </div>
              {form.poin && (
                <div className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${tierStyle[getTier(parseInt(form.poin))].badge}`}>
                  <MdStars/> Tier: {getTier(parseInt(form.poin))}
                </div>
              )}
              <div><label className={labelCls}>Kunjungan Terakhir</label><input name="lastVisit" value={form.lastVisit} onChange={handleChange} required type="date" className={inputCls}/></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-full border border-garis text-teks-samping text-sm font-semibold hover:bg-latar transition">Batal</button>
                <button type="submit" className="flex-1 py-2.5 rounded-full bg-biru hover:bg-biru-hover text-white text-sm font-bold transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
