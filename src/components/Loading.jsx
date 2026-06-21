export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-latar gap-3">
      <div className="w-10 h-10 border-4 border-biru-muda border-t-biru rounded-full animate-spin" />
      <p className="text-sm font-medium text-teks-samping">Memuat...</p>
    </div>
  )
}
