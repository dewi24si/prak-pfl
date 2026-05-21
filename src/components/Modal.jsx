import { useEffect } from 'react'
import { MdClose } from 'react-icons/md'

export default function Modal({ isOpen, onClose, title, children, size = "md", footer }) {
  const sizes = {
    sm:   "max-w-sm",
    md:   "max-w-md",
    lg:   "max-w-lg",
    xl:   "max-w-xl",
    "2xl":"max-w-2xl",
  }

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else        document.body.style.overflow = ''
    return ()  => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className={`bg-white rounded-2xl shadow-[0_20px_60px_rgba(43,54,116,0.18)] w-full ${sizes[size]} flex flex-col max-h-[90vh]`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-garis flex-shrink-0">
          <h2 className="font-bold text-teks text-base">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-latar text-teks-samping hover:text-merah transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-garis flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
