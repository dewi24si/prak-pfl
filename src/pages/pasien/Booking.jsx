import { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Card from '../../components/Card'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import Table from '../../components/Table'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner'
import { MdEventAvailable } from 'react-icons/md'
import { pasienAPI, jadwalAPI } from '../../services/supabaseAPI'
import { useAuth } from '../../context/useAuth'

const statusType   = { Terjadwal: 'primary', Selesai: 'success', Dibatalkan: 'danger' }
const tindakanList = ['Scaling', 'Tambal Gigi', 'Cabut Gigi', 'Konsultasi', 'Pemasangan Behel', 'Veneer', 'Bleaching', 'Implan']
const dokterList   = ['drg. Sari', 'drg. Budi', 'drg. Rina', 'drg. Hendra']
const emptyForm    = { dokter: 'drg. Sari', tanggal: '', jam: '', jenis_perawatan: 'Scaling', catatan: '' }

export default function PasienBooking() {
  const { user } = useAuth()
  const [jadwal, setJadwal]       = useState([])
  const [loading, setLoading]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [form, setForm]           = useState(emptyForm)

  const loadData = useCallback(async () => {
    try { setLoading(true); setError(''); setJadwal(await jadwalAPI.fetchByPasien(user.pasienId)) }
    catch { setError('Gagal memuat jadwal') }
    finally { setLoading(false) }
  }, [user.pasienId])

  useEffect(() => { loadData() }, [loadData])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.tanggal || !form.jam) return
    setSubmitting(true); setError('')
    try {
      const pasien = await pasienAPI.fetchById(user.pasienId)
      await jadwalAPI.create({
        pasien_id: user.pasienId,
        nama_pasien: pasien.nama_lengkap,
        dokter: form.dokter,
        tanggal: form.tanggal,
        jam: form.jam,
        jenis_perawatan: form.jenis_perawatan,
        status: 'Terjadwal',
        catatan: form.catatan,
      })
      setSuccess('Jadwal berhasil dibooking! Tunggu konfirmasi dari klinik.')
      setForm(emptyForm)
      loadData()
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError('Gagal booking jadwal: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('Yakin ingin membatalkan jadwal ini?')) return
    try {
      await jadwalAPI.update(id, { status: 'Dibatalkan' })
      loadData()
    } catch (err) {
      setError('Gagal membatalkan jadwal: ' + err.message)
    }
  }

  return (
    <div>
      <PageHeader title="Booking Jadwal" breadcrumb={['Beranda', 'Booking Jadwal']}/>

      {error   && <div className="mb-4"><Alert type="danger"  message={error}   onClose={() => setError('')}/></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')}/></div>}

      <Card className="mb-6">
        <h3 className="font-bold text-teks mb-4">Buat Booking Baru</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} required/>
            <InputField label="Jam" name="jam" type="time" value={form.jam} onChange={handleChange} required/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Dokter" name="dokter" value={form.dokter} onChange={handleChange} options={dokterList} placeholder=""/>
            <SelectField label="Jenis Perawatan" name="jenis_perawatan" value={form.jenis_perawatan} onChange={handleChange} options={tindakanList} placeholder=""/>
          </div>
          <InputField label="Catatan" name="catatan" value={form.catatan} onChange={handleChange} placeholder="Keluhan atau catatan tambahan (opsional)"/>
          <Button type="primary" icon={<MdEventAvailable/>} disabled={submitting}>
            {submitting ? 'Memproses...' : 'Booking Sekarang'}
          </Button>
        </form>
      </Card>

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-5 py-4 border-b border-garis">
          <h3 className="font-bold text-teks">Jadwal Saya</h3>
        </div>

        {loading && <div className="flex items-center justify-center gap-3 py-10"><Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat data...</span></div>}
        {!loading && jadwal.length === 0 && <div className="text-center py-12 text-teks-samping text-sm">Belum ada jadwal.</div>}
        {!loading && jadwal.length > 0 && (
          <Table headers={['Dokter', 'Tanggal', 'Jam', 'Perawatan', 'Status', 'Aksi']}>
            {jadwal.map(j => (
              <tr key={j.id} className="hover:bg-latar transition-colors">
                <td className="px-3 py-3.5 text-sm text-teks-samping">{j.dokter}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{j.tanggal ? new Date(j.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">{j.jam}</td>
                <td className="px-3 py-3.5 font-semibold text-teks">{j.jenis_perawatan}</td>
                <td className="px-3 py-3.5"><Badge type={statusType[j.status]}>{j.status}</Badge></td>
                <td className="px-3 py-3.5">
                  {j.status === 'Terjadwal' && (
                    <button onClick={() => handleCancel(j.id)} className="text-xs font-semibold text-merah hover:underline">Batalkan</button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  )
}
