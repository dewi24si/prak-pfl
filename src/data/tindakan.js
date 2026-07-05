export const tindakanList = [
  'Scaling', 'Tambal Gigi', 'Cabut Gigi', 'Konsultasi',
  'Pemasangan Behel', 'Veneer', 'Bleaching', 'Implan',
]

// Harga acuan per jenis perawatan, dipakai untuk otomatis membuat
// tagihan pembayaran begitu jadwal/booking dibuat.
export const hargaTindakan = {
  'Scaling': 150000,
  'Tambal Gigi': 200000,
  'Cabut Gigi': 250000,
  'Konsultasi': 100000,
  'Pemasangan Behel': 5000000,
  'Veneer': 1500000,
  'Bleaching': 800000,
  'Implan': 6000000,
}

// Poin loyalitas yang didapat pasien setiap kunjungan ditandai Selesai.
// Bronze <50 poin, Silver 50-99 poin, Gold >=100 poin -> Silver di
// kunjungan ke-5, Gold di kunjungan ke-10.
export const POIN_PER_KUNJUNGAN = 10
