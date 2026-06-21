import { useState } from "react";
import wisataData from "./wisata.json";

const formatRupiah = (n) =>
  n === 0 ? "Gratis" : "Rp " + n.toLocaleString("id-ID");

const TAG_COLORS = {
  Pantai:      "#0ea5e9",
  Gunung:      "#22c55e",
  Candi:       "#f59e0b",
  Kepulauan:   "#3b82f6",
  Budaya:      "#a855f7",
  Sejarah:     "#f97316",
  Diving:      "#06b6d4",
  Snorkeling:  "#14b8a6",
  Alam:        "#84cc16",
  Petualangan: "#ef4444",
  Fotografi:   "#ec4899",
  Surfing:     "#6366f1",
  default:     "#94a3b8",
};
const tagColor = (t) => TAG_COLORS[t] || TAG_COLORS.default;

// ─────────────────────────────────────────
// Star Rating
function Stars({ rating }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            fontSize: 11,
            color: i <= Math.round(rating) ? "#f59e0b" : "#334155",
          }}
        >
          ★
        </span>
      ))}
      <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4, fontWeight: 600 }}>
        {rating}
      </span>
    </span>
  );
}

// ─────────────────────────────────────────
// Chip helper
function Chip({ label, color, onRemove }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 999,
        color,
        background: `${color}18`,
        border: `1px solid ${color}44`,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          color,
          cursor: "pointer",
          fontSize: 12,
          lineHeight: 1,
          padding: 0,
          fontFamily: "inherit",
        }}
      >
        ✕
      </button>
    </span>
  );
}

