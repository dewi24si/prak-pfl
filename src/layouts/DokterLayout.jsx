import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { MdDashboard, MdCalendarToday, MdPeople } from 'react-icons/md'

const menuItems = [
  { to: '/dokter/dashboard', Icon: MdDashboard,     label: 'Beranda', end: true },
  { to: '/dokter/jadwal',    Icon: MdCalendarToday,  label: 'Jadwal Saya' },
  { to: '/dokter/pasien',    Icon: MdPeople,         label: 'Pasien Saya' },
]

export default function DokterLayout() {
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
