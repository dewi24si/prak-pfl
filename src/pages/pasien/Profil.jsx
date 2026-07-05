import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner'
import { MdStars } from 'react-icons/md'
import { pasienAPI } from '../../services/supabaseAPI'
import { useAuth } from '../../context/useAuth'

const tierType = { Bronze: 'bronze', Silver: 'silver', Gold: 'gold' }
const getTier  = p => p >= 100 ? 'Gold' : p >= 50 ? 'Silver' : 'Bronze'

// 1 poin = Rp 1.000 diskon, minimal tukar 20 poin sekali tukar.
const RUPIAH_PER_POIN = 1000
const MIN_TUKAR_POIN  = 20

export default function PasienProfil() {
  const { user } = useAuth()
  const [pasien, setPasien]   = useState(null)
  const [form, setForm]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [jumlahTukar, setJumlahTukar] = useState('')
  const [redeeming, setRedeeming]     = useState(false)

  useEffect(() => {
    pasienAPI.fetchById(user.pasienId)
      .then(p => { setPasien(p); setForm(p) })
      .catch(() => setError('Gagal memuat profil'))
      .finally(() => setLoading(false))
  }, [user.pasienId])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const updated = await pasienAPI.update(user.pasienId, {
        nama_lengkap: form.nama_lengkap,
        jenis_kelamin: form.jenis_kelamin,
        tanggal_lahir: form.tanggal_lahir,
        no_hp: form.no_hp,
        alamat: form.alamat,
      })
      setPasien(updated)
      setSuccess('Profil berhasil diperbarui!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Gagal menyimpan: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRedeem = async () => {
    const jumlah = Number(jumlahTukar)
    const poinSekarang = pasien?.poin_loyalitas || 0
    if (!jumlah || jumlah < MIN_TUKAR_POIN) {
      setError(`Minimal tukar ${MIN_TUKAR_POIN} poin.`)
      return
    }
    if (jumlah > poinSekarang) {
      setError('Poin tidak cukup.')
      return
    }
    const nilaiDiskon = jumlah * RUPIAH_PER_POIN
    if (!confirm(`Tukar ${jumlah} poin dengan diskon Rp ${nilaiDiskon.toLocaleString('id-ID')}?`)) return
    setRedeeming(true); setError('')
    try {
      const updated = await pasienAPI.update(user.pasienId, { poin_loyalitas: poinSekarang - jumlah })
      setPasien(updated); setForm(f => ({ ...f, poin_loyalitas: updated.poin_loyalitas }))
      setJumlahTukar('')
      setSuccess(`Berhasil! Diskon Rp ${nilaiDiskon.toLocaleString('id-ID')} bisa ditunjukkan ke admin klinik saat pembayaran berikutnya.`)
      setTimeout(() => setSuccess(''), 6000)
    } catch (err) {
      setError('Gagal menukar poin: ' + err.message)
    } finally {
      setRedeeming(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center gap-3 py-20">
      <Spinner size="md" color="biru"/>
      <span className="text-teks-samping">Memuat profil...</span>
    </div>
  )

  const tier = getTier(pasien?.poin_loyalitas || 0)

  return (
    <div>
      <PageHeader title="Profil Saya" breadcrumb={['Beranda', 'Profil Saya']}/>

      {error   && <div className="mb-4"><Alert type="danger"  message={error}   onClose={() => setError('')}/></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')}/></div>}

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <Avatar name={pasien?.nama_lengkap} size="lg"/>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-teks">{pasien?.nama_lengkap}</h2>
            <p className="text-sm text-teks-samping">{pasien?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge type={pasien?.status_pasien === 'Aktif' ? 'success' : 'secondary'}>{pasien?.status_pasien || 'Aktif'}</Badge>
            <Badge type={tierType[tier]}>{tier}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-garis">
          <div className="flex items-center gap-2">
            <MdStars className="text-kuning text-xl"/>
            <span className="text-lg font-bold text-teks">{pasien?.poin_loyalitas || 0}</span>
            <span className="text-xs text-teks-samping">Poin Loyalitas</span>
          </div>
          {pasien?.dokter_penanggung_jawab && (
            <div className="text-sm text-teks-samping">
              Dokter Penanggung Jawab: <span className="font-semibold text-teks">{pasien.dokter_penanggung_jawab}</span>
            </div>
          )}
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="font-bold text-teks mb-1">Tukar Poin Loyalitas</h3>
        <p className="text-xs text-teks-samping mb-4">1 poin = Rp {RUPIAH_PER_POIN.toLocaleString('id-ID')} diskon, minimal tukar {MIN_TUKAR_POIN} poin.</p>
        <div className="flex items-end gap-3">
          <InputField label="Jumlah Poin" name="jumlahTukar" type="number" value={jumlahTukar}
            onChange={e => setJumlahTukar(e.target.value)} placeholder={String(MIN_TUKAR_POIN)}
            hint={jumlahTukar ? `Diskon: Rp ${(Number(jumlahTukar) * RUPIAH_PER_POIN || 0).toLocaleString('id-ID')}` : `Poin kamu: ${pasien?.poin_loyalitas || 0}`}/>
          <Button type="primary" onClick={handleRedeem} disabled={redeeming || !(pasien?.poin_loyalitas > 0)}>
            {redeeming ? 'Menukar...' : 'Tukar Sekarang'}
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-teks mb-4">Ubah Data Diri</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Nama Lengkap" name="nama_lengkap" value={form.nama_lengkap || ''}
              onChange={handleChange} required/>
            <SelectField label="Jenis Kelamin" name="jenis_kelamin" value={form.jenis_kelamin || ''}
              onChange={handleChange} options={['Laki-laki', 'Perempuan']} placeholder=""/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Tanggal Lahir" name="tanggal_lahir" type="date"
              value={form.tanggal_lahir || ''} onChange={handleChange}/>
            <InputField label="No. HP / WhatsApp" name="no_hp" value={form.no_hp || ''}
              onChange={handleChange} placeholder="08xx-xxxx-xxxx"/>
          </div>
          <InputField label="Alamat" name="alamat" value={form.alamat || ''}
            onChange={handleChange} placeholder="Alamat lengkap"/>
          <Button type="primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
        </form>
      </Card>
    </div>
  )
}
