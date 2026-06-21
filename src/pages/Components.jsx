import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import ProductCard from '../components/ProductCard'
import Table from '../components/Table'
import InputField from '../components/InputField'
import TextArea from '../components/TextArea'
import SelectField from '../components/SelectField'
import Alert from '../components/Alert'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
import Container from '../components/Container'
import {
  MdPerson, MdCalendarToday, MdPayment, MdTrendingUp,
  MdSearch, MdEmail, MdPhone,
} from 'react-icons/md'

const sampleProducts = [
  { image:'https://images.unsplash.com/photo-1588776814546-1ffbb172d4fd?w=400', title:'Scaling Gigi', category:'Kebersihan', price:'Rp 250.000', description:'Pembersihan karang gigi dengan alat ultrasonik modern oleh dokter gigi berpengalaman.' },
  { image:'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400', title:'Pemasangan Behel', category:'Ortodonsi', price:'Rp 5.000.000', description:'Behel metal atau estetik untuk merapikan gigi dengan pengawasan dokter spesialis.' },
  { image:'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400', title:'Veneer Gigi', category:'Estetika', price:'Rp 2.500.000', description:'Lapisan tipis porselen untuk mempercantik tampilan gigi depan Anda secara estetis.' },
]

const tableHeaders = ['No', 'Nama Pasien', 'Tindakan', 'Status', 'Aksi']
const tableData = [
  { id:1, nama:'Budi Santoso',   tindakan:'Scaling',         status:'Selesai'   },
  { id:2, nama:'Ani Rahayu',     tindakan:'Tambal Gigi',      status:'Terjadwal' },
  { id:3, nama:'Citra Dewi',     tindakan:'Konsultasi',       status:'Dibatalkan'},
]

const statusStyle = {
  Selesai:    'bg-hijau-muda text-hijau',
  Terjadwal:  'bg-biru-muda text-biru',
  Dibatalkan: 'bg-merah-muda text-merah',
}

function SectionLabel({ number, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="w-9 h-9 bg-biru rounded-xl flex items-center justify-center font-poppins font-bold text-white text-sm flex-shrink-0">
        {number}
      </div>
      <div>
        <h2 className="text-base font-bold text-teks">{title}</h2>
        {subtitle && <p className="text-xs text-teks-samping">{subtitle}</p>}
      </div>
    </div>
  )
}

function ComponentBox({ label, children }) {
  return (
    <div className="bg-white rounded-2xl border border-garis shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
      <p className="text-[10px] font-bold text-teks-samping uppercase tracking-widest mb-4 pb-3 border-b border-garis">
        {label}
      </p>
      {children}
    </div>
  )
}

