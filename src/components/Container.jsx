export default function Container({ children, className = "", maxWidth = "7xl" }) {
  const maxWidths = {
    sm:  "max-w-sm",
    md:  "max-w-md",
    lg:  "max-w-lg",
    xl:  "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  }
  return (
    <div className={`${maxWidths[maxWidth]} mx-auto px-4 py-6 ${className}`}>
      {children}
    </div>
  )
}
