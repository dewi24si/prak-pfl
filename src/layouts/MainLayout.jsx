import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import {
  MdDashboard, MdPerson, MdCalendarToday, MdPayment,
  MdHistory, MdStars, MdBarChart, MdWidgets, MdManageAccounts, MdInventory,
} from 'react-icons/md'

const menuItems = [
  { to: '/admin/dashboard',  Icon: MdDashboard,      label: 'Dashboard', end: true },
  { to: '/admin/pasien',     Icon: MdPerson,          label: 'Data Pasien' },
  { to: '/admin/jadwal',     Icon: MdCalendarToday,   label: 'Jadwal & Reminder' },
  { to: '/admin/pembayaran', Icon: MdPayment,         label: 'Pembayaran' },
  { to: '/admin/riwayat',    Icon: MdHistory,         label: 'Riwayat Perawatan' },
  { to: '/admin/loyalitas',  Icon: MdStars,           label: 'Program Loyalitas' },
  { to: '/admin/laporan',    Icon: MdBarChart,        label: 'Laporan' },
  { to: '/admin/master-data',Icon: MdInventory,       label: 'Master Data' },
  { to: '/admin/users',      Icon: MdManageAccounts,  label: 'Users' },
]

const devItems = [
  { to: '/admin/components', Icon: MdWidgets, label: 'Components' },
]

export default function MainLayout() {
  return (
    <div id="app-container" className="flex min-h-screen bg-latar">
      <div className="print:hidden"><Sidebar menuItems={menuItems} devItems={devItems} /></div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="print:hidden"><Header /></div>
        <main className="flex-1 p-6 print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
