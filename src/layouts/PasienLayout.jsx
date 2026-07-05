import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { MdDashboard, MdEventAvailable, MdHistory, MdPayment, MdPerson } from 'react-icons/md'

const menuItems = [
  { to: '/pasien/dashboard',  Icon: MdDashboard,      label: 'Beranda', end: true },
  { to: '/pasien/booking',    Icon: MdEventAvailable, label: 'Booking Jadwal' },
  { to: '/pasien/riwayat',    Icon: MdHistory,        label: 'Riwayat Perawatan' },
  { to: '/pasien/pembayaran', Icon: MdPayment,        label: 'Pembayaran' },
  { to: '/pasien/profil',     Icon: MdPerson,         label: 'Profil Saya' },
]

export default function PasienLayout() {
  return (
    <div id="app-container" className="flex min-h-screen bg-latar">
      <div className="print:hidden"><Sidebar menuItems={menuItems} /></div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="print:hidden"><Header /></div>
        <main className="flex-1 p-6 print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
