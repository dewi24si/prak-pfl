// Escape nilai untuk CSV: bungkus dengan tanda kutip kalau mengandung koma,
// kutip, atau baris baru, dan gandakan tanda kutip di dalamnya.
function escapeCSV(value) {
  const str = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

// Membuat & mengunduh file CSV dari header + baris data, tanpa dependency
// tambahan apa pun (pakai Blob + anchor download bawaan browser).
export function exportToCSV(filename, headers, rows) {
  const lines = [headers, ...rows].map(row => row.map(escapeCSV).join(','))
  const csvContent = '﻿' + lines.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
