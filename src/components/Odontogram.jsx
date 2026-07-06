import { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from './Button'
import SelectField from './SelectField'
import TextArea from './TextArea'
import Spinner from './Spinner'
import { odontogramAPI } from '../services/supabaseAPI'

// Notasi FDI: kuadran 1-4, tiap kuadran gigi nomor 1-8 dari tengah ke belakang.
// Q1 kanan-atas 18..11, Q2 kiri-atas 21..28, Q4 kanan-bawah 48..41, Q3 kiri-bawah 31..38.
const ATAS_KANAN  = [18, 17, 16, 15, 14, 13, 12, 11]
const ATAS_KIRI    = [21, 22, 23, 24, 25, 26, 27, 28]
const BAWAH_KANAN = [48, 47, 46, 45, 44, 43, 42, 41]
const BAWAH_KIRI   = [31, 32, 33, 34, 35, 36, 37, 38]

const KONDISI_OPTIONS = ['Sehat', 'Berlubang', 'Ditambal', 'Dicabut', 'Perlu Perawatan', 'Perawatan Akar', 'Gigi Palsu']

const KONDISI_WARNA = {
  'Sehat':            'bg-white border-garis text-teks-samping',
  'Berlubang':        'bg-merah-muda border-merah text-merah',
  'Ditambal':         'bg-biru-muda border-biru text-biru',
  'Dicabut':          'bg-gray-200 border-gray-400 text-gray-500 line-through',
  'Perlu Perawatan':  'bg-kuning-muda border-kuning text-kuning',
  'Perawatan Akar':   'bg-ungu-muda border-ungu text-ungu',
  'Gigi Palsu':       'bg-hijau-muda border-hijau text-hijau',
}

function Tooth({ nomor, data, onClick }) {
  const kondisi = data?.kondisi || 'Sehat'
  return (
    <button onClick={() => onClick(nomor)} title={`Gigi ${nomor}${data ? ` · ${kondisi}` : ''}`}
      className={`w-9 h-9 rounded-lg border-2 text-[11px] font-bold flex items-center justify-center transition-transform hover:scale-110 ${KONDISI_WARNA[kondisi]}`}>
      {nomor}
    </button>
  )
}

export default function Odontogram({ pasienId }) {
  const [data, setData]       = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm]       = useState({ kondisi: 'Sehat', tindakan: '', catatan: '' })

  useEffect(() => {
    odontogramAPI.fetchByPasien(pasienId)
      .then(rows => setData(Object.fromEntries(rows.map(r => [r.nomor_gigi, r]))))
      .catch(() => { /* gagal memuat odontogram, biarkan kosong */ })
      .finally(() => setLoading(false))
  }, [pasienId])

  const handleOpenTooth = nomor => {
    const existing = data[nomor]
    setForm({ kondisi: existing?.kondisi || 'Sehat', tindakan: existing?.tindakan || '', catatan: existing?.catatan || '' })
    setSelected(nomor)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await odontogramAPI.upsert(pasienId, selected, form)
      setData(prev => ({ ...prev, [selected]: updated }))
      setSelected(null)
    } catch { /* gagal simpan, biarkan modal terbuka supaya user bisa coba lagi */ }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center gap-3 py-10">
      <Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat odontogram...</span>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col items-center gap-2 py-2 overflow-x-auto">
        <div className="flex gap-1">
          {ATAS_KANAN.map(n => <Tooth key={n} nomor={n} data={data[n]} onClick={handleOpenTooth}/>)}
          <div className="w-2"/>
          {ATAS_KIRI.map(n => <Tooth key={n} nomor={n} data={data[n]} onClick={handleOpenTooth}/>)}
        </div>
        <div className="w-full border-t border-dashed border-garis my-1"/>
        <div className="flex gap-1">
          {BAWAH_KANAN.map(n => <Tooth key={n} nomor={n} data={data[n]} onClick={handleOpenTooth}/>)}
          <div className="w-2"/>
          {BAWAH_KIRI.map(n => <Tooth key={n} nomor={n} data={data[n]} onClick={handleOpenTooth}/>)}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-4 pt-4 border-t border-garis">
        {Object.entries(KONDISI_WARNA).map(([label, cls]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-teks-samping">
            <span className={`w-3 h-3 rounded border-2 ${cls.split(' ').slice(0,2).join(' ')}`}/>
            {label}
          </div>
        ))}
      </div>

      <Modal isOpen={selected !== null} onClose={() => setSelected(null)} title={`Gigi ${selected} (FDI)`}
        footer={<div className="flex gap-3">
          <Button type="outline" fullWidth onClick={() => setSelected(null)}>Batal</Button>
          <Button type="primary" fullWidth onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
        </div>}>
        <div className="space-y-4">
          <SelectField label="Kondisi" name="kondisi" value={form.kondisi}
            onChange={e => setForm({ ...form, kondisi: e.target.value })}
            options={KONDISI_OPTIONS} placeholder=""/>
          <TextArea label="Tindakan" name="tindakan" value={form.tindakan}
            onChange={e => setForm({ ...form, tindakan: e.target.value })} rows={2}
            placeholder="misal: tambal komposit, scaling, dll (opsional)"/>
          <TextArea label="Catatan" name="catatan" value={form.catatan}
            onChange={e => setForm({ ...form, catatan: e.target.value })} rows={2}
            placeholder="Catatan tambahan (opsional)"/>
        </div>
      </Modal>
    </div>
  )
}
