import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import Table from '../components/Table'
import { MdPersonAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md'
import pasienData from '../data/pasien'

const tierType = { Bronze:'bronze', Silver:'silver', Gold:'gold' }
const tiers = ['All','Bronze','Silver','Gold']
const emptyForm = { nama:'', email:'', telp:'', loyalitas:'Bronze' }

export default function Pasien() {
  const [data, setData]           = useState(pasienData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]       = useState('')
  const [checked, setChecked]     = useState([])

  // useRef: menyimpan referensi ke elemen input search tanpa memicu re-render
  const searchRef = useRef(null)

  // useEffect: auto-focus ke input search saat halaman pertama kali dibuka
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = e => {
    e.preventDefault()
    if (!form.nama || !form.email) return
    setData([...data, { id:`P${String(data.length+1).padStart(3,'0')}`, ...form }])
    setForm(emptyForm); setShowModal(false)
  }
  const toggleCheck = id => setChecked(c => c.includes(id) ? c.filter(x=>x!==id) : [...c, id])
  const toggleAll  = () => setChecked(c => c.length === filtered.length ? [] : filtered.map(p=>p.id))

  const filtered = data.filter(p =>
    (activeTab === 'All' || p.loyalitas === activeTab) &&
    (p.nama.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <PageHeader title="Data Pasien" breadcrumb={['Beranda','Data Pasien']}>
        <Button type="primary" icon={<MdPersonAdd/>} onClick={() => setShowModal(true)}>
          Add New Patient
        </Button>
      </PageHeader>

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Tabs + search */}
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
            <input
              ref={searchRef}
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-garis rounded-full text-sm outline-none focus:border-biru bg-latar w-48 placeholder:text-teks-samping"
            />
          </div>
        </div>

        {checked.length > 0 && (
          <div className="px-5 py-2.5 bg-biru-muda flex items-center gap-3">
            <span className="text-xs font-semibold text-biru">{checked.length} item dipilih</span>
            <button className="text-xs text-merah font-semibold hover:underline flex items-center gap-1">
              <MdDelete/> Hapus
            </button>
          </div>
        )}

        <Table headers={['','Avatar','Nama','Email','Telepon','Loyalitas','Aksi']}>
          {filtered.map(p => (
            <tr key={p.id} className={`hover:bg-latar transition-colors ${checked.includes(p.id)?'bg-biru-muda/40':''}`}>
              <td className="px-5 py-3.5">
                <input type="checkbox" className="accent-biru" checked={checked.includes(p.id)} onChange={()=>toggleCheck(p.id)}/>
              </td>
              <td className="px-3 py-3.5">
                <Avatar name={p.nama} size="sm"/>
              </td>
              <td className="px-3 py-3.5 font-semibold text-teks">
                <Link to={`/pasien/${p.id}`} className="hover:text-biru hover:underline transition-colors">
                  {p.nama}
                </Link>
              </td>
              <td className="px-3 py-3.5 text-sm text-teks-samping">{p.email}</td>
              <td className="px-3 py-3.5 text-sm text-teks-samping">{p.telp}</td>
              <td className="px-3 py-3.5">
                <Badge type={tierType[p.loyalitas]}>{p.loyalitas}</Badge>
              </td>
              <td className="px-3 py-3.5">
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                  <button className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        <div className="flex items-center justify-between px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Showing {filtered.length} of {data.length} entries</p>
          <div className="flex items-center gap-1">
            {['<','1','2','3','>'].map((p,i) => (
              <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${i===1?'bg-biru text-white':'text-teks-samping hover:bg-latar'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Patient"
        footer={
          <div className="flex gap-3">
            <Button type="outline" fullWidth onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="primary" fullWidth onClick={handleSubmit}>Simpan</Button>
          </div>
        }>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Nama Lengkap" name="nama" value={form.nama} onChange={handleChange} required placeholder="Nama pasien"/>
          <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="email@contoh.com"/>
          <InputField label="No. Telepon" name="telp" value={form.telp} onChange={handleChange} placeholder="08xx-xxxx-xxxx"/>
          <SelectField label="Tier Loyalitas" name="loyalitas" value={form.loyalitas} onChange={handleChange}
            options={['Bronze','Silver','Gold']} placeholder=""/>
        </form>
      </Modal>
    </div>
  )
}
