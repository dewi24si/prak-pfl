// Uko UI Kit style HeroSection — gradient biru Uko
import Button from "./Button"

export default function HeroSection({
  title     = "Selamat Datang di",
  highlight = "Klinik Gigi Permata",
  subtitle  = "Layanan kesehatan gigi terpercaya dengan teknologi modern dan tenaga profesional berpengalaman.",
  onPrimary,
  onSecondary,
}) {
  return (
    <section className="bg-gradient-to-br from-biru to-biru-hover rounded-2xl p-10 relative overflow-hidden">
      {/* Decorative circles — Uko style */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute bottom-[-50px] right-28 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute top-8 right-12 w-24 h-24 bg-white/8 rounded-full" />

      <div className="relative z-10 max-w-xl">
        <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full mb-5">
          🦷 Klinik Terpercaya #1 di Pekanbaru
        </span>
        <h1 className="text-3xl font-poppins font-bold text-white mb-2 leading-tight">
          {title}<br />
          <span className="text-white/80">{highlight}</span>
        </h1>
        <p className="text-white/60 text-sm mb-7 leading-relaxed">{subtitle}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            type="ghost"
            shape="rounded"
            onClick={onPrimary}
            className="!bg-white !text-biru !border-white hover:!bg-biru-muda"
          >
            Buat Janji Sekarang
          </Button>
          <button
            onClick={onSecondary}
            className="text-white/70 hover:text-white text-sm font-semibold transition-colors underline underline-offset-2"
          >
            Lihat Layanan →
          </button>
        </div>
      </div>
    </section>
  )
}
