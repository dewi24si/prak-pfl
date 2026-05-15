import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MdPersonAdd, MdClose, MdEdit, MdDelete, MdSearch } from 'react-icons/md'

const initialData = [
  { id:'P001', nama:'Budi Santoso',   email:'budi@mail.com',   telp:'0812-3456-7890', loyalitas:'Bronze' },
  { id:'P002', nama:'Ani Rahayu',     email:'ani@mail.com',    telp:'0813-2345-6789', loyalitas:'Silver' },
  { id:'P003', nama:'Citra Dewi',     email:'citra@mail.com',  telp:'0814-3456-7891', loyalitas:'Gold'   },
  { id:'P004', nama:'Deni Kurniawan', email:'deni@mail.com',   telp:'0815-4567-8902', loyalitas:'Bronze' },
  { id:'P005', nama:'Eka Putri',      email:'eka@mail.com',    telp:'0816-5678-9013', loyalitas:'Silver' },
]

const loyalBadge = {
  Bronze: 'bg-yellow-100 text-yellow-700',
  Silver: 'bg-gray-100 text-gray-600',
  Gold:   'bg-amber-100 text-amber-600',
}

const tiers = ['All', 'Bronze', 'Silver', 'Gold']
const emptyForm = { nama:'', email:'', telp:'', loyalitas:'Bronze' }
const inputCls = 'w-full px-4 py-3 border border-garis rounded-xl text-sm text-teks outline-none focus:border-biru focus:ring-2 focus:ring-biru-muda bg-latar transition placeholder:text-teks-samping'
const labelCls = 'block text-sm font-semibold text-teks mb-2'

export default function Pasien() {
  const [data, setData]           = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]       = useState('')
  const [checked, setChecked]     = useState([])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nama || !form.email) return
    setData([...data, { id:`P${String(data.length+1).padStart(3,'0')}`, ...form }])
    setForm(emptyForm); setShowModal(false)
  }
  const toggleCheck = (id) => setChecked(c => c.includes(id) ? c.filter(x=>x!==id) : [...c, id])
  const toggleAll  = () => setChecked(c => c.length === filtered.length ? [] : filtered.map(p=>p.id))

  const filtered = data.filter(p =>
    (activeTab === 'All' || p.loyalitas === activeTab) &&
    (p.nama.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <PageHeader title="Data Pasien" breadcrumb={['Beranda','Data Pasien']}>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-biru hover:bg-biru-hover text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm">
          <MdPersonAdd className="text-base" /> Add New User
        </button>
      </PageHeader>

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Tabs + search */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-garis flex-wrap gap-3">
          <div className="flex items-center gap-1">
            {tiers.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${activeTab===t ? 'bg-biru text-white' : 'text-teks-samping hover:text-teks hover:bg-latar'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative mb-3">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-teks-samping text-lg" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping" />
          </div>
        </div>

        {checked.length > 0 && (
          <div className="px-5 py-2.5 bg-biru-muda flex items-center gap-3">
            <span className="text-xs font-semibold text-biru">{checked.length} item dipilih</span>
            <button className="text-xs text-merah font-semibold hover:underline flex items-center gap-1"><MdDelete/> Hapus</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-latar border-b border-garis">
                <th className="px-5 py-3 w-10">
                  <input type="checkbox" className="accent-biru"
                    checked={checked.length===filtered.length && filtered.length>0}
                    onChange={toggleAll} />
                </th>
                {['Avatar','Nama','Email','Telepon','Loyalitas','Edit'].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-[11px] font-bold text-teks-samping uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {filtered.map(p => (
                <tr key={p.id} className={`hover:bg-latar transition-colors ${checked.includes(p.id)?'bg-biru-muda/40':''}`}>
                  <td className="px-5 py-3.5">
                    <input type="checkbox" className="accent-biru" checked={checked.includes(p.id)} onChange={()=>toggleCheck(p.id)} />
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="w-8 h-8 rounded-full bg-biru-muda flex items-center justify-center text-biru text-xs font-bold">{p.nama[0]}</div>
                  </td>
                  <td className="px-3 py-3.5 font-semibold text-teks">{p.nama}</td>
                  <td className="px-3 py-3.5 text-teks-samping">{p.email}</td>
                  <td className="px-3 py-3.5 text-teks-samping">{p.telp}</td>
                  <td className="px-3 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${loyalBadge[p.loyalitas]}`}>{p.loyalitas}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                      <button className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Showing {filtered.length} of {data.length} entries</p>
          <div className="flex items-center gap-1">
            {['<','1','2','3','>'].map((p,i) => (
              <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${i===1?'bg-biru text-white':'text-teks-samping hover:bg-latar'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-garis">
              <h2 className="font-bold text-teks">Add New Patient</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-latar text-teks-samping hover:text-merah transition-colors">
                <MdClose className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[['nama','Nama Lengkap','Nama pasien'],['email','Email','email@contoh.com'],['telp','No. Telepon','08xx-xxxx-xxxx']].map(([name,lbl,ph]) => (
                <div key={name}>
                  <label className={labelCls}>{lbl}</label>
                  <input name={name} value={form[name]} onChange={handleChange} required className={inputCls} placeholder={ph} />
                </div>
              ))}
              <div>
                <label className={labelCls}>Tier Loyalitas</label>
                <select name="loyalitas" value={form.loyalitas} onChange={handleChange} className={inputCls}>
                  <option>Bronze</option><option>Silver</option><option>Gold</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-garis text-teks-samping text-sm font-semibold hover:bg-latar transition">Batal</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-full bg-biru hover:bg-biru-hover text-white text-sm font-bold transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
