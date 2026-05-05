import { Outlet } from 'react-router-dom'
import { FaTooth } from 'react-icons/fa'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-latar">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-3xl font-poppins font-[900] text-teks flex items-center gap-2">
            <FaTooth className="text-biru text-2xl" />
            Permata<span className="text-biru">.</span>
          </h1>
        </div>
        <p className="text-center text-teks-samping text-sm -mt-4 mb-6">Klinik Gigi Permata</p>

        <Outlet />

        <p className="text-center text-xs text-teks-samping mt-6">
          © 2025 Klinik Gigi Permata. All rights reserved.
        </p>
      </div>
    </div>
  )
}
