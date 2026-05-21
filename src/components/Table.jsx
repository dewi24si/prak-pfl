// Uko UI Kit style Table — clean white, thin borders
export default function Table({ headers = [], children, striped = false }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-garis bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-garis">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-5 py-3.5 text-left text-[11px] font-bold text-teks-samping uppercase tracking-wider whitespace-nowrap bg-latar/60"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={striped ? "[&>tr:nth-child(even)]:bg-latar/40" : "divide-y divide-garis"}>
          {children}
        </tbody>
      </table>
    </div>
  )
}
