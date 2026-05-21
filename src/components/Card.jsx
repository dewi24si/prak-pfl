// Uko UI Kit style Card — white, rounded-2xl, soft shadow
export default function Card({ children, className = "", hover = false, padding = "p-6" }) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-garis
        shadow-[0_2px_10px_rgba(43,54,116,0.06)]
        ${hover
          ? 'hover:shadow-[0_8px_24px_rgba(36,153,239,0.15)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
          : ''}
        ${padding} ${className}
      `}
    >
      {children}
    </div>
  )
}
