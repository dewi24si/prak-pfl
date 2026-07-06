import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MdArrowBack, MdEmail, MdPhone, MdLocationOn, MdCalendarToday, MdMedicalServices, MdPerson, MdStar, MdPayment, MdWarning } from 'react-icons/md'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Spinner from '../components/Spinner'
import Odontogram from '../components/Odontogram'
import LampiranMedis from '../components/LampiranMedis'
import { pasienAPI, jadwalAPI, riwayatAPI, pembayaranAPI } from '../services/supabaseAPI'
import { useAuth } from '../context/useAuth'

const tierType     = { Bronze: 'bronze', Silver: 'silver', Gold: 'gold' }
const getTier      = p => p >= 100 ? 'Gold' : p >= 50 ? 'Silver' : 'Bronze'
const statusType   = { Terjadwal: 'primary', Selesai: 'success', Dibatalkan: 'danger' }
const tindakanType = { 'Scaling':'primary','Tambal Gigi':'success','Konsultasi':'purple','Cabut Gigi':'danger','Pemasangan Behel':'warning','Veneer':'pink' }
const pembayaranStatusType = { 'Lunas': 'success', 'Belum Lunas': 'warning' }
const formatRp     = n => n ? `Rp ${Number(n).toLocaleString('id-ID')}` : '-'
const formatTgl    = d => d ? new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '-'

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-latar transition-colors">
      <span className="text-biru text-lg mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[11px] font-bold text-teks-samping uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-teks mt-0.5">{value || '-'}</p>
      </div>
    </div>
  )
}

