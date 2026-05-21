// Uko UI Kit style Avatar
const colors = [
  'bg-biru-muda text-biru',
  'bg-hijau-muda text-hijau',
  'bg-ungu-muda text-ungu',
  'bg-pink-muda text-pink',
  'bg-kuning-muda text-[#B7860B]',
]

export default function Avatar({ name, src, size = "md", status }) {
  const sizes = {
    xs: "w-6 h-6 text-[9px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
  }
  const statusDot = {
    online:  "bg-hijau",
    offline: "bg-teks-samping",
    busy:    "bg-merah",
  }
  const colorIdx  = name ? name.charCodeAt(0) % colors.length : 0
  const initials  = name
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="relative inline-block flex-shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-garis`}
        />
      ) : (
        <div className={`${sizes[size]} ${colors[colorIdx]} rounded-full flex items-center justify-center font-bold`}>
          {initials}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${statusDot[status]} rounded-full border-2 border-white`} />
      )}
    </div>
  )
}
