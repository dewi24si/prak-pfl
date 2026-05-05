import { NavLink } from 'react-router-dom'
import {
  MdDashboard, MdPerson, MdCalendarToday, MdPayment,
  MdHistory, MdStars, MdBarChart, MdAdd
} from 'react-icons/md'
import { FaTooth } from 'react-icons/fa'

const menuItems = [
  { to: '/dashboard',   icon: <MdDashboard />,    label: 'Dashboard' },
  { to: '/pasien',      icon: <MdPerson />,        label: 'Data Pasien' },
  { to: '/jadwal',      icon: <MdCalendarToday />, label: 'Jadwal & Reminder' },
  { to: '/pembayaran',  icon: <MdPayment />,       label: 'Pembayaran' },
  { to: '/riwayat',     icon: <MdHistory />,       label: 'Riwayat Perawatan' },
  { to: '/loyalitas',   icon: <MdStars />,         label: 'Program Loyalitas' },
  { to: '/laporan',     icon: <MdBarChart />,      label: 'Laporan' },
]

const menuClass = ({ isActive }) =>
  `flex cursor-pointer items-center rounded-xl p-3 space-x-3 font-medium transition-colors duration-150
  ${isActive
    ? 'text-biru bg-biru-muda font-semibold'
    : 'text-teks-samping hover:text-biru hover:bg-biru-muda'
  }`

export default function Sidebar() {
  return (
    <div id="sidebar" className="flex min-h-screen w-72 flex-col bg-white p-6 shadow-lg shrink-0">

      {/* Logo */}
      <div id="sidebar-logo" className="flex flex-col mb-2">
        <span className="font-poppins text-[28px] font-[900] text-teks flex items-center gap-2">
          <FaTooth className="text-biru" />
          Permata<span className="text-biru">.</span>
        </span>
        <span className="text-teks-samping text-sm font-medium">Klinik Gigi Permata</span>
      </div>

      <hr className="border-garis mb-4" />

      {/* Menu */}
      <div id="sidebar-menu" className="flex-1">
        <p className="text-xs text-teks-samping uppercase font-semibold tracking-wider mb-3 px-1">Menu Utama</p>
        <ul id="menu-list" className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/dashboard'}
                className={menuClass}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div id="sidebar-footer" className="mt-auto">
        <div className="bg-biru px-4 py-3 rounded-xl shadow mb-6 flex items-center gap-3">
          <div className="text-white text-sm flex-1">
            <p className="font-semibold">Tambah Pasien Baru</p>
            <p className="text-xs text-blue-100 mt-0.5">Daftarkan pasien dengan mudah</p>
            <NavLink
              to="/pasien"
              className="flex justify-center items-center gap-1 p-1.5 mt-2 bg-white rounded-md text-biru text-xs font-semibold"
            >
              <MdAdd /> Tambah Pasien
            </NavLink>
          </div>
        </div>
        <span className="font-bold text-teks-samping text-sm block">Klinik Gigi Permata</span>
        <p className="font-light text-teks-samping text-xs">© 2025 All Right Reserved</p>
      </div>
    </div>
  )
}
