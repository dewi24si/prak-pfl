import { MdNotifications, MdSettings, MdLogout } from 'react-icons/md'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Avatar from './Avatar'

const routeTitles = {
  '/admin/dashboard':  'Dashboard',
  '/admin/pasien':     'Data Pasien',
  '/admin/jadwal':     'Jadwal & Reminder',
  '/admin/pembayaran': 'Pembayaran',
  '/admin/riwayat':    'Riwayat Perawatan',
  '/admin/loyalitas':  'Program Loyalitas',
  '/admin/laporan':    'Laporan',
  '/admin/components': 'Components',
  '/admin/users':      'Users',
  '/pasien/dashboard':  'Beranda',
  '/pasien/booking':    'Booking Jadwal',
  '/pasien/riwayat':    'Riwayat Perawatan',
  '/pasien/pembayaran': 'Pembayaran',
  '/pasien/profil':     'Profil Saya',
}

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Match route title (handles dynamic segments like /pasien/:id)
  const pageTitle = Object.entries(routeTitles).find(([path]) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  )?.[1] ?? 'Halaman'

  return (
    <header id="header-container" className="flex items-center justify-between px-6 py-3 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] z-10">

      {/* Left: title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-teks">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-latar transition-colors">
          <MdNotifications className="text-xl text-teks-samping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-merah rounded-full border-2 border-white" />
        </button>

        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-latar transition-colors">
          <MdSettings className="text-xl text-teks-samping" />
        </button>

        <div className="w-px h-6 bg-garis mx-1" />

        <div className="flex items-center gap-2.5 cursor-pointer px-2 py-1 rounded-full hover:bg-latar transition-colors">
          <Avatar name={user?.email} size="sm" />
          <div className="hidden sm:block">
            <p className="text-[13px] font-bold text-teks leading-none">{user?.email || 'User'}</p>
            <p className="text-[11px] text-teks-samping mt-0.5 capitalize">{user?.role || 'User'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="ml-1 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-merah hover:bg-red-700 rounded-full transition-colors"
        >
          <MdLogout className="text-base" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  )
}
