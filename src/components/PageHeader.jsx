export default function PageHeader({ title, breadcrumb, children }) {
  const crumbs = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb]
  return (
    <div id="pageheader-container" className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-teks">{title}</h1>
        <nav className="flex items-center gap-1.5 mt-1">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-teks-samping text-xs">•</span>}
              <span className={`text-xs font-semibold ${i === crumbs.length - 1 ? 'text-biru' : 'text-teks-samping'}`}>{crumb}</span>
            </span>
          ))}
        </nav>
      </div>
      {children}
    </div>
  )
}
