// Uko UI Kit style Badge
export default function Badge({ children, type = "primary", dot = false }) {
  const types = {
    primary:   "bg-biru-muda text-biru",
    secondary: "bg-latar text-teks-samping",
    success:   "bg-hijau-muda text-hijau",
    danger:    "bg-merah-muda text-merah",
    warning:   "bg-kuning-muda text-[#B7860B]",
    purple:    "bg-ungu-muda text-ungu",
    pink:      "bg-pink-muda text-pink",
    bronze:    "bg-yellow-100 text-yellow-700",
    silver:    "bg-gray-100 text-gray-500",
    gold:      "bg-amber-100 text-amber-600",
  }
  const dots = {
    primary:   "bg-biru",
    secondary: "bg-teks-samping",
    success:   "bg-hijau",
    danger:    "bg-merah",
    warning:   "bg-kuning",
    purple:    "bg-ungu",
    pink:      "bg-pink",
    bronze:    "bg-yellow-500",
    silver:    "bg-gray-400",
    gold:      "bg-amber-400",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${types[type]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dots[type]}`} />}
      {children}
    </span>
  )
}
