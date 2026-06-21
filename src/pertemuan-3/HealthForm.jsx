import { useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import "./form.css";


const VALIDATIONS = {
  nama: [
    { test: (v) => v.trim().length > 0,          msg: "Nama tidak boleh kosong" },
    { test: (v) => v.trim().length >= 3,          msg: "Nama minimal 3 karakter" },
    { test: (v) => !/\d/.test(v),                 msg: "Nama tidak boleh mengandung angka" },
    { test: (v) => /^[a-zA-Z\s'.-]+$/.test(v),   msg: "Hanya huruf, spasi, dan tanda hubung" },
  ],
  tinggi: [
    { test: (v) => v.trim() !== "",               msg: "Tinggi badan tidak boleh kosong" },
    { test: (v) => !isNaN(Number(v)),             msg: "Harus berupa angka" },
    { test: (v) => Number(v) >= 50,               msg: "Tinggi minimal 50 cm" },
    { test: (v) => Number(v) <= 300,              msg: "Tinggi maksimal 300 cm" },
  ],
  berat: [
    { test: (v) => v.trim() !== "",               msg: "Berat badan tidak boleh kosong" },
    { test: (v) => !isNaN(Number(v)),             msg: "Harus berupa angka" },
    { test: (v) => Number(v) >= 10,               msg: "Berat minimal 10 kg" },
    { test: (v) => Number(v) <= 500,              msg: "Berat maksimal 500 kg" },
  ],
  kelamin: [
    { test: (v) => v !== "",                      msg: "Pilih jenis kelamin" },
  ],
  aktivitas: [
    { test: (v) => v !== "",                      msg: "Pilih tingkat aktivitas" },
  ],
};

function validate(field, value) {
  const rules = VALIDATIONS[field] || [];
  for (const rule of rules) {
    if (!rule.test(value)) return rule.msg;
  }
  return null;
}

// ─── Komponen Progress Bar ──────────────────────────────────────────────────
function ProgressBar({ fields, values, touched, errors }) {
  const done = fields.filter(
    (f) => touched[f] && !errors[f] && (values[f] || "").toString().trim() !== ""
  ).length;

  return (
    <div className="progress-wrap">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(done / fields.length) * 100}%` }}
        />
      </div>
      <span className="progress-label">{done}/{fields.length} field terisi</span>
    </div>
  );
}

// ─── Komponen Hasil ──────────────────────────────────────────────────────────
function HasilKalkulasi({ data, onReset }) {
  const h = Number(data.tinggi) / 100;
  const w = Number(data.berat);
  const bmi = (w / (h * h)).toFixed(1);

  let kategori, bmiClass;
  if (bmi < 18.5)      { kategori = "Kurus";    bmiClass = "bmi-kurus"; }
  else if (bmi < 25)   { kategori = "Normal";   bmiClass = "bmi-normal"; }
  else if (bmi < 30)   { kategori = "Gemuk";    bmiClass = "bmi-gemuk"; }
  else                 { kategori = "Obesitas"; bmiClass = "bmi-obesitas"; }

  const multiplier = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  const bmr =
    data.kelamin === "laki"
      ? 88.36 + 13.4 * w + 4.8 * Number(data.tinggi) - 5.7 * 25
      : 447.6 + 9.25 * w + 3.1 * Number(data.tinggi) - 4.3 * 25;
  const kalori = Math.round(bmr * (multiplier[data.aktivitas] || 1.55));

  const beratIdeal =
    data.kelamin === "laki"
      ? ((Number(data.tinggi) - 100) * 0.9).toFixed(1)
      : ((Number(data.tinggi) - 100) * 0.85).toFixed(1);

  const labelAktivitas = {
    sedentary: "Tidak Aktif",
    light: "Aktif Ringan",
    moderate: "Aktif Sedang",
    active: "Sangat Aktif",
    very_active: "Ekstra Aktif",
  };

  return (
    <div className="hasil-wrap">
      <h2 className="hasil-title">
        Halo, <span className="highlight">{data.nama}</span>! 👋
      </h2>
      <p className="hasil-subtitle">Berikut hasil analisis kesehatan kamu</p>

      <div className="hasil-grid">
        <div className="hasil-card">
          <p className="card-label">Indeks Massa Tubuh</p>
          <p className={`card-value ${bmiClass}`}>{bmi}</p>
          <p className="card-sub">{kategori}</p>
        </div>
        <div className="hasil-card">
          <p className="card-label">Kebutuhan Kalori</p>
          <p className="card-value">{kalori.toLocaleString()}</p>
          <p className="card-sub">kkal/hari</p>
        </div>
        <div className="hasil-card">
          <p className="card-label">Berat Ideal</p>
          <p className="card-value">{beratIdeal}</p>
          <p className="card-sub">kg (estimasi)</p>
        </div>
      </div>

      <div className="hasil-tags">
        <span className="tag">{data.kelamin === "laki" ? "Laki-laki" : "Perempuan"}</span>
        <span className="tag">{data.tinggi} cm</span>
        <span className="tag">{data.berat} kg</span>
        <span className="tag">{labelAktivitas[data.aktivitas]}</span>
      </div>

      <button className="btn-reset" onClick={onReset}>
        ← Isi Ulang Form
      </button>
    </div>
  );
}

// ─── Komponen Utama ──────────────────────────────────────────────────────────
export default function HealthForm() {
  const fields = ["nama", "tinggi", "berat", "kelamin", "aktivitas"];

  const [values, setValues] = useState({
    nama: "", tinggi: "", berat: "", kelamin: "", aktivitas: "",
  });
  const [touched, setTouched] = useState({});
  const [result, setResult] = useState(null);

  const errors = {};
  fields.forEach((f) => {
    errors[f] = validate(f, values[f]);
  });
  const allValid = fields.every((f) => !errors[f]);

  const handleChange = (field, val) => {
    setValues((v) => ({ ...v, [field]: val }));
    setTouched((t) => ({ ...t, [field]: true }));
  };

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
  };

  function handleSubmit() {
    const allTouched = {};
    fields.forEach((f) => (allTouched[f] = true));
    setTouched(allTouched);
    if (allValid) setResult({ ...values });
  }

  function handleReset() {
    setValues({ nama: "", tinggi: "", berat: "", kelamin: "", aktivitas: "" });
    setTouched({});
    setResult(null);
  }

  // Conditional rendering: tampilkan hasil atau form
  if (result) {
    return <HasilKalkulasi data={result} onReset={handleReset} />;
  }

  return (
    <div className="form-wrap">
      <div className="form-header">
        <h2 className="form-title">Kalkulator Kesehatan</h2>
        <p className="form-desc">Isi data diri untuk mengetahui BMI & kebutuhan kalori harian</p>
      </div>

      <ProgressBar fields={fields} values={values} touched={touched} errors={errors} />

      {/* Input: Nama */}
      <InputField
        id="nama"
        label="Nama Lengkap"
        placeholder="Masukkan nama lengkap"
        value={values.nama}
        error={errors.nama}
        touched={touched.nama}
        onChange={(e) => handleChange("nama", e.target.value)}
        onBlur={() => handleBlur("nama")}
      />

      {/* Input: Tinggi & Berat (grid 2 kolom) */}
      <div className="form-row">
        <InputField
          id="tinggi"
          label="Tinggi Badan"
          placeholder="170"
          unit="cm"
          value={values.tinggi}
          error={errors.tinggi}
          touched={touched.tinggi}
          onChange={(e) => handleChange("tinggi", e.target.value)}
          onBlur={() => handleBlur("tinggi")}
        />
        <InputField
          id="berat"
          label="Berat Badan"
          placeholder="65"
          unit="kg"
          value={values.berat}
          error={errors.berat}
          touched={touched.berat}
          onChange={(e) => handleChange("berat", e.target.value)}
          onBlur={() => handleBlur("berat")}
        />
      </div>

      {/* Select: Kelamin & Aktivitas (grid 2 kolom) */}
      <div className="form-row">
        <SelectField
          id="kelamin"
          label="Jenis Kelamin"
          placeholder="Pilih jenis kelamin"
          value={values.kelamin}
          error={errors.kelamin}
          touched={touched.kelamin}
          onChange={(e) => handleChange("kelamin", e.target.value)}
          onBlur={() => handleBlur("kelamin")}
          options={[
            { value: "laki", label: "Laki-laki" },
            { value: "perempuan", label: "Perempuan" },
          ]}
        />
        <SelectField
          id="aktivitas"
          label="Tingkat Aktivitas"
          placeholder="Pilih aktivitas"
          value={values.aktivitas}
          error={errors.aktivitas}
          touched={touched.aktivitas}
          onChange={(e) => handleChange("aktivitas", e.target.value)}
          onBlur={() => handleBlur("aktivitas")}
          options={[
            { value: "sedentary",  label: "Tidak aktif (jarang olahraga)" },
            { value: "light",      label: "Ringan (1–3x/minggu)" },
            { value: "moderate",   label: "Sedang (3–5x/minggu)" },
            { value: "active",     label: "Aktif (6–7x/minggu)" },
            { value: "very_active",label: "Sangat aktif (kerja fisik)" },
          ]}
        />
      </div>

      {/* Tombol submit hanya muncul jika semua field valid */}
      {allValid && (
        <button className="btn-submit" onClick={handleSubmit}>
          Hitung Sekarang →
        </button>
      )}
    </div>
  );
}
