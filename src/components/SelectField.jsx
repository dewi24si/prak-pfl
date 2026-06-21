// Uko UI Kit style SelectField — white bg, light border
import { MdKeyboardArrowDown } from 'react-icons/md'
export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  hint,
  placeholder = "Pilih...",
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
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full px-4 py-2.5 border rounded-xl text-sm text-teks outline-none transition
            appearance-none cursor-pointer bg-white pr-10
            ${error
              ? 'border-merah focus:ring-2 focus:ring-merah/20'
              : 'border-garis focus:border-biru focus:ring-2 focus:ring-biru-muda'
            }
          `}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) =>
            typeof opt === 'string'
              ? <option key={opt} value={opt}>{opt}</option>
              : <option key={opt.value} value={opt.value}>{opt.label}</option>
          )}
        </select>
        <MdKeyboardArrowDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teks-samping text-xl pointer-events-none" />
      </div>
      {error && <p className="text-xs text-merah mt-1.5 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-teks-samping mt-1.5">{hint}</p>}
    </div>
  )
}
