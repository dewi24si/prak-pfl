// Uko UI Kit style Footer — dark bg, clean layout
import { FaTooth } from 'react-icons/fa'

export default function Footer({ appName = "Klinik Gigi Permata", year = 2025 }) {
  return (
    <footer className="bg-teks text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-biru rounded-xl flex items-center justify-center shadow-sm">
              <FaTooth className="text-white text-sm" />
            </div>
            <div className="leading-tight">
              <p className="font-poppins font-bold text-sm">Permata</p>
              <p className="text-[11px] text-white/40">Klinik Gigi</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {['Beranda', 'Layanan', 'Tentang', 'Kontak'].map(item => (
              <a
                key={item}
                href="#"
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/30">
            © {year} {appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
