import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MdAddCircle, MdClose } from 'react-icons/md'

const initialData = [
  { id:'R001', pasien:'Budi Santoso',   dokter:'drg. Sari',  tindakan:'Scaling',          tanggal:'2025-03-10', catatan:'Karang gigi bersih, disarankan scaling 6 bulan lagi.' },
  { id:'R002', pasien:'Ani Rahayu',     dokter:'drg. Reza',  tindakan:'Tambal Gigi',       tanggal:'2025-04-02', catatan:'Gigi geraham kiri bawah, tambalan komposit.' },
  { id:'R003', pasien:'Citra Dewi',     dokter:'drg. Sari',  tindakan:'Konsultasi',        tanggal:'2025-04-15', catatan:'Keluhan sensitif, disarankan pasta gigi sensitif.' },
  { id:'R004', pasien:'Deni Kurniawan', dokter:'drg. Reza',  tindakan:'Cabut Gigi',        tanggal:'2025-05-01', catatan:'Gigi bungsu kanan atas, pencabutan normal.' },
  { id:'R005', pasien:'Eka Putri',      dokter:'drg. Sari',  tindakan:'Pemasangan Behel',  tanggal:'2025-05-20', catatan:'Behel metal, kontrol berikutnya 1 bulan.' },
  { id:'R006', pasien:'Fajar Hidayat',  dokter:'drg. Reza',  tindakan:'Scaling',           tanggal:'2025-05-25', catatan:'Scaling selesai, gusi sedikit berdarah — rutin flossing.' },
  { id:'R007', pasien:'Gita Lestari',   dokter:'drg. Sari',  tindakan:'Veneer',            tanggal:'2025-06-01', catatan:'2 veneer gigi depan, hasil memuaskan.' },
  { id:'R008', pasien:'Hendra Wijaya',  dokter:'drg. Reza',  tindakan:'Tambal Gigi',       tanggal:'2025-06-03', catatan:'Tambalan sementara, kembali 1 minggu untuk permanen.' },
]

const emptyForm = { pasien:'', dokter:'drg. Sari', tindakan:'Scaling', tanggal:'', catatan:'' }

export default function Riwayat() {
  const [data, setData]       = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]       = useState(emptyForm)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.pasien || !form.tanggal) return
    const newId = `R${String(data.length + 1).padStart(3, '0')}`
    setData([...data, { id: newId, ...form }])
    setForm(emptyForm)
    setShowModal(false)
  }

  return (
    <div>
      <PageHeader title="Riwayat Perawatan" breadcrumb={['Beranda', 'Riwayat Perawatan']}>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-biru text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition">
          <MdAddCircle /> Tambah Riwayat
        </button>
      </PageHeader>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mx-2">
        <table className="w-full text-sm">
          <thead className="bg-biru-muda text-biru">
            <tr>{['ID','Pasien','Dokter','Tindakan','Tanggal','Catatan Dokter'].map(h => (
              <th key={h} className="text-left p-4 font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id} className="border-b border-garis hover:bg-latar">
                <td className="p-4 text-teks-samping">{r.id}</td>
                <td className="p-4 font-medium text-teks whitespace-nowrap">{r.pasien}</td>
                <td className="p-4 text-teks-samping whitespace-nowrap">{r.dokter}</td>
                <td className="p-4 text-teks-samping whitespace-nowrap">{r.tindakan}</td>
                <td className="p-4 text-teks-samping whitespace-nowrap">{r.tanggal}</td>
                <td className="p-4 text-teks-samping max-w-xs">{r.catatan}</td>
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
              <h2 className="text-lg font-semibold text-teks">Tambah Riwayat Perawatan</h2>
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
                  <label className="block text-sm font-medium text-teks mb-1">Tindakan</label>
                  <select name="tindakan" value={form.tindakan} onChange={handleChange}
                    className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm">
                    {['Scaling','Tambal Gigi','Cabut Gigi','Konsultasi','Pemasangan Behel','Veneer'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teks mb-1">Tanggal</label>
                  <input name="tanggal" value={form.tanggal} onChange={handleChange} required type="date"
                    className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-teks mb-1">Catatan Dokter</label>
                <textarea name="catatan" value={form.catatan} onChange={handleChange} rows={3}
                  className="w-full px-4 py-2 border border-garis rounded-xl bg-latar outline-none focus:border-biru text-sm resize-none"
                  placeholder="Hasil pemeriksaan dan catatan tindakan..." />
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
