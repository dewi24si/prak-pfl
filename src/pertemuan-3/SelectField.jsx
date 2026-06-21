export default function SelectField({ id, label, value, onChange, onBlur, error, touched, options, placeholder }) {
  const isValid = touched && !error && value !== "";

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label} <span className="form-required">*</span>
      </label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`form-input form-select ${touched && error ? "input-error" : ""} ${isValid ? "input-valid" : ""}`}
      >
        <option value="">{placeholder || "Pilih..."}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {touched && error && (
        <div className="form-alert form-alert-error">
          <span className="alert-icon">!</span>
          {error}
        </div>
      )}

      {isValid && (
        <div className="form-alert form-alert-success">
          <span className="alert-icon">✓</span>
          Terisi dengan benar
        </div>
      )}
    </div>
  );
}
