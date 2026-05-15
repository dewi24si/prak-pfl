import { FaSearch } from 'react-icons/fa'
import { MdNotifications, MdSettings, MdLogout, MdMenu } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  return (
    <header id="header-container" className="flex items-center justify-between px-6 py-3 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] z-10">

      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <MdMenu className="text-2xl text-teks-samping cursor-pointer hover:text-biru transition-colors" />
        <h1 className="text-base font-bold text-teks">Dashboard</h1>
      </div>

      {/* Center: search */}
      <div className="relative w-64 hidden md:block">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teks-samping text-xs" />
        <input
          type="text"
          placeholder="Search here..."
          className="w-full pl-9 pr-4 py-2 bg-latar rounded-full text-sm text-teks outline-none focus:ring-2 focus:ring-biru-muda transition placeholder:text-teks-samping"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Notification */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-latar transition-colors">
          <MdNotifications className="text-xl text-teks-samping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-merah rounded-full border-2 border-white" />
        </button>

        {/* Settings */}
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-latar transition-colors">
          <MdSettings className="text-xl text-teks-samping" />
        </button>

        <div className="w-px h-6 bg-garis mx-1" />

        {/* Profile */}
        <div className="flex items-center gap-2.5 cursor-pointer px-2 py-1 rounded-full hover:bg-latar transition-colors">
          <img src="https://avatar.iran.liara.run/public/girl/5" alt="avatar"
            className="w-8 h-8 rounded-full object-cover" />
          <div className="hidden sm:block">
            <p className="text-[13px] font-bold text-teks leading-none">drg. Sari</p>
            <p className="text-[11px] text-teks-samping mt-0.5">Admin</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate('/login')}
          className="ml-1 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-merah hover:bg-red-700 rounded-full transition-colors"
        >
          <MdLogout className="text-base" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  )
}
