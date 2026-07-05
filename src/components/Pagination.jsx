export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-1.5 px-5 py-4 border-t border-garis">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-garis text-teks-samping hover:bg-latar disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        Sebelumnya
      </button>
      <span className="text-xs text-teks-samping px-2">Halaman {page} dari {totalPages}</span>
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-garis text-teks-samping hover:bg-latar disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        Selanjutnya
      </button>
    </div>
  )
}