export default function Components() {
  const [showModal, setShowModal]   = useState(false)
  const [showAlert, setShowAlert]   = useState(true)
  const [formData, setFormData]     = useState({ nama:'', catatan:'', layanan:'' })
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <div className="space-y-10">
      <PageHeader
        title="Components"
        breadcrumb={['Beranda', 'Components']}
      />

      {/* 1. BASIC COMPONENT */}
      <section>
        <SectionLabel number="1" title="Basic Component"
          subtitle="Komponen kecil yang sering dipakai berulang di banyak halaman" />
        <div className="grid md:grid-cols-3 gap-4">

          {/* Button */}
          <ComponentBox label="Button.jsx — variants & shapes">
            <div className="flex flex-wrap gap-2 mb-3">
              <Button type="primary">Primary</Button>
              <Button type="secondary">Secondary</Button>
              <Button type="success">Success</Button>
              <Button type="danger">Danger</Button>
              <Button type="warning">Warning</Button>
              <Button type="ghost">Ghost</Button>
              <Button type="outline">Outline</Button>
              <Button type="primary" disabled>Disabled</Button>
            </div>
            <p className="text-[10px] text-teks-samping mb-2 font-bold uppercase tracking-widest">Shape: square / rounded / pill</p>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Button type="primary" shape="square">Square</Button>
              <Button type="primary" shape="rounded">Rounded</Button>
              <Button type="primary" shape="pill">Pill</Button>
            </div>
            <p className="text-[10px] text-teks-samping mb-2 font-bold uppercase tracking-widest">Size: sm / md / lg</p>
            <div className="flex items-center gap-2">
              <Button type="primary" size="sm">Small</Button>
              <Button type="primary" size="md">Medium</Button>
              <Button type="primary" size="lg">Large</Button>
            </div>
          </ComponentBox>

          {/* Badge */}
          <ComponentBox label="Badge.jsx — variants">
            <div className="flex flex-wrap gap-2">
              <Badge type="primary">Primary</Badge>
              <Badge type="success">Selesai</Badge>
              <Badge type="danger">Dibatalkan</Badge>
              <Badge type="warning">Pending</Badge>
              <Badge type="purple">VIP</Badge>
              <Badge type="pink">Baru</Badge>
            </div>
            <p className="text-[10px] text-teks-samping mt-3">Dengan dot indicator</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge type="success" dot>Online</Badge>
              <Badge type="danger" dot>Offline</Badge>
              <Badge type="warning" dot>Away</Badge>
              <Badge type="bronze" dot>Bronze</Badge>
              <Badge type="silver" dot>Silver</Badge>
              <Badge type="gold" dot>Gold</Badge>
            </div>
          </ComponentBox>

          {/* Avatar */}
          <ComponentBox label="Avatar.jsx — sizes & status">
            <div className="flex items-end gap-3 mb-3">
              <Avatar name="Budi Santoso" size="xs" />
              <Avatar name="Ani Rahayu" size="sm" />
              <Avatar name="Citra Dewi" size="md" />
              <Avatar name="Deni K" size="lg" />
            </div>
            <p className="text-[10px] text-teks-samping mb-2">Dengan foto & status</p>
            <div className="flex items-center gap-3">
              <Avatar name="drg. Sari" src="https://avatar.iran.liara.run/public/girl/5" size="md" status="online" />
              <Avatar name="drg. Reza" src="https://avatar.iran.liara.run/public/boy/10" size="md" status="busy" />
              <Avatar name="Admin" size="md" status="offline" />
            </div>
          </ComponentBox>
        </div>
      </section>

      {/* 2. LAYOUT COMPONENT */}
      <section>
        <SectionLabel number="2" title="Layout Component"
          subtitle="Kerangka utama penyusun halaman" />
        <div className="grid md:grid-cols-2 gap-4">
          <ComponentBox label="Container.jsx — wrapper halaman">
            <div className="bg-latar rounded-xl p-1">
              <Container maxWidth="full" className="!py-4 !px-4 bg-white rounded-lg border border-dashed border-garis">
                <p className="text-sm text-teks-samping text-center">Content di dalam Container</p>
              </Container>
            </div>
            <p className="text-xs text-teks-samping mt-3">Props: <code className="bg-latar px-1.5 py-0.5 rounded text-biru text-[11px]">maxWidth</code> — sm / md / lg / xl / 7xl / full</p>
          </ComponentBox>

          <ComponentBox label="Footer.jsx — penutup halaman">
            <div className="rounded-xl overflow-hidden scale-90 origin-top">
              <Footer appName="Klinik Gigi Permata" year={2025} />
            </div>
          </ComponentBox>
        </div>
      </section>

      {/* 3. DATA DISPLAY COMPONENT */}
      <section>
        <SectionLabel number="3" title="Data Display Component"
          subtitle="Komponen untuk menampilkan informasi dan data kepada pengguna" />

        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <StatCard icon={MdPerson}        label="Total Pasien"        value="248"      change="+12%"  up color="text-biru"   bg="bg-biru-muda"  />
          <StatCard icon={MdCalendarToday} label="Jadwal Hari Ini"     value="12"       change="+3"    up color="text-hijau"  bg="bg-hijau-muda" />
          <StatCard icon={MdPayment}       label="Pendapatan Bulan Ini" value="Rp 42jt" change="+8%"   up color="text-kuning" bg="bg-kuning-muda"/>
          <StatCard icon={MdTrendingUp}    label="Pasien Baru"         value="18"       change="-2"    color="text-ungu"  bg="bg-ungu-muda"  />
        </div>

        <ComponentBox label="Card.jsx — info wrapper">
          <div className="grid md:grid-cols-3 gap-3">
            <Card>
              <p className="font-bold text-teks mb-1">Card Default</p>
              <p className="text-sm text-teks-samping">Pembungkus konten standar dengan shadow halus.</p>
            </Card>
            <Card hover>
              <p className="font-bold text-teks mb-1">Card Hover</p>
              <p className="text-sm text-teks-samping">Hover untuk melihat efek lift dan shadow biru.</p>
            </Card>
            <Card className="border-l-4 border-l-biru">
              <p className="font-bold text-teks mb-1">Card Accent</p>
              <p className="text-sm text-teks-samping">Dengan border kiri untuk penekanan visual.</p>
            </Card>
          </div>
        </ComponentBox>

        <div className="mt-4">
          <ComponentBox label="ProductCard.jsx — kartu layanan klinik">
            <div className="grid md:grid-cols-3 gap-4">
              {sampleProducts.map((p, i) => (
                <ProductCard key={i} {...p} />
              ))}
            </div>
          </ComponentBox>
        </div>

        <div className="mt-4">
          <ComponentBox label="Table.jsx — tabel data pasien">
            <Table headers={tableHeaders}>
              {tableData.map((row, i) => (
                <tr key={row.id} className="hover:bg-latar transition-colors">
                  <td className="px-5 py-3.5 text-sm text-teks-samping">{i + 1}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-teks">{row.nama}</td>
                  <td className="px-5 py-3.5 text-sm text-teks-samping">{row.tindakan}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Button type="ghost" size="sm">Detail</Button>
                  </td>
                </tr>
              ))}
            </Table>
          </ComponentBox>
        </div>
      </section>

      {/* 4. FORM COMPONENT */}
      <section>
        <SectionLabel number="4" title="Form Component"
          subtitle="Komponen untuk menerima input dari pengguna" />
        <ComponentBox label="InputField · TextArea · SelectField">
          <div className="grid md:grid-cols-2 gap-5">
            <InputField label="Nama Lengkap" name="nama" value={formData.nama}
              onChange={handleChange} placeholder="Nama pasien..." required
              hint="Masukkan nama sesuai KTP" icon={<MdPerson />} />
            <InputField label="Email" name="email" type="email"
              placeholder="email@contoh.com" icon={<MdEmail />} />
            <InputField label="Telepon" name="telp" type="tel"
              placeholder="08xx-xxxx-xxxx" icon={<MdPhone />} />
            <InputField label="Dengan Error" name="err"
              placeholder="Cek error state..." error="Field ini wajib diisi" />
            <SelectField label="Layanan" name="layanan" value={formData.layanan}
              onChange={handleChange} placeholder="Pilih layanan..."
              options={['Scaling','Tambal Gigi','Cabut Gigi','Konsultasi','Pemasangan Behel','Veneer']} />
            <SelectField label="Dokter" name="dokter"
              options={[{value:'sari',label:'drg. Sari'},{value:'reza',label:'drg. Reza'}]}
              placeholder="Pilih dokter..." />
            <div className="md:col-span-2">
              <TextArea label="Catatan / Keluhan" name="catatan" value={formData.catatan}
                onChange={handleChange} placeholder="Deskripsikan keluhan pasien..."
                rows={3} hint="Maksimal 500 karakter" />
            </div>
          </div>
        </ComponentBox>
      </section>

      {/* 5. FEEDBACK COMPONENT */}
      <section>
        <SectionLabel number="5" title="Feedback Component"
          subtitle="Memberikan respons kepada pengguna setelah terjadi suatu aksi" />
        <div className="grid md:grid-cols-2 gap-4">
          <ComponentBox label="Alert.jsx — variants">
            <div className="space-y-3">
              <Alert type="success" title="Data Berhasil Disimpan" message="Pasien baru telah ditambahkan ke sistem." />
              <Alert type="danger"  title="Terjadi Kesalahan"      message="Gagal menghubungi server. Coba lagi." />
              <Alert type="warning" title="Perhatian"              message="Data belum tersimpan, pastikan semua field terisi." />
              {showAlert && (
                <Alert type="info" title="Informasi" message="Jadwal kontrol pasien hari ini ada 12 antrian."
                  onClose={() => setShowAlert(false)} />
              )}
              {!showAlert && (
                <button onClick={() => setShowAlert(true)} className="text-xs text-biru hover:underline">
                  ↺ Tampilkan alert info lagi
                </button>
              )}
            </div>
          </ComponentBox>

          <ComponentBox label="Spinner.jsx · Modal.jsx">
            <p className="text-xs text-teks-samping mb-3 font-semibold">Spinner — sizes & colors</p>
            <div className="flex items-end gap-6 mb-5">
              <Spinner size="sm" color="biru" />
              <Spinner size="md" color="hijau" />
              <Spinner size="lg" color="merah" />
              <Spinner size="xl" color="biru" label="Memuat..." />
            </div>
            <p className="text-xs text-teks-samping mb-3 font-semibold">Modal — klik tombol untuk preview</p>
            <div className="flex gap-2">
              <Button type="primary" onClick={() => setShowModal(true)}>Buka Modal</Button>
            </div>
          </ComponentBox>
        </div>
      </section>

      {/* 6. SECTION COMPONENT */}
      <section>
        <SectionLabel number="6" title="Section Component"
          subtitle="Mewakili satu bagian besar dalam halaman, sering dipakai di landing page" />
        <ComponentBox label="HeroSection.jsx — landing page banner">
          <HeroSection />
        </ComponentBox>
      </section>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title="Konfirmasi Tindakan"
        footer={
          <div className="flex justify-end gap-3">
            <Button type="outline" onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="danger" onClick={() => setShowModal(false)}>Hapus Data</Button>
          </div>
        }
      >
        <Alert type="warning" message="Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan." />
        <div className="mt-4 p-4 bg-latar rounded-xl">
          <p className="text-sm font-semibold text-teks mb-1">Pasien: Budi Santoso</p>
          <p className="text-xs text-teks-samping">ID: P001 · Terakhir kunjungan: 3 Jun 2025</p>
        </div>
      </Modal>
    </div>
  )
}
