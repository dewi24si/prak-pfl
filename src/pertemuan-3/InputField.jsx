export default function InputField({ id, label, type = "text", placeholder, value, onChange, onBlur, error, touched, unit }) {
  const isValid = touched && !error && value.trim() !== "";

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label} <span className="form-required">*</span>
      </label>

      <div className="form-input-wrapper">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-input ${touched && error ? "input-error" : ""} ${isValid ? "input-valid" : ""}`}
        />
        {unit && <span className="form-unit">{unit}</span>}
      </div>

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
