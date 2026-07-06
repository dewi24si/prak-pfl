export const JAM_BUKA  = '08:00'
export const JAM_TUTUP = '20:00'
// 0 = Minggu, 1 = Senin, ... 6 = Sabtu. Klinik tutup di hari yang ada di sini.
export const HARI_TUTUP = [0]
export const NAMA_HARI_TUTUP = 'Minggu'
export const NAMA_KLINIK = 'Klinik Gigi Permata'

// Mengubah no. HP lokal (08xx / +62xx) jadi format internasional tanpa
// simbol, sesuai yang dibutuhkan wa.me (contoh: 6281234567890).
export function formatNomorWA(noHp) {
  if (!noHp) return null
  const digit = noHp.replace(/\D/g, '')
  if (!digit) return null
  if (digit.startsWith('0')) return '62' + digit.slice(1)
  if (digit.startsWith('62')) return digit
  return '62' + digit
}

// Membuat link wa.me berisi pesan reminder jadwal yang sudah terisi otomatis,
// supaya admin tinggal klik & kirim tanpa perlu ketik ulang manual.
export function buatLinkReminderWA({ noHp, namaPasien, tanggal, jam, dokter, jenisPerawatan }) {
  const nomor = formatNomorWA(noHp)
  if (!nomor) return null
  const tanggalFormat = tanggal ? new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'
  const pesan = `Halo ${namaPasien}, mengingatkan jadwal kunjungan Anda di ${NAMA_KLINIK}:\n\n`
    + `Tanggal: ${tanggalFormat}\nJam: ${jam}\nDokter: ${dokter}\nPerawatan: ${jenisPerawatan}\n\n`
    + `Mohon datang tepat waktu. Jika perlu mengubah jadwal, silakan balas pesan ini. Terima kasih.`
  return `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`
}

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
