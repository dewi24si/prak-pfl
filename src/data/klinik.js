export const JAM_BUKA  = '08:00'
export const JAM_TUTUP = '20:00'
// 0 = Minggu, 1 = Senin, ... 6 = Sabtu. Klinik tutup di hari yang ada di sini.
export const HARI_TUTUP = [0]
export const NAMA_HARI_TUTUP = 'Minggu'

// Mengembalikan pesan error kalau di luar jam/hari operasional, atau null kalau valid.
export function cekJamOperasional(tanggal, jam) {
  if (!tanggal || !jam) return null
  const hari = new Date(`${tanggal}T00:00:00`).getDay()
  if (HARI_TUTUP.includes(hari)) {
    return `Klinik tutup di hari ${NAMA_HARI_TUTUP}. Silakan pilih hari lain.`
  }
  if (jam < JAM_BUKA || jam > JAM_TUTUP) {
    return `Jam operasional klinik ${JAM_BUKA}-${JAM_TUTUP}. Silakan pilih jam lain.`
  }
  return null
}
