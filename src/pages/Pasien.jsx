import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MdPersonAdd, MdClose } from 'react-icons/md'

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

const emptyForm = { nama: '', email: '', telp: '', loyalitas: 'Bronze' }

export default function Pasien() {
  const [data, setData]       = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]       = useState(emptyForm)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nama || !form.email || !form.telp) return
    const newId = `P${String(data.length + 1).padStart(3, '0')}`
    setData([...data, { id: newId, ...form }])
    setForm(emptyForm)
    setShowModal(false)
  }

  return (
    <div>
      <PageHeader title="Data Pasien" breadcrumb={['Beranda', 'Data Pasien']}>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-biru text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition"
        >
          <MdPersonAdd /> Tambah Pasien
        </button>
      </PageHeader>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-biru-muda text-biru">
            <tr>{['ID','Nama','Email','Telepon','Loyalitas'].map(h => (
              <th key={h} className="text-left p-4 font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {data.map(p => (
              <tr key={p.id} className="border-b border-garis hover:bg-latar">
                <td className="p-4 text-teks-samping">{p.id}</td>
                <td className="p-4 font-medium text-teks">{p.nama}</td>
                <td className="p-4 text-teks-samping">{p.email}</td>
                <td className="p-4 text-teks-samping">{p.telp}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${loyalBadge[p.loyalitas]}`}>
                    {p.loyalitas}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-teks">Tambah Pasien Baru</h2>
              <button onClick={() => setShowModal(false)} className="text-teks-samping hover:text-merah">
                <MdClose className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Nama Lengkap</label>
                <input name="nama" value={form.nama} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm"
                  placeholder="Nama pasien" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Email</label>
                <input name="email" value={form.email} onChange={handleChange} required type="email"
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm"
                  placeholder="email@contoh.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teks mb-1">No. Telepon</label>
                <input name="telp" value={form.telp} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm"
                  placeholder="08xx-xxxx-xxxx" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Tier Loyalitas</label>
                <select name="loyalitas" value={form.loyalitas} onChange={handleChange}
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm">
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
                </select>
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
