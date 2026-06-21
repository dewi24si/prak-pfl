// Uko UI Kit style StatCard
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md'

const tooltipText = {
  'Total Pasien':         'Jumlah seluruh pasien terdaftar di klinik',
  'Jadwal Hari Ini':      'Jumlah janji temu yang dijadwalkan hari ini',
  'Pendapatan Bulan Ini': 'Total pendapatan klinik pada bulan berjalan',
  'Pasien Baru':          'Pasien yang mendaftar dalam 30 hari terakhir',
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  up = true,
  color = "text-biru",
  bg = "bg-biru-muda",
}) {
  const tip = tooltipText[label] || label

  return (
    // ── DaisyUI Tooltip ──────────────────────────────────────────
    <div className="tooltip tooltip-bottom w-full" data-tip={tip}>
      <div className="bg-white rounded-2xl p-5 border border-garis shadow-[0_2px_10px_rgba(43,54,116,0.06)] hover:shadow-[0_6px_20px_rgba(36,153,239,0.12)] transition-shadow w-full text-left">
        <div className="flex items-start justify-between mb-4">
          <div className={`${bg} p-2.5 rounded-xl`}>
            {Icon && <Icon className={`text-[20px] ${color}`} />}
          </div>
          {change && (
            <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full
              ${up ? 'text-hijau bg-hijau-muda' : 'text-merah bg-merah-muda'}`}>
              {up ? <MdArrowUpward className="text-xs" /> : <MdArrowDownward className="text-xs" />}
              {change}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-teks">{value}</p>
        <p className="text-sm text-teks-samping mt-1">{label}</p>
      </div>
    </div>
  )
}
