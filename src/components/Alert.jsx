// Uko UI Kit style Alert
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md'

const config = {
  success: { icon: MdCheckCircle, bg: 'bg-hijau-muda',  border: 'border-hijau/30',  text: 'text-hijau',  title: 'Berhasil!' },
  danger:  { icon: MdError,       bg: 'bg-merah-muda',  border: 'border-merah/30',  text: 'text-merah',  title: 'Terjadi Kesalahan!' },
  warning: { icon: MdWarning,     bg: 'bg-kuning-muda', border: 'border-kuning/40', text: 'text-[#B7860B]', title: 'Perhatian!' },
  info:    { icon: MdInfo,        bg: 'bg-biru-muda',   border: 'border-biru/20',   text: 'text-biru',   title: 'Informasi' },
}

export default function Alert({ type = "info", message, title, onClose, className = "" }) {
  const { icon: Icon, bg, border, text, title: defaultTitle } = config[type] || config.info
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${bg} ${border} ${className}`}>
      <Icon className={`text-xl flex-shrink-0 mt-0.5 ${text}`} />
      <div className="flex-1 min-w-0">
        {(title || defaultTitle) && (
          <p className={`text-sm font-bold ${text} mb-0.5`}>{title || defaultTitle}</p>
        )}
        {message && <p className={`text-sm ${text} opacity-80`}>{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${text} opacity-50 hover:opacity-100 transition-opacity flex-shrink-0`}
        >
          <MdClose className="text-lg" />
        </button>
      )}
    </div>
  )
}
