export default function PageHeader({ title, breadcrumb, children }) {
  const crumbs = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb]

  return (
    <div id="pageheader-container" className="flex items-center justify-between p-4 border-b border-garis mb-4">
      <div id="pageheader-left" className="flex flex-col">
        <span id="page-title" className="text-3xl font-semibold text-teks">
          {title}
        </span>
        <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center space-x-2">
              {i > 0 && <span className="text-teks-samping">/</span>}
              <span className="text-teks-samping text-sm">{crumb}</span>
            </span>
          ))}
        </div>
      </div>
      <div id="action-button">
        {children}
      </div>
    </div>
  )
}
