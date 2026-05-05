import { FaSearch } from 'react-icons/fa'
import { MdSettings, MdNotifications, MdLogout } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <div id="header-container" className="flex justify-between items-center p-4 bg-white border-b border-garis">
      {/* Search Bar */}
      <div id="search-bar" className="relative w-full max-w-md">
        <input
          id="search-input"
          type="text"
          placeholder="Cari pasien, jadwal..."
          className="border border-gray-200 p-2 pl-4 pr-10 bg-latar w-full rounded-xl outline-none text-sm text-teks"
        />
        <FaSearch id="search-icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teks-samping" />
      </div>

      {/* Icons & Profile */}
      <div id="icons-container" className="flex items-center space-x-3">
        <div id="notification-icon" className="relative p-2.5 bg-biru-muda rounded-2xl text-biru cursor-pointer">
          <MdNotifications className="text-xl" />
          <span id="notification-badge" className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-merah rounded-full px-1.5 py-0.5 text-[10px] text-white font-bold">
            3
          </span>
        </div>

        <div id="settings-icon" className="p-2.5 bg-biru-muda rounded-2xl text-biru cursor-pointer">
          <MdSettings className="text-xl" />
        </div>

        {/* Profile */}
        <div id="profile-container" className="flex items-center space-x-3 border-l pl-4 border-garis">
          <span id="profile-text" className="text-sm text-teks-samping">
            Halo, <b className="text-teks">drg. Sari</b>
          </span>
          <img
            id="profile-avatar"
            src="https://avatar.iran.liara.run/public/girl/5"
            className="w-9 h-9 rounded-full border-2 border-biru"
          />
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 bg-merah text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-red-600 transition"
        >
          <MdLogout className="text-lg" /> Keluar
        </button>
      </div>
    </div>
  )
}
