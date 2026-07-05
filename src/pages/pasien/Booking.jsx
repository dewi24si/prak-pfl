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
import { pasienAPI, jadwalAPI, pembayaranAPI } from '../../services/supabaseAPI'
import { useAuth } from '../../context/useAuth'
import { tindakanList, hargaTindakan } from '../../data/tindakan'
import { dokterList } from '../../data/dokter'

const statusType     = { Terjadwal: 'primary', Selesai: 'success', Dibatalkan: 'danger' }
const bayarStatusType = { 'Lunas': 'success', 'Belum Lunas': 'warning' }
const emptyForm      = { dokter: 'drg. Sari', tanggal: '', jam: '', jenis_perawatan: 'Scaling', catatan: '' }
const formatRupiah   = n => n ? `Rp ${Number(n).toLocaleString('id-ID')}` : 'Rp 0'
const hariIni        = () => new Date().toISOString().split('T')[0]

export default function PasienBooking() {
  const { user } = useAuth()
  const [jadwal, setJadwal]       = useState([])
  const [pembayaran, setPembayaran] = useState([])
  const [loading, setLoading]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [form, setForm]           = useState(emptyForm)

  const loadData = useCallback(async () => {
    try {
      setLoading(true); setError('')
      const [j, b] = await Promise.all([
        jadwalAPI.fetchByPasien(user.pasienId),
        pembayaranAPI.fetchByPasien(user.pasienId),
      ])
      setJadwal(j); setPembayaran(b)
    }
    catch { setError('Gagal memuat jadwal') }
    finally { setLoading(false) }
  }, [user.pasienId])

  useEffect(() => { loadData() }, [loadData])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.tanggal || !form.jam) return
    if (form.tanggal < hariIni()) {
      setError('Tanggal booking tidak boleh di masa lalu.')
      return
    }
    setSubmitting(true); setError('')
    try {
      const jadwalDokter = await jadwalAPI.fetchByDokterTanggal(form.dokter, form.tanggal)
      const bentrok = jadwalDokter.some(j => j.jam === form.jam && j.status !== 'Dibatalkan')
      if (bentrok) {
        setError(`${form.dokter} sudah ada jadwal lain jam ${form.jam} di tanggal tersebut. Silakan pilih jam lain.`)
        return
      }

      const pasien = await pasienAPI.fetchById(user.pasienId)
      const jadwalBaru = await jadwalAPI.create({
        pasien_id: user.pasienId,
        nama_pasien: pasien.nama_lengkap,
        dokter: form.dokter,
        tanggal: form.tanggal,
        jam: form.jam,
        jenis_perawatan: form.jenis_perawatan,
        status: 'Terjadwal',
        catatan: form.catatan,
      })

      // Setiap booking otomatis membuat tagihan pembayarannya sendiri,
      // supaya jadwal & pembayaran selalu terhubung sejak awal.
      await pembayaranAPI.create({
        pasien_id: user.pasienId,
        nama_pasien: pasien.nama_lengkap,
        jadwal_id: jadwalBaru.id,
        tanggal: form.tanggal,
        jenis_perawatan: form.jenis_perawatan,
        biaya: hargaTindakan[form.jenis_perawatan] || 0,
        metode_bayar: 'Cash',
        status: 'Belum Lunas',
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
      // Tagihan yang belum dibayar untuk jadwal ini ikut dibatalkan,
      // supaya tidak nyangkut sebagai "Belum Lunas" padahal kunjungannya batal.
      const tagihan = pembayaran.find(b => b.jadwal_id === id && b.status === 'Belum Lunas')
      if (tagihan) await pembayaranAPI.delete(tagihan.id)
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
            <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} min={hariIni()} required/>
            <InputField label="Jam" name="jam" type="time" value={form.jam} onChange={handleChange} required/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Dokter" name="dokter" value={form.dokter} onChange={handleChange} options={dokterList} placeholder=""/>
            <SelectField label="Jenis Perawatan" name="jenis_perawatan" value={form.jenis_perawatan} onChange={handleChange} options={tindakanList} placeholder=""
              hint={`Estimasi biaya: Rp ${(hargaTindakan[form.jenis_perawatan] || 0).toLocaleString('id-ID')}`}/>
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
          <Table headers={['Dokter', 'Tanggal', 'Jam', 'Perawatan', 'Status', 'Pembayaran', 'Aksi']}>
            {jadwal.map(j => {
              const bayar = pembayaran.find(b => b.jadwal_id === j.id)
              return (
                <tr key={j.id} className="hover:bg-latar transition-colors">
                  <td className="px-3 py-3.5 text-sm text-teks-samping">{j.dokter}</td>
                  <td className="px-3 py-3.5 text-sm text-teks-samping">{j.tanggal ? new Date(j.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="px-3 py-3.5 text-sm text-teks-samping">{j.jam}</td>
                  <td className="px-3 py-3.5 font-semibold text-teks">{j.jenis_perawatan}</td>
                  <td className="px-3 py-3.5"><Badge type={statusType[j.status]}>{j.status}</Badge></td>
                  <td className="px-3 py-3.5">
                    {bayar ? (
                      <div className="flex items-center gap-2">
                        <Badge type={bayarStatusType[bayar.status]}>{bayar.status}</Badge>
                        <span className="text-xs text-teks-samping">{formatRupiah(bayar.biaya)}</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-3 py-3.5">
                    {j.status === 'Terjadwal' && (
                      <button onClick={() => handleCancel(j.id)} className="text-xs font-semibold text-merah hover:underline">Batalkan</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </Table>
        )}
      </div>
    </div>
  )
}
