import { useParams, Link } from 'react-router-dom'
import { MdArrowBack, MdPerson, MdEmail, MdPhone, MdLocationOn, MdCalendarToday, MdMedicalServices } from 'react-icons/md'
import pasienData from '../data/pasien'

const loyalBadge = {
  Bronze: 'bg-yellow-100 text-yellow-700',
  Silver: 'bg-gray-100 text-gray-600',
  Gold:   'bg-amber-100 text-amber-600',
}

export default function PasienDetail() {
  const { id } = useParams()
  const pasien = pasienData.find(p => p.id === id)

  if (!pasien) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <MdPerson className="text-6xl text-teks-samping opacity-30" />
        <p className="text-teks-samping font-medium">Pasien tidak ditemukan.</p>
        <Link to="/pasien" className="text-sm text-biru hover:underline">← Kembali ke Data Pasien</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link to="/pasien" className="inline-flex items-center gap-1.5 text-sm text-teks-samping hover:text-biru transition-colors">
        <MdArrowBack /> Kembali ke Data Pasien
      </Link>

      {/* Card utama */}
      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] p-6">
        {/* Header profil */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-garis">
          <div className="w-16 h-16 rounded-2xl bg-biru-muda flex items-center justify-center text-biru text-2xl font-bold flex-shrink-0">
            {pasien.nama[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-teks">{pasien.nama}</h2>
            <p className="text-sm text-teks-samping">{pasien.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${loyalBadge[pasien.loyalitas]}`}>
            {pasien.loyalitas}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={<MdEmail />}         label="Email"           value={pasien.email} />
          <InfoItem icon={<MdPhone />}          label="Telepon"         value={pasien.telp} />
          <InfoItem icon={<MdLocationOn />}     label="Alamat"          value={pasien.alamat} />
          <InfoItem icon={<MdCalendarToday />}  label="Tanggal Lahir"   value={pasien.tanggalLahir} />
          <InfoItem icon={<MdPerson />}         label="Jenis Kelamin"   value={pasien.jenisKelamin} />
          <InfoItem icon={<MdMedicalServices />} label="Dokter"         value={pasien.dokter} />
        </div>
      </div>

      {/* Riwayat perawatan */}
      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] p-6">
        <h3 className="font-bold text-teks mb-4">Riwayat Perawatan</h3>
        <div className="flex items-start gap-3 p-4 bg-latar rounded-xl">
          <div className="w-2 h-2 rounded-full bg-biru mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-teks">{pasien.perawatanTerakhir}</p>
            <p className="text-xs text-teks-samping mt-0.5">{pasien.tanggalKunjungan}</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-latar rounded-xl">
          <p className="text-xs font-bold text-teks-samping uppercase tracking-wider mb-1">Catatan Dokter</p>
          <p className="text-sm text-teks">{pasien.catatan}</p>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-latar transition-colors">
      <span className="text-biru text-lg mt-0.5">{icon}</span>
      <div>
        <p className="text-[11px] font-bold text-teks-samping uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-teks mt-0.5">{value}</p>
      </div>
    </div>
  )
}
