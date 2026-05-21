export default function Button({
  children,
  type = "primary",
  size = "md",
  shape = "rounded",
  onClick,
  disabled = false,
  fullWidth = false,
  icon,
  className = "",
}) {
  const types = {
    primary:   "bg-biru hover:bg-biru-hover text-white shadow-sm hover:shadow-md",
    secondary: "bg-latar hover:bg-garis text-teks",
    success:   "bg-hijau hover:bg-green-600 text-white shadow-sm",
    danger:    "bg-merah hover:bg-red-500 text-white shadow-sm",
    warning:   "bg-kuning hover:bg-yellow-400 text-teks shadow-sm",
    ghost:     "bg-transparent hover:bg-biru-muda text-biru border border-biru",
    outline:   "bg-transparent hover:bg-latar text-teks border border-garis",
  }
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2",
  }
  const shapes = {
    square:  "rounded-lg",
    rounded: "rounded-xl",
    pill:    "rounded-full",
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${types[type]} ${sizes[size]} ${shapes[shape]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
