export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  rows = 4,
  hint,
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-teks mb-2">
          {label}
          {required && <span className="text-merah ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`
          w-full px-4 py-3 border rounded-xl text-sm text-teks outline-none transition resize-none
          placeholder:text-teks-samping
          ${error
            ? 'border-merah bg-merah-muda/30 focus:ring-2 focus:ring-merah/20'
            : 'border-garis bg-white focus:border-biru focus:ring-2 focus:ring-biru-muda'
          }
        `}
      />
      {error && <p className="text-xs text-merah mt-1.5 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-teks-samping mt-1.5">{hint}</p>}
    </div>
  )
}