export default function PasienDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const backTo = user?.role === 'dokter' ? '/dokter/pasien' : '/admin/pasien'
  const [pasien, setPasien]       = useState(null)
  const [jadwal, setJadwal]       = useState([])
  const [riwayat, setRiwayat]     = useState([])
  const [pembayaran, setPembayaran] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true)
        setError('')
        const [p, allJadwal, allRiwayat, allPembayaran] = await Promise.all([
          pasienAPI.fetchById(id),
          jadwalAPI.fetchAll(),
          riwayatAPI.fetchAll(),
          pembayaranAPI.fetchAll(),
        ])
        setPasien(p)
        setJadwal(allJadwal.filter(j => String(j.pasien_id) === String(id)))
        setRiwayat(allRiwayat.filter(r => String(r.pasien_id) === String(id)))
        setPembayaran(allPembayaran.filter(b => String(b.pasien_id) === String(id)))
      } catch (err) {
        setError(err.message)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center gap-3 py-20">
      <Spinner size="md" color="biru"/>
      <span className="text-teks-samping">Memuat data pasien...</span>
    </div>
  )

  if (error || !pasien) return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
      <MdPerson className="text-6xl text-teks-samping opacity-30"/>
      <p className="text-teks-samping font-medium">{error || 'Pasien tidak ditemukan.'}</p>
      <Link to={backTo} className="text-biru text-sm font-semibold hover:underline">← Kembali ke Data Pasien</Link>
    </div>
  )

  const tier = getTier(pasien.poin_loyalitas || 0)

  return (
    <div className="space-y-4">
      <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm text-teks-samping hover:text-biru transition-colors">
        <MdArrowBack/> Kembali ke Data Pasien
      </Link>

      {pasien.alergi && (
        <div className="flex items-start gap-2 rounded-lg border border-merah/40 bg-merah/10 px-4 py-3">
          <MdWarning className="text-merah text-xl mt-0.5 shrink-0"/>
          <div>
            <p className="text-sm font-bold text-teks">Alergi / Catatan Medis Penting</p>
            <p className="text-sm text-teks-samping">{pasien.alergi}</p>
          </div>
        </div>
      )}

      {/* Header card */}
      <Card>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-garis">
          <Avatar name={pasien.nama_lengkap} size="xl"/>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-teks">{pasien.nama_lengkap}</h2>
            <p className="text-sm text-teks-samping mt-0.5">{pasien.jenis_kelamin} · {formatTgl(pasien.tanggal_lahir)}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge type={pasien.status_pasien === 'Aktif' ? 'success' : 'default'}>{pasien.status_pasien || 'Aktif'}</Badge>
              <Badge type={tierType[tier]}>{tier}</Badge>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-kuning">
              <MdStar className="text-xl"/>
              <span className="text-2xl font-bold text-teks">{pasien.poin_loyalitas || 0}</span>
            </div>
            <p className="text-xs text-teks-samping">Poin Loyalitas</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <InfoItem icon={<MdEmail/>}          label="Email"                        value={pasien.email}/>
          <InfoItem icon={<MdPhone/>}           label="No. HP / WhatsApp"            value={pasien.no_hp}/>
          <InfoItem icon={<MdLocationOn/>}      label="Alamat"                       value={pasien.alamat}/>
          <InfoItem icon={<MdMedicalServices/>} label="Dokter Penanggung Jawab"      value={pasien.dokter_penanggung_jawab}/>
          <InfoItem icon={<MdCalendarToday/>}   label="Rekomendasi Kontrol"          value={formatTgl(pasien.jadwal_kontrol)}/>
          <InfoItem icon={<MdPerson/>}          label="Keluhan Utama"                value={pasien.keluhan_utama}/>
        </div>
        {pasien.catatan_dokter && (
          <div className="mt-4 p-4 bg-latar rounded-xl">
            <p className="text-xs font-bold text-teks-samping uppercase tracking-wider mb-1">Catatan Dokter</p>
            <p className="text-sm text-teks">{pasien.catatan_dokter}</p>
          </div>
        )}
      </Card>

      {/* Odontogram */}
      <Card>
        <h3 className="font-bold text-teks mb-1">Odontogram (Bagan Gigi)</h3>
        <p className="text-xs text-teks-samping mb-2">Notasi FDI · klik gigi untuk mencatat kondisi & tindakan</p>
        <Odontogram pasienId={id}/>
      </Card>

      {/* Lampiran rekam medis */}
      <Card>
        <h3 className="font-bold text-teks mb-1">Rekam Medis: Rontgen & Foto</h3>
        <p className="text-xs text-teks-samping mb-2">Unggah hasil rontgen atau foto klinis pasien</p>
        <LampiranMedis pasienId={id}/>
      </Card>

      {/* Jadwal pasien */}
      <Card padding="p-0">
        <div className="px-5 py-4 border-b border-garis">
          <h3 className="font-bold text-teks">Jadwal Perawatan</h3>
          <p className="text-xs text-teks-samping mt-0.5">{jadwal.length} jadwal tercatat</p>
        </div>
        {jadwal.length === 0 ? (
          <div className="text-center py-10 text-teks-samping text-sm">Belum ada jadwal untuk pasien ini</div>
        ) : (
          <div className="divide-y divide-garis">
            {jadwal.map(j => (
              <div key={j.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-10 h-10 bg-biru-muda rounded-xl flex items-center justify-center flex-shrink-0">
                  <MdCalendarToday className="text-biru"/>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-teks text-sm">{j.jenis_perawatan}</p>
                  <p className="text-xs text-teks-samping">{formatTgl(j.tanggal)} · {j.jam} · {j.dokter}</p>
                </div>
                <Badge type={statusType[j.status]}>{j.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Riwayat pasien */}
      <Card padding="p-0">
        <div className="px-5 py-4 border-b border-garis">
          <h3 className="font-bold text-teks">Riwayat Perawatan</h3>
          <p className="text-xs text-teks-samping mt-0.5">{riwayat.length} tindakan tercatat</p>
        </div>
        {riwayat.length === 0 ? (
          <div className="text-center py-10 text-teks-samping text-sm">Belum ada riwayat untuk pasien ini</div>
        ) : (
          <div className="divide-y divide-garis">
            {riwayat.map(r => (
              <div key={r.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-10 h-10 bg-hijau-muda rounded-xl flex items-center justify-center flex-shrink-0">
                  <MdMedicalServices className="text-hijau"/>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-teks text-sm">{r.tindakan}</p>
                    <Badge type={tindakanType[r.tindakan] || 'primary'}>{r.tindakan}</Badge>
                  </div>
                  <p className="text-xs text-teks-samping">{formatTgl(r.tanggal)} · {r.dokter} · {formatRp(r.biaya)}</p>
                  {r.catatan && <p className="text-xs text-teks-samping mt-0.5 italic">"{r.catatan}"</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pembayaran pasien */}
      <Card padding="p-0">
        <div className="px-5 py-4 border-b border-garis">
          <h3 className="font-bold text-teks">Riwayat Pembayaran</h3>
          <p className="text-xs text-teks-samping mt-0.5">{pembayaran.length} transaksi tercatat</p>
        </div>
        {pembayaran.length === 0 ? (
          <div className="text-center py-10 text-teks-samping text-sm">Belum ada pembayaran untuk pasien ini</div>
        ) : (
          <div className="divide-y divide-garis">
            {pembayaran.map(b => (
              <div key={b.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-10 h-10 bg-kuning-muda rounded-xl flex items-center justify-center flex-shrink-0">
                  <MdPayment className="text-kuning"/>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-teks text-sm">{b.jenis_perawatan}</p>
                  <p className="text-xs text-teks-samping">{formatTgl(b.tanggal)} · {b.metode_bayar} · {formatRp(b.biaya)}</p>
                </div>
                <Badge type={pembayaranStatusType[b.status]}>{b.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
