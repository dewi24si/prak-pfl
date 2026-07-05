// Daftar tindakan & harga sekarang dikelola lewat halaman admin
// "Master Data" (tabel public.tindakan), bukan hardcode di sini lagi.
// Poin loyalitas yang didapat pasien setiap kunjungan ditandai Selesai.
// Bronze <50 poin, Silver 50-99 poin, Gold >=100 poin -> Silver di
// kunjungan ke-5, Gold di kunjungan ke-10.
export const POIN_PER_KUNJUNGAN = 10
