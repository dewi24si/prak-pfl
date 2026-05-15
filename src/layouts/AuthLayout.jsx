import { Outlet } from 'react-router-dom'
import { FaTooth } from 'react-icons/fa'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-white">

      {/* Left: Form */}
      <div className="flex flex-col justify-center w-full lg:w-5/12 px-8 lg:px-16 py-12">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 bg-biru rounded-xl flex items-center justify-center shadow-sm">
            <FaTooth className="text-white text-lg" />
          </div>
          <div>
            <p className="font-poppins font-bold text-teks text-base leading-none">Permata</p>
            <p className="text-xs text-teks-samping">Klinik Gigi</p>
          </div>
        </div>

        <Outlet />

        <p className="text-xs text-teks-samping mt-10">
          © 2025 Klinik Gigi Permata. All rights reserved.
        </p>
      </div>

      {/* Right: Illustration */}
      <div className="hidden lg:flex flex-col flex-1 bg-biru-muda relative overflow-hidden items-center justify-center p-12">
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-biru/10 rounded-full" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 bg-biru/10 rounded-full" />
        <div className="absolute top-1/2 left-[-40px] w-32 h-32 bg-biru/5 rounded-full" />

        {/* Rocket SVG */}
        <div className="relative z-10 flex flex-col items-center">
          <svg viewBox="0 0 300 340" className="w-72 h-auto drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* clouds */}
            <ellipse cx="240" cy="80" rx="50" ry="35" fill="#DCDEFF" opacity="0.7"/>
            <ellipse cx="270" cy="65" rx="35" ry="28" fill="#DCDEFF" opacity="0.5"/>
            <ellipse cx="55" cy="230" rx="45" ry="30" fill="#DCDEFF" opacity="0.7"/>
            <ellipse cx="30" cy="218" rx="30" ry="22" fill="#DCDEFF" opacity="0.5"/>
            {/* rocket body */}
            <path d="M150 20 C150 20 190 60 200 140 L150 165 L100 140 C110 60 150 20 150 20Z" fill="#3D40E0"/>
            <path d="M150 20 C150 20 170 60 175 140 L150 165 L125 140 C130 60 150 20 150 20Z" fill="#5B5EF4"/>
            {/* window */}
            <circle cx="150" cy="110" r="20" fill="white" opacity="0.9"/>
            <circle cx="150" cy="110" r="14" fill="#DCDEFF"/>
            <circle cx="145" cy="105" r="4" fill="white" opacity="0.8"/>
            {/* wings */}
            <path d="M100 140 L70 175 L100 170 Z" fill="#3D40E0"/>
            <path d="M200 140 L230 175 L200 170 Z" fill="#3D40E0"/>
            {/* exhaust */}
            <path d="M125 165 C125 165 130 185 150 195 C170 185 175 165 175 165Z" fill="#F9A825" opacity="0.8"/>
            <path d="M132 165 C132 165 136 178 150 185 C164 178 168 165 168 165Z" fill="#FFEB3B"/>
            {/* flames */}
            <path d="M140 195 C140 195 143 215 150 225 C157 215 160 195 160 195 C155 205 150 210 145 205 Z" fill="#E53935" opacity="0.7"/>
            <path d="M144 195 C144 195 147 210 150 218 C153 210 156 195 156 195 C153 202 150 206 147 202 Z" fill="#F9A825"/>
          </svg>

          <div className="text-center mt-6 relative z-10">
            <h2 className="text-2xl font-poppins font-bold text-biru mb-2">Kelola Klinik Lebih Mudah</h2>
            <p className="text-teks-samping text-sm max-w-xs">
              Platform manajemen klinik gigi modern yang terintegrasi dan efisien.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
