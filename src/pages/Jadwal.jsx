import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MdAddCircle, MdClose } from 'react-icons/md'

const initialData = [
  { id:'J001', pasien:'Budi Santoso',   dokter:'drg. Sari',  tanggal:'2025-06-02', jam:'09:00', tindakan:'Scaling',          status:'Terjadwal' },
  { id:'J002', pasien:'Ani Rahayu',     dokter:'drg. Reza',  tanggal:'2025-06-02', jam:'10:30', tindakan:'Tambal Gigi',       status:'Selesai'   },
  { id:'J003', pasien:'Citra Dewi',     dokter:'drg. Sari',  tanggal:'2025-06-02', jam:'13:00', tindakan:'Konsultasi',        status:'Terjadwal' },
  { id:'J004', pasien:'Deni Kurniawan', dokter:'drg. Reza',  tanggal:'2025-06-03', jam:'08:30', tindakan:'Cabut Gigi',        status:'Terjadwal' },
  { id:'J005', pasien:'Eka Putri',      dokter:'drg. Sari',  tanggal:'2025-06-03', jam:'11:00', tindakan:'Pemasangan Behel',  status:'Selesai'   },
  { id:'J006', pasien:'Fajar Hidayat',  dokter:'drg. Reza',  tanggal:'2025-06-03', jam:'14:00', tindakan:'Scaling',           status:'Dibatalkan'},
  { id:'J007', pasien:'Gita Lestari',   dokter:'drg. Sari',  tanggal:'2025-06-04', jam:'09:30', tindakan:'Veneer',            status:'Terjadwal' },
  { id:'J008', pasien:'Hendra Wijaya',  dokter:'drg. Reza',  tanggal:'2025-06-04', jam:'10:00', tindakan:'Tambal Gigi',       status:'Selesai'   },
]

const statusBadge = {
  Terjadwal:  'bg-biru-muda text-biru',
  Selesai:    'bg-green-100 text-hijau',
  Dibatalkan: 'bg-red-100 text-merah',
}

const emptyForm = { pasien:'', dokter:'drg. Sari', tanggal:'', jam:'', tindakan:'Scaling', status:'Terjadwal' }

export default function Jadwal() {
  const [data, setData]       = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]       = useState(emptyForm)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.pasien || !form.tanggal || !form.jam) return
    const newId = `J${String(data.length + 1).padStart(3, '0')}`
    setData([...data, { id: newId, ...form }])
    setForm(emptyForm)
    setShowModal(false)
  }

  const terjadwal  = data.filter(d => d.status === 'Terjadwal').length
  const dibatalkan = data.filter(d => d.status === 'Dibatalkan').length

  return (
    <div>
      <PageHeader title="Jadwal & Reminder" breadcrumb={['Beranda', 'Jadwal & Reminder']}>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-biru text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition">
          <MdAddCircle /> Tambah Jadwal
        </button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-4 px-2">
        {[
          { label:'Terjadwal',  value: terjadwal,  color:'bg-biru-muda text-biru' },
          { label:'Selesai',    value: data.filter(d=>d.status==='Selesai').length, color:'bg-green-100 text-hijau' },
          { label:'Dibatalkan', value: dibatalkan,  color:'bg-red-100 text-merah'  },
        ].map(c => (
          <div key={c.label} className={`${c.color} rounded-xl p-4 text-center`}>
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-sm mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mx-2">
        <table className="w-full text-sm">
          <thead className="bg-biru-muda text-biru">
            <tr>{['ID','Pasien','Dokter','Tanggal','Jam','Tindakan','Status'].map(h => (
              <th key={h} className="text-left p-4 font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {data.map(j => (
              <tr key={j.id} className="border-b border-garis hover:bg-latar">
                <td className="p-4 text-teks-samping">{j.id}</td>
                <td className="p-4 font-medium text-teks">{j.pasien}</td>
                <td className="p-4 text-teks-samping">{j.dokter}</td>
                <td className="p-4 text-teks-samping">{j.tanggal}</td>
                <td className="p-4 text-teks-samping">{j.jam}</td>
                <td className="p-4 text-teks-samping">{j.tindakan}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge[j.status]}`}>
                    {j.status}
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
              <h2 className="text-lg font-semibold text-teks">Tambah Jadwal Baru</h2>
              <button onClick={() => setShowModal(false)} className="text-teks-samping hover:text-merah">
                <MdClose className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Nama Pasien</label>
                <input name="pasien" value={form.pasien} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm"
                  placeholder="Nama pasien" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Dokter</label>
                <select name="dokter" value={form.dokter} onChange={handleChange}
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm">
                  <option>drg. Sari</option>
                  <option>drg. Reza</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-teks mb-1">Tanggal</label>
                  <input name="tanggal" value={form.tanggal} onChange={handleChange} required type="date"
                    className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teks mb-1">Jam</label>
                  <input name="jam" value={form.jam} onChange={handleChange} required type="time"
                    className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Tindakan</label>
                <select name="tindakan" value={form.tindakan} onChange={handleChange}
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm">
                  {['Scaling','Tambal Gigi','Cabut Gigi','Konsultasi','Pemasangan Behel','Veneer'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm">
                  <option>Terjadwal</option>
                  <option>Selesai</option>
                  <option>Dibatalkan</option>
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
