import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import InputField from '../components/InputField'
import Table from '../components/Table'
import { MdStars, MdAddCircle, MdEdit, MdDelete } from 'react-icons/md'

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

const tierType  = { Bronze:'bronze', Silver:'silver', Gold:'gold' }
const getTier   = p => p>=2000?'Gold':p>=1000?'Silver':'Bronze'
const tabs      = ['All','Bronze','Silver','Gold']
const emptyForm = { nama:'', kunjungan:'', poin:'', lastVisit:'' }

export default function Loyalitas() {
  const [data, setData]           = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('All')

  const handleChange = e => setForm({...form,[e.target.name]:e.target.value})
  const handleSubmit = () => {
    if (!form.nama||!form.poin) return
    const poin=parseInt(form.poin), kunjungan=parseInt(form.kunjungan)
    setData([...data,{id:`P${String(data.length+1).padStart(3,'0')}`,nama:form.nama,kunjungan,poin,tier:getTier(poin),lastVisit:form.lastVisit}])
    setForm(emptyForm); setShowModal(false)
  }

  const filtered = data.filter(p => activeTab==='All'||p.tier===activeTab)

  const summaryTiers = [
    { tier:'Bronze', desc:'0–999 poin',       cls:'bg-yellow-100 text-yellow-700' },
    { tier:'Silver', desc:'1.000–1.999 poin',  cls:'bg-gray-100 text-gray-600'    },
    { tier:'Gold',   desc:'2.000+ poin',       cls:'bg-amber-100 text-amber-600'  },
  ]

  return (
    <div>
      <PageHeader title="Program Loyalitas" breadcrumb={['Beranda','Program Loyalitas']}>
        <Button type="primary" icon={<MdAddCircle/>} onClick={() => setShowModal(true)}>
          Tambah Anggota
        </Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {summaryTiers.map(t => (
          <div key={t.tier} className={`${t.cls} rounded-2xl p-4 shadow-sm`}>
            <div className="flex items-center gap-2 mb-1">
              <MdStars className="text-xl"/><span className="font-bold text-base">{t.tier}</span>
            </div>
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

        <Table headers={['Pasien','Kunjungan','Poin','Progress ke Tier Berikutnya','Tier','Terakhir Kunjung','Aksi']}>
          {filtered.map(p => {
            const maxPoin = p.tier==='Bronze'?1000:p.tier==='Silver'?2000:3500
            const pct = Math.min((p.poin/maxPoin)*100,100)
            // ── warna progress DaisyUI sesuai tier
            const progressCls = p.tier==='Gold' ? 'progress-warning' : p.tier==='Silver' ? 'progress-info' : 'progress-warning'
            return (
              <tr key={p.id} className="hover:bg-latar transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={p.nama} size="sm"/>
                    <span className="font-semibold text-teks text-sm">{p.nama}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-teks-samping">{p.kunjungan}x</td>
                <td className="px-5 py-3.5 text-sm font-bold text-teks">{p.poin.toLocaleString()}</td>

                {/* ── DaisyUI Progress ─────────────────────────────── */}
                <td className="px-5 py-3.5 w-40">
                  <progress
                    className={`progress w-full h-2 mb-1 ${progressCls}`}
                    value={pct}
                    max="100"
                  />
                  <span className="text-[11px] text-teks-samping font-semibold">
                    {Math.round(pct)}% menuju {p.tier==='Gold'?'Maks':p.tier==='Silver'?'Gold':'Silver'}
                  </span>
                </td>

                <td className="px-5 py-3.5">
                  <Badge type={tierType[p.tier]}>{p.tier}</Badge>
                </td>
                <td className="px-5 py-3.5 text-sm text-teks-samping">{p.lastVisit}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors"><MdEdit/></button>
                    <button className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors"><MdDelete/></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </Table>

        <div className="flex items-center justify-between px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Showing {filtered.length} of {data.length} entries</p>
          <div className="flex items-center gap-1">
            {['<','1','2','>'].map((p,i) => (
              <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${i===1?'bg-biru text-white':'text-teks-samping hover:bg-latar'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Anggota Loyalitas"
        footer={
          <div className="flex gap-3">
            <Button type="outline" fullWidth onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="primary" fullWidth onClick={handleSubmit}>Simpan</Button>
          </div>
        }>
        <div className="space-y-4">
          <InputField label="Nama Pasien" name="nama" value={form.nama} onChange={handleChange} required placeholder="Nama lengkap"/>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Kunjungan" name="kunjungan" type="number" value={form.kunjungan} onChange={handleChange} required placeholder="0"/>
            <InputField label="Total Poin" name="poin" type="number" value={form.poin} onChange={handleChange} required placeholder="0"/>
          </div>
          {form.poin && (
            <div className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
              getTier(parseInt(form.poin))==='Gold'?'bg-amber-100 text-amber-600':getTier(parseInt(form.poin))==='Silver'?'bg-gray-100 text-gray-600':'bg-yellow-100 text-yellow-700'
            }`}>
              <MdStars/> Tier: {getTier(parseInt(form.poin))}
            </div>
          )}
          <InputField label="Kunjungan Terakhir" name="lastVisit" type="date" value={form.lastVisit} onChange={handleChange} required/>
        </div>
      </Modal>
    </div>
  )
}
