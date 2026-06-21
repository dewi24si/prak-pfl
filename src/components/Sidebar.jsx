import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  MdDashboard, MdPerson, MdCalendarToday, MdPayment,
  MdHistory, MdStars, MdBarChart, MdChevronRight, MdChevronLeft,
  MdWidgets, MdManageAccounts, MdLogout
} from 'react-icons/md'
import { FaTooth } from 'react-icons/fa'
import { useAuth } from '../context/useAuth'

const menuItems = [
  { to: '/dashboard',  Icon: MdDashboard,      label: 'Dashboard' },
  { to: '/pasien',     Icon: MdPerson,          label: 'Data Pasien' },
  { to: '/jadwal',     Icon: MdCalendarToday,   label: 'Jadwal & Reminder' },
  { to: '/pembayaran', Icon: MdPayment,         label: 'Pembayaran' },
  { to: '/riwayat',    Icon: MdHistory,         label: 'Riwayat Perawatan' },
  { to: '/loyalitas',  Icon: MdStars,           label: 'Program Loyalitas' },
  { to: '/laporan',    Icon: MdBarChart,        label: 'Laporan' },
  { to: '/users',      Icon: MdManageAccounts,  label: 'Users' },
]

const devItems = [
  { to: '/components', Icon: MdWidgets, label: 'Components' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`relative flex flex-col min-h-screen bg-white shadow-[2px_0_20px_rgba(0,0,0,0.06)] shrink-0 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-garis ${collapsed ? 'justify-center px-3' : ''}`}>
        <div className="w-9 h-9 bg-biru rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <FaTooth className="text-white text-base" />
        </div>
        {!collapsed && (
          <div className="leading-tight overflow-hidden">
            <p className="font-poppins font-bold text-teks text-sm whitespace-nowrap">Permata</p>
            <p className="text-[11px] text-teks-samping">Klinik Gigi</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-4 space-y-0.5 ${collapsed ? 'px-2' : 'px-3'}`}>
        {!collapsed && <p className="text-[10px] uppercase font-bold tracking-widest text-teks-samping mb-2 px-3">Menu</p>}

        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'} title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150
               ${collapsed ? 'justify-center p-3' : 'px-3 py-2.5'}
               ${isActive ? 'bg-biru-muda text-biru' : 'text-teks-samping hover:bg-latar hover:text-teks'}`
            }>
            {({ isActive }) => (
              <>
                <item.Icon className={`text-[20px] flex-shrink-0 ${isActive ? 'text-biru' : ''}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-biru" />}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Developer section */}
        <div className="mt-4 pt-4 border-t border-garis">
          {!collapsed && <p className="text-[10px] uppercase font-bold tracking-widest text-teks-samping mb-2 px-3">Developer</p>}
          {devItems.map((item) => (
            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150
                 ${collapsed ? 'justify-center p-3' : 'px-3 py-2.5'}
                 ${isActive ? 'bg-biru-muda text-biru' : 'text-teks-samping hover:bg-latar hover:text-teks'}`
              }>
              {({ isActive }) => (
                <>
                  <item.Icon className={`text-[20px] flex-shrink-0 ${isActive ? 'text-biru' : ''}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-biru" />}
                    </>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User card + Logout */}
      {!collapsed ? (
        <div className="px-4 py-4 border-t border-garis">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-biru-muda flex items-center justify-center flex-shrink-0 ring-2 ring-biru-muda">
              <span className="text-biru font-bold text-sm">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-teks truncate">{user?.email || 'User'}</p>
              <p className="text-[11px] text-teks-samping truncate capitalize">{user?.role || 'user'}</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-hijau flex-shrink-0" />
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-merah hover:bg-merah-muda transition-colors">
            <MdLogout className="text-lg"/>
            <span>Keluar</span>
          </button>
        </div>
      ) : (
        <div className="px-2 py-4 border-t border-garis flex flex-col items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-biru-muda flex items-center justify-center ring-2 ring-biru-muda">
            <span className="text-biru font-bold text-sm">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <button onClick={handleLogout} title="Keluar"
            className="p-2 rounded-xl text-merah hover:bg-merah-muda transition-colors">
            <MdLogout className="text-lg"/>
          </button>
        </div>
      )}

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-[72px] w-7 h-7 bg-white border border-garis rounded-full flex items-center justify-center shadow-sm text-teks-samping hover:text-biru hover:border-biru transition-colors z-10">
        {collapsed ? <MdChevronRight className="text-base" /> : <MdChevronLeft className="text-base" />}
      </button>
    </aside>
  )
}
