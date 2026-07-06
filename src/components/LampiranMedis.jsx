import { useState, useEffect, useRef } from 'react'
import Button from './Button'
import SelectField from './SelectField'
import Spinner from './Spinner'
import Alert from './Alert'
import { MdUploadFile, MdDelete, MdImage, MdInsertDriveFile, MdOpenInNew } from 'react-icons/md'
import { lampiranAPI } from '../services/supabaseAPI'

const JENIS_OPTIONS = ['Rontgen', 'Foto', 'Lainnya']
const isImage = url => /\.(png|jpe?g|gif|webp)$/i.test(url)

export default function LampiranMedis({ pasienId }) {
  const [files, setFiles]     = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [jenis, setJenis]     = useState('Rontgen')
  const [error, setError]     = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    lampiranAPI.fetchByPasien(pasienId)
      .then(setFiles)
      .catch(() => setError('Gagal memuat lampiran'))
      .finally(() => setLoading(false))
  }, [pasienId])

  const handleUpload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError('')
    try {
      const saved = await lampiranAPI.upload(pasienId, file, { jenis })
      setFiles(prev => [saved, ...prev])
    } catch (err) {
      setError('Gagal mengunggah file: ' + err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async f => {
    if (!confirm(`Hapus file "${f.nama_file}"?`)) return
    try {
      await lampiranAPI.delete(f.id, f.url)
      setFiles(prev => prev.filter(x => x.id !== f.id))
    } catch (err) {
      setError('Gagal menghapus file: ' + err.message)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center gap-3 py-10">
      <Spinner size="sm" color="biru"/><span className="text-sm text-teks-samping">Memuat lampiran...</span>
    </div>
  )

  return (
    <div>
      {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')}/></div>}

      <div className="flex items-end gap-3 mb-4">
        <SelectField label="Jenis File" name="jenis" value={jenis} onChange={e => setJenis(e.target.value)} options={JENIS_OPTIONS} placeholder=""/>
        <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleUpload}/>
        <Button type="outline" icon={<MdUploadFile/>} onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Mengunggah...' : 'Unggah File'}
        </Button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-8 text-teks-samping text-sm">Belum ada rontgen/foto yang diunggah.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {files.map(f => (
            <div key={f.id} className="border border-garis rounded-xl overflow-hidden group relative">
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="block">
                {isImage(f.url) ? (
                  <img src={f.url} alt={f.nama_file} className="w-full h-24 object-cover bg-latar"/>
                ) : (
                  <div className="w-full h-24 flex items-center justify-center bg-latar">
                    <MdInsertDriveFile className="text-3xl text-teks-samping"/>
                  </div>
                )}
              </a>
              <div className="p-2">
                <p className="text-xs font-semibold text-teks truncate" title={f.nama_file}>{f.nama_file}</p>
                <p className="text-[10px] text-teks-samping flex items-center gap-1"><MdImage className="text-[11px]"/>{f.jenis}</p>
              </div>
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded-md bg-white/90 hover:bg-biru-muda text-teks-samping hover:text-biru shadow"><MdOpenInNew className="text-sm"/></a>
                <button onClick={() => handleDelete(f)} className="p-1 rounded-md bg-white/90 hover:bg-merah-muda text-teks-samping hover:text-merah shadow"><MdDelete className="text-sm"/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
