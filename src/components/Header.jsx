import { useState, useEffect, useRef } from 'react'
import { MdNotifications, MdLogout, MdCalendarToday, MdPayment } from 'react-icons/md'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { jadwalAPI, pembayaranAPI } from '../services/supabaseAPI'
import Avatar from './Avatar'

const routeTitles = {
  '/admin/dashboard':  'Dashboard',
  '/admin/pasien':     'Data Pasien',
  '/admin/jadwal':     'Jadwal & Reminder',
  '/admin/pembayaran': 'Pembayaran',
  '/admin/riwayat':    'Riwayat Perawatan',
  '/admin/loyalitas':  'Program Loyalitas',
  '/admin/laporan':    'Laporan',
  '/admin/master-data':'Master Data',
  '/admin/components': 'Components',
  '/admin/users':      'Users',
  '/pasien/dashboard':  'Beranda',
  '/pasien/booking':    'Booking Jadwal',
  '/pasien/riwayat':    'Riwayat Perawatan',
  '/pasien/pembayaran': 'Pembayaran',
  '/pasien/profil':     'Profil Saya',
}

const hariIni = () => new Date().toISOString().split('T')[0]
const besok   = () => new Date(Date.now() + 86400000).toISOString().split('T')[0]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showNotif, setShowNotif] = useState(false)
  const [notifItems, setNotifItems] = useState([])
  const notifRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const loadNotif = async () => {
      try {
        if (user?.role === 'admin') {
          const [jadwal, bayar] = await Promise.all([jadwalAPI.fetchAll(), pembayaranAPI.fetchAll()])
          const items = []
          const hariIniCount = jadwal.filter(j => j.status === 'Terjadwal' && j.tanggal === hariIni()).length
          if (hariIniCount > 0) items.push({ icon: MdCalendarToday, text: `${hariIniCount} jadwal hari ini`, to: '/admin/jadwal' })
          const belumLunasCount = bayar.filter(b => b.status === 'Belum Lunas').length
          if (belumLunasCount > 0) items.push({ icon: MdPayment, text: `${belumLunasCount} pembayaran belum lunas`, to: '/admin/pembayaran' })
          setNotifItems(items)
        } else if (user?.pasienId) {
          const jadwal = await jadwalAPI.fetchByPasien(user.pasienId)
          const items = jadwal
            .filter(j => j.status === 'Terjadwal' && (j.tanggal === hariIni() || j.tanggal === besok()))
            .map(j => ({
              icon: MdCalendarToday,
              text: `${j.jenis_perawatan} ${j.tanggal === hariIni() ? 'hari ini' : 'besok'} jam ${j.jam}`,
              to: '/pasien/booking',
            }))
          setNotifItems(items)
        }
      } catch { /* gagal memuat notifikasi, biarkan kosong */ }
    }
    loadNotif()
  }, [user?.role, user?.pasienId])

  useEffect(() => {
    const handleClickOutside = e => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotif(v => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-latar transition-colors">
            <MdNotifications className="text-xl text-teks-samping" />
            {notifItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-merah rounded-full border-2 border-white" />
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_10px_40px_rgba(43,54,116,0.15)] border border-garis overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-garis">
                <p className="text-sm font-bold text-teks">Notifikasi</p>
              </div>
              {notifItems.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-teks-samping">Tidak ada notifikasi</div>
              ) : (
                <div className="divide-y divide-garis">
                  {notifItems.map((item, i) => (
                    <Link key={i} to={item.to} onClick={() => setShowNotif(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-latar transition-colors">
                      <item.icon className="text-biru text-lg flex-shrink-0"/>
                      <span className="text-sm text-teks">{item.text}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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
