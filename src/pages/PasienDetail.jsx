import { useParams, Link } from 'react-router-dom'
import { MdArrowBack, MdEmail, MdPhone, MdLocationOn, MdCalendarToday, MdMedicalServices, MdPerson } from 'react-icons/md'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Button from '../components/Button'
import pasienData from '../data/pasien'

const tierType = { Bronze:'bronze', Silver:'silver', Gold:'gold' }

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-latar transition-colors">
      <span className="text-biru text-lg mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[11px] font-bold text-teks-samping uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-teks mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function PasienDetail() {
  const { id } = useParams()
  const pasien = pasienData.find(p => p.id === id)

  if (!pasien) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <MdPerson className="text-6xl text-teks-samping opacity-30"/>
        <p className="text-teks-samping font-medium">Pasien tidak ditemukan.</p>
        <Link to="/pasien"><Button type="ghost" size="sm">← Kembali ke Data Pasien</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Link to="/pasien" className="inline-flex items-center gap-1.5 text-sm text-teks-samping hover:text-biru transition-colors">
        <MdArrowBack/> Kembali ke Data Pasien
      </Link>

      <Card>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-garis">
          <Avatar name={pasien.nama} size="xl"/>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-teks">{pasien.nama}</h2>
            <p className="text-sm text-teks-samping mt-0.5">{pasien.id}</p>
          </div>
          <Badge type={tierType[pasien.loyalitas]}>{pasien.loyalitas}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <InfoItem icon={<MdEmail/>}          label="Email"         value={pasien.email}/>
          <InfoItem icon={<MdPhone/>}           label="Telepon"       value={pasien.telp}/>
          <InfoItem icon={<MdLocationOn/>}      label="Alamat"        value={pasien.alamat}/>
          <InfoItem icon={<MdCalendarToday/>}   label="Tanggal Lahir" value={pasien.tanggalLahir}/>
          <InfoItem icon={<MdPerson/>}          label="Jenis Kelamin" value={pasien.jenisKelamin}/>
          <InfoItem icon={<MdMedicalServices/>} label="Dokter"        value={pasien.dokter}/>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-teks mb-4">Riwayat Perawatan</h3>
        <div className="flex items-start gap-3 p-4 bg-latar rounded-xl mb-3">
          <div className="w-2 h-2 rounded-full bg-biru mt-2 flex-shrink-0"/>
          <div>
            <p className="text-sm font-semibold text-teks">{pasien.perawatanTerakhir}</p>
            <p className="text-xs text-teks-samping mt-0.5">{pasien.tanggalKunjungan}</p>
          </div>
        </div>
        <div className="p-4 bg-latar rounded-xl">
          <p className="text-xs font-bold text-teks-samping uppercase tracking-wider mb-1">Catatan Dokter</p>
          <p className="text-sm text-teks">{pasien.catatan}</p>
        </div>
      </Card>
    </div>
  )
}
