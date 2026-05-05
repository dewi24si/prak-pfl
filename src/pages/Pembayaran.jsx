import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MdReceiptLong, MdClose } from 'react-icons/md'

const tindakanHarga = {
  'Scaling':           'Rp 250.000',
  'Tambal Gigi':       'Rp 350.000',
  'Cabut Gigi':        'Rp 300.000',
  'Konsultasi':        'Rp 100.000',
  'Pemasangan Behel':  'Rp 5.000.000',
  'Veneer':            'Rp 2.500.000',
}

const initialData = [
  { id:'TRX001', pasien:'Ani Rahayu',     tindakan:'Tambal Gigi',      jumlah:'Rp 350.000',   tanggal:'2025-06-02', status:'Lunas'       },
  { id:'TRX002', pasien:'Eka Putri',      tindakan:'Pemasangan Behel', jumlah:'Rp 5.000.000', tanggal:'2025-06-02', status:'Lunas'       },
  { id:'TRX003', pasien:'Hendra Wijaya',  tindakan:'Tambal Gigi',      jumlah:'Rp 350.000',   tanggal:'2025-06-03', status:'Lunas'       },
  { id:'TRX004', pasien:'Budi Santoso',   tindakan:'Scaling',          jumlah:'Rp 250.000',   tanggal:'2025-06-03', status:'Belum Lunas' },
  { id:'TRX005', pasien:'Citra Dewi',     tindakan:'Konsultasi',       jumlah:'Rp 100.000',   tanggal:'2025-06-04', status:'Lunas'       },
  { id:'TRX006', pasien:'Deni Kurniawan', tindakan:'Cabut Gigi',       jumlah:'Rp 300.000',   tanggal:'2025-06-04', status:'Belum Lunas' },
  { id:'TRX007', pasien:'Gita Lestari',   tindakan:'Veneer',           jumlah:'Rp 2.500.000', tanggal:'2025-06-05', status:'Lunas'       },
  { id:'TRX008', pasien:'Irwan Saputra',  tindakan:'Scaling',          jumlah:'Rp 250.000',   tanggal:'2025-06-05', status:'Lunas'       },
]

const statusBadge = {
  'Lunas':        'bg-green-100 text-hijau',
  'Belum Lunas':  'bg-yellow-100 text-kuning',
}

const emptyForm = { pasien:'', tindakan:'Scaling', tanggal:'', status:'Lunas' }

export default function Pembayaran() {
  const [data, setData]       = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]       = useState(emptyForm)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.pasien || !form.tanggal) return
    const newId = `TRX${String(data.length + 1).padStart(3, '0')}`
    setData([...data, { id: newId, jumlah: tindakanHarga[form.tindakan], ...form }])
    setForm(emptyForm)
    setShowModal(false)
  }

  const lunas      = data.filter(d => d.status === 'Lunas').length
  const belumLunas = data.filter(d => d.status === 'Belum Lunas').length

  return (
    <div>
      <PageHeader title="Pembayaran" breadcrumb={['Beranda', 'Pembayaran']}>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-biru text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition">
          <MdReceiptLong /> Buat Kwitansi
        </button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4 mb-4 px-2">
        {[
          { label:'Total Transaksi', value: data.length,  color:'bg-biru-muda text-biru'   },
          { label:'Lunas',           value: lunas,         color:'bg-green-100 text-hijau'  },
          { label:'Belum Lunas',     value: belumLunas,    color:'bg-yellow-100 text-kuning'},
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
            <tr>{['ID Transaksi','Pasien','Tindakan','Jumlah','Tanggal','Status'].map(h => (
              <th key={h} className="text-left p-4 font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {data.map(p => (
              <tr key={p.id} className="border-b border-garis hover:bg-latar">
                <td className="p-4 text-teks-samping font-mono text-xs">{p.id}</td>
                <td className="p-4 font-medium text-teks">{p.pasien}</td>
                <td className="p-4 text-teks-samping">{p.tindakan}</td>
                <td className="p-4 font-semibold text-teks">{p.jumlah}</td>
                <td className="p-4 text-teks-samping">{p.tanggal}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge[p.status]}`}>
                    {p.status}
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
              <h2 className="text-lg font-semibold text-teks">Buat Kwitansi Baru</h2>
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
                <label className="block text-sm font-medium text-teks mb-1">Tindakan</label>
                <select name="tindakan" value={form.tindakan} onChange={handleChange}
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm">
                  {Object.keys(tindakanHarga).map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="px-4 py-2 bg-biru-muda rounded-xl text-sm text-biru font-medium">
                Tarif: {tindakanHarga[form.tindakan]}
              </div>
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Tanggal</label>
                <input name="tanggal" value={form.tanggal} onChange={handleChange} required type="date"
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Status Pembayaran</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm">
                  <option>Lunas</option>
                  <option>Belum Lunas</option>
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
