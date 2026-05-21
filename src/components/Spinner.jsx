export default function Spinner({ size = "md", color = "biru", label }) {
  const sizes = {
    sm:  "w-5 h-5 border-2",
    md:  "w-8 h-8 border-3",
    lg:  "w-12 h-12 border-4",
    xl:  "w-16 h-16 border-4",
  }
  const colors = {
    biru:  "border-biru-muda border-t-biru",
    hijau: "border-hijau-muda border-t-hijau",
    merah: "border-merah-muda border-t-merah",
    putih: "border-white/30 border-t-white",
  }
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
      {label && <p className="text-sm text-teks-samping font-medium">{label}</p>}
    </div>
  )
}