// ─────────────────────────────────────────
// GUEST — Single Card
function GuestCard({ item, delay = 0 }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="animate-fadeup"
      style={{
        animationDelay: `${delay}ms`,
        borderRadius: 20,
        overflow: "hidden",
        background: "#111827",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.3s, transform 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 24px 60px rgba(0,0,0,0.7)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.5)";
      }}
    >
      {/* Image */}
      <div
        className="card-wrap"
        style={{ position: "relative", height: 220, overflow: "hidden" }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="card-img"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400/1e293b/475569?text=${encodeURIComponent(item.name)}`;
          }}
        />
        {/* Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.3) 55%, transparent 100%)",
          }}
        />
        {/* Type badge */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 999,
            padding: "4px 12px",
            fontSize: 10,
            fontWeight: 800,
            color: "#e2e8f0",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {item.details.type}
        </div>
        {/* Rating */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "#f59e0b",
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 12,
            fontWeight: 900,
            color: "#0a1628",
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          ★ {item.details.rating}
        </div>
        {/* Name over image bottom */}
        <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
          <p
            className="font-display"
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.2,
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            }}
          >
            {item.name}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#94a3b8",
              marginTop: 3,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ color: "#f59e0b" }}>📍</span>
            {item.location.city}, {item.location.province}
          </p>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "16px 18px 18px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65 }}>
          {item.description.length > 110
            ? item.description.slice(0, 110) + "…"
            : item.description}
        </p>

        {/* Fee + Hours */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: item.details.entryFee === 0 ? "#34d399" : "#f59e0b",
              background:
                item.details.entryFee === 0
                  ? "rgba(52,211,153,0.1)"
                  : "rgba(245,158,11,0.1)",
              borderRadius: 999,
              padding: "4px 12px",
            }}
          >
            🎫 {formatRupiah(item.details.entryFee)}
          </span>
          <span style={{ fontSize: 11, color: "#64748b" }}>
            🕐 {item.details.openHours}
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {item.tags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: 9,
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: 999,
                border: `1px solid ${tagColor(tag)}44`,
                color: tagColor(tag),
                background: `${tagColor(tag)}18`,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Expand button */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            marginTop: "auto",
            background: "transparent",
            border: "1px solid #1e3a5f",
            borderRadius: 10,
            padding: "9px 0",
            color: "#60a5fa",
            fontSize: 11,
            fontWeight: 800,
            cursor: "pointer",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1e3a5f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {open ? "▲ Sembunyikan" : "▼ Lihat Detail"}
        </button>

        {/* Expanded detail */}
        {open && (
          <div
            style={{
              borderTop: "1px solid #1e293b",
              paddingTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <a
              href={item.contact.website}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 12,
                color: "#60a5fa",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              🌐 {item.contact.website.replace("https://", "")}
            </a>
            <p style={{ fontSize: 12, color: "#64748b" }}>
              📞 {item.contact.phone}
            </p>
            <div>
              <p
                style={{
                  fontSize: 10,
                  color: "#334155",
                  fontWeight: 800,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Fasilitas
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {item.facilities.map((f, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 10,
                      color: "#94a3b8",
                      background: "#1e293b",
                      borderRadius: 6,
                      padding: "3px 8px",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#334155" }}>
              🗺️ {item.location.coordinates.lat}, {item.location.coordinates.lng}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// GUEST VIEW
function GuestView({ data }) {
  if (!data.length)
    return (
      <div
        style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}
      >
        <p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p>
        <p
          style={{ fontSize: 18, fontWeight: 700, color: "#475569" }}
        >
          Tidak ada destinasi ditemukan
        </p>
        <p style={{ fontSize: 13, marginTop: 6, color: "#334155" }}>
          Coba ubah keyword atau filter
        </p>
      </div>
    );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 24,
      }}
    >
      {data.map((item, i) => (
        <GuestCard key={item.id} item={item} delay={i * 55} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// ADMIN VIEW — Table
function AdminView({ data }) {
  const TH = { padding: "14px 16px", fontWeight: 800, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#475569", background: "#0a1628", whiteSpace: "nowrap", borderBottom: "1px solid #1e3a5f" };
  const TD = (extra = {}) => ({ padding: "13px 16px", fontSize: 13, color: "#cbd5e1", verticalAlign: "middle", borderBottom: "1px solid #0f1f35", ...extra });

  if (!data.length)
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#334155" }}>
        <p style={{ fontSize: 36, marginBottom: 10 }}>📭</p>
        <p style={{ fontWeight: 700 }}>Tidak ada data</p>
      </div>
    );

  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: 16,
        border: "1px solid #1e3a5f",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#0d1b2e" }}>
        <thead>
          <tr>
            {["#","Foto","Nama & Deskripsi","Lokasi","Tipe","Tiket","Rating","Jam Buka","Kontak","Tags","Status"].map(
              (h, i) => <th key={i} style={TH}>{h}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={item.id}
              style={{
                background: idx % 2 === 0 ? "#0d1b2e" : "#0a1628",
                transition: "background 0.15s",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1e3a5f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "#0d1b2e" : "#0a1628")}
            >
              <td style={TD({ color: "#334155", fontWeight: 800 })}>{idx + 1}</td>
              <td style={TD()}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 64, height: 46, objectFit: "cover", borderRadius: 8, display: "block" }}
                  onError={(e) => { e.target.src = `https://placehold.co/64x46/1e293b/475569?text=${item.id}`; }}
                />
              </td>
              <td style={TD({ maxWidth: 240 })}>
                <p className="font-display" style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 14 }}>{item.name}</p>
                <p style={{ fontSize: 11, color: "#334155", marginTop: 3, lineHeight: 1.5 }}>{item.description.slice(0, 80)}…</p>
              </td>
              <td style={TD()}>
                <p style={{ fontWeight: 600, color: "#e2e8f0" }}>{item.location.city}</p>
                <p style={{ fontSize: 11, color: "#475569" }}>{item.location.province}</p>
              </td>
              <td style={TD()}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "#1e3a5f", color: "#60a5fa" }}>
                  {item.details.type}
                </span>
              </td>
              <td style={TD()}>
                <span style={{ fontWeight: 700, color: item.details.entryFee === 0 ? "#34d399" : "#f59e0b", fontSize: 12 }}>
                  {formatRupiah(item.details.entryFee)}
                </span>
              </td>
              <td style={TD()}><Stars rating={item.details.rating} /></td>
              <td style={TD({ fontSize: 11, color: "#475569", whiteSpace: "nowrap" })}>{item.details.openHours}</td>
              <td style={TD()}>
                <p style={{ fontSize: 11, color: "#475569" }}>{item.contact.phone}</p>
                <a href={item.contact.website} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#60a5fa", textDecoration: "none" }}>Website ↗</a>
              </td>
              <td style={TD()}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {item.tags.map((tag, i) => (
                    <span key={i} style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 999, color: tagColor(tag), background: `${tagColor(tag)}18`, border: `1px solid ${tagColor(tag)}33`, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td style={TD()}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: item.status === "active" ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)", color: item.status === "active" ? "#34d399" : "#f87171", border: `1px solid ${item.status === "active" ? "#34d39944" : "#f8717144"}` }}>
                  {item.status === "active" ? "✓ Aktif" : "✗ Off"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ background: "#0a1628", borderTop: "1px solid #1e3a5f", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#334155" }}>
        <span>Total: <strong style={{ color: "#60a5fa" }}>{data.length}</strong> destinasi</span>
        <span>Admin Panel — Wisata Nusantara</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// STATS
function Stats({ data }) {
  const totalGratis = data.filter((d) => d.details.entryFee === 0).length;
  const avgRating   = data.length ? (data.reduce((s, d) => s + d.details.rating, 0) / data.length).toFixed(1) : "—";
  const types       = [...new Set(data.map((d) => d.details.type))].length;

  const cards = [
    { icon: "🗺️", label: "Total Destinasi",  value: data.length, accent: "#60a5fa" },
    { icon: "⭐", label: "Avg Rating",        value: avgRating,   accent: "#f59e0b" },
    { icon: "🎫", label: "Gratis Masuk",      value: totalGratis, accent: "#34d399" },
    { icon: "🏷️", label: "Jenis Destinasi",  value: types,       accent: "#a78bfa" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 16,
        marginBottom: 28,
      }}
    >
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            background: "#0d1b2e",
            border: `1px solid ${c.accent}28`,
            borderRadius: 16,
            padding: "20px 22px",
            transition: "box-shadow 0.3s",
            cursor: "default",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 24px ${c.accent}28`)}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          <p style={{ fontSize: 26, marginBottom: 6 }}>{c.icon}</p>
          <p
            className="font-display"
            style={{ fontSize: 34, fontWeight: 900, color: c.accent, lineHeight: 1 }}
          >
            {c.value}
          </p>
          <p
            style={{
              fontSize: 10,
              color: "#334155",
              marginTop: 4,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {c.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// RESPONSIVE DEMO
function ResponsiveDemo() {
  return (
    <div
      style={{
        background: "#0d1b2e",
        border: "1px solid #1e3a5f",
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <p
        className="font-display"
        style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}
      >
        📐 Demo Responsive & Grid Design
      </p>

      {/* Responsive text */}
      <p
        className="text-sm md:text-base lg:text-lg xl:text-xl"
        style={{ color: "#60a5fa", fontWeight: 700, marginBottom: 16 }}
      >
        🔤 Ukuran teks berubah per breakpoint:{" "}
        <code
          style={{
            background: "#1e3a5f",
            padding: "2px 8px",
            borderRadius: 6,
            fontSize: 11,
            fontFamily: "monospace",
          }}
        >
          text-sm → md:base → lg:lg → xl:xl
        </code>
      </p>

      {/* 2 col flex */}
      <div className="flex flex-col md:flex-row" style={{ gap: 12, marginBottom: 12 }}>
        {["📱 Mobile: Full Width → 💻 md: 50%", "📱 Mobile: Full Width → 💻 md: 50%"].map((t, i) => (
          <div
            key={i}
            className="w-full md:w-1/2"
            style={{
              background: ["#7c3aed", "#0369a1"][i],
              borderRadius: 12,
              padding: "12px 16px",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* 4-col grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        style={{ gap: 10 }}
      >
        {["1 col (default)", "sm: 2 kolom", "md: 3 kolom", "lg: 4 kolom"].map((t, i) => (
          <div
            key={i}
            style={{
              background: ["#1d4ed8", "#0f766e", "#b45309", "#7c3aed"][i],
              borderRadius: 10,
              padding: "10px 0",
              color: "#fff",
              fontSize: 11,
              fontWeight: 800,
              textAlign: "center",
              letterSpacing: "0.05em",
            }}
          >
            {t}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#1e3a5f", marginTop: 10, textAlign: "center" }}>
        Coba zoom in/out untuk melihat perubahan grid
      </p>
    </div>
  );
}

// ─────────────────────────────────────────
// ROOT COMPONENT
export default function WisataApp() {
  const [view, setView]         = useState("guest");
  const [showDemo, setShowDemo] = useState(false);

  // Best practice state — satu object
  const [dataForm, setDataForm] = useState({
    searchTerm:     "",
    filterType:     "",
    filterProvince: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const allTypes     = [...new Set(wisataData.map((d) => d.details.type))].sort();
  const allProvinces = [...new Set(wisataData.map((d) => d.location.province))].sort();

  const _search  = dataForm.searchTerm.toLowerCase();
  const filtered = wisataData.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(_search) ||
      item.description.toLowerCase().includes(_search) ||
      item.location.city.toLowerCase().includes(_search) ||
      item.location.province.toLowerCase().includes(_search);
    const matchType     = dataForm.filterType     ? item.details.type       === dataForm.filterType     : true;
    const matchProvince = dataForm.filterProvince ? item.location.province   === dataForm.filterProvince : true;
    return matchSearch && matchType && matchProvince;
  });

  const hasFilter = dataForm.searchTerm || dataForm.filterType || dataForm.filterProvince;

  const inputStyle = {
    width: "100%",
    padding: "11px 16px",
    background: "#0a1628",
    border: "1px solid #1e3a5f",
    borderRadius: 12,
    color: "#e2e8f0",
    fontSize: 13,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1628",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* ── HERO ──────────────────────────────── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0a1628 0%, #0d2845 55%, #0a1628 100%)",
          padding: "60px 0 50px",
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            {/* Title block */}
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#f59e0b",
                  marginBottom: 10,
                }}
              >
                ✦ Pertemuan 4 · React + Tailwind CSS
              </p>
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(32px, 5vw, 58px)",
                  fontWeight: 900,
                  color: "#f8fafc",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Wisata{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Nusantara
                </span>
              </h1>
              <p
                style={{
                  color: "#475569",
                  fontSize: 14,
                  marginTop: 10,
                  maxWidth: 480,
                  lineHeight: 1.65,
                }}
              >
                Jelajahi 20 destinasi wisata terbaik Indonesia — dari pantai
                tropis hingga puncak gunung berapi yang memukau.
              </p>
            </div>

            {/* View toggle */}
            <div
              style={{
                display: "flex",
                background: "#0d1b2e",
                border: "1px solid #1e3a5f",
                borderRadius: 14,
                padding: 4,
                gap: 4,
                alignSelf: "flex-start",
              }}
            >
              {[
                { key: "guest", icon: "🃏", label: "Guest" },
                { key: "admin", icon: "🗂️", label: "Admin" },
              ].map((v) => (
                <button
                  key={v.key}
                  onClick={() => setView(v.key)}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: "all 0.2s",
                    background: view === v.key ? "#1d4ed8" : "transparent",
                    color: view === v.key ? "#fff" : "#334155",
                    boxShadow:
                      view === v.key
                        ? "0 4px 18px rgba(29,78,216,0.45)"
                        : "none",
                  }}
                >
                  {v.icon} {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────── */}
      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}
      >
        {/* Stats */}
        <Stats data={filtered} />

        {/* Responsive demo toggle */}
        <button
          onClick={() => setShowDemo(!showDemo)}
          style={{
            marginBottom: 20,
            background: "transparent",
            border: "1px solid #1e293b",
            borderRadius: 10,
            padding: "8px 18px",
            color: "#334155",
            fontSize: 11,
            fontWeight: 800,
            cursor: "pointer",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "inherit",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#1e3a5f";
            e.currentTarget.style.color = "#64748b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#1e293b";
            e.currentTarget.style.color = "#334155";
          }}
        >
          {showDemo ? "▲" : "▼"} Demo Responsive Design
        </button>
        {showDemo && <ResponsiveDemo />}

        {/* ── Search & Filter ─────────────────── */}
        <div
          style={{
            background: "#0d1b2e",
            border: "1px solid #1e3a5f",
            borderRadius: 20,
            padding: 24,
            marginBottom: 28,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#1e3a5f",
              marginBottom: 16,
            }}
          >
            🔎 Pencarian & Filter
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {/* Search */}
            <input
              type="text"
              name="searchTerm"
              value={dataForm.searchTerm}
              onChange={handleChange}
              placeholder="Cari nama, kota, provinsi…"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#1e3a5f")}
            />

            {/* Filter 1: Tipe */}
            <select
              name="filterType"
              value={dataForm.filterType}
              onChange={handleChange}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={(e) => (e.target.style.borderColor = "#a855f7")}
              onBlur={(e) => (e.target.style.borderColor = "#1e3a5f")}
            >
              <option value="">Semua Tipe Destinasi</option>
              {allTypes.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>

            {/* Filter 2: Provinsi */}
            <select
              name="filterProvince"
              value={dataForm.filterProvince}
              onChange={handleChange}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
              onBlur={(e) => (e.target.style.borderColor = "#1e3a5f")}
            >
              <option value="">Semua Provinsi</option>
              {allProvinces.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Result count + active chips */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 12, color: "#334155" }}>
              <strong style={{ color: "#60a5fa" }}>{filtered.length}</strong>
              <span style={{ color: "#1e3a5f" }}> / {wisataData.length} destinasi</span>
            </span>
            {hasFilter && (
              <>
                {dataForm.searchTerm && (
                  <Chip
                    label={`"${dataForm.searchTerm}"`}
                    color="#3b82f6"
                    onRemove={() => setDataForm({ ...dataForm, searchTerm: "" })}
                  />
                )}
                {dataForm.filterType && (
                  <Chip
                    label={dataForm.filterType}
                    color="#a855f7"
                    onRemove={() => setDataForm({ ...dataForm, filterType: "" })}
                  />
                )}
                {dataForm.filterProvince && (
                  <Chip
                    label={dataForm.filterProvince}
                    color="#f59e0b"
                    onRemove={() => setDataForm({ ...dataForm, filterProvince: "" })}
                  />
                )}
                <button
                  onClick={() =>
                    setDataForm({ searchTerm: "", filterType: "", filterProvince: "" })
                  }
                  style={{
                    fontSize: 11,
                    color: "#ef4444",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 700,
                  }}
                >
                  Reset semua
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── View label ──────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: view === "guest" ? "#60a5fa" : "#f59e0b",
              background:
                view === "guest"
                  ? "rgba(96,165,250,0.08)"
                  : "rgba(245,158,11,0.08)",
              border: `1px solid ${view === "guest" ? "#3b82f622" : "#f59e0b22"}`,
              borderRadius: 999,
              padding: "6px 16px",
              whiteSpace: "nowrap",
            }}
          >
            {view === "guest" ? "🃏 Guest — Card Grid" : "🗂️ Admin — Data Table"}
          </span>
          <div
            style={{ flex: 1, height: 1, background: "#0f1f35" }}
          />
        </div>

        {/* ── Content ─────────────────────────── */}
        {view === "guest" ? (
          <GuestView data={filtered} />
        ) : (
          <AdminView data={filtered} />
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #0f1f35",
          padding: "28px 24px",
          textAlign: "center",
          fontSize: 10,
          color: "#1e3a5f",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        🌴 Wisata Nusantara · Pertemuan 4 · React + Tailwind CSS · Data JSON · Search & Filter · Responsive Grid
      </div>
    </div>
  );
}
