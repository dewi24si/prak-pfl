// Uko UI Kit style InputField — white bg, light border
export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  hint,
  icon,
  disabled = false,
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-teks mb-2">
          {label}
          {required && <span className="text-merah ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teks-samping text-base">
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full py-2.5 border rounded-xl text-sm text-teks outline-none transition
            placeholder:text-teks-samping disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10 pr-4' : 'px-4'}
            ${error
              ? 'border-merah bg-merah-muda/20 focus:ring-2 focus:ring-merah/20'
              : 'border-garis bg-white focus:border-biru focus:ring-2 focus:ring-biru-muda'
            }
          `}
        />
      </div>
      {error && <p className="text-xs text-merah mt-1.5 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-teks-samping mt-1.5">{hint}</p>}
    </div>
  )
}
