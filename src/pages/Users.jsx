import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Modal from '../components/Modal'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import Table from '../components/Table'
import Alert from '../components/Alert'
import Spinner from '../components/Spinner'
import Avatar from '../components/Avatar'
import { MdPersonAdd, MdEdit, MdDelete } from 'react-icons/md'
import { usersAPI } from '../services/supabaseAPI'
import { useAuth } from '../context/useAuth'

const emptyForm = { email: '', password: '', role: 'user' }

export default function Users() {
  const { user: currentUser } = useAuth()
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]       = useState(null)
  const [form, setForm]           = useState(emptyForm)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const result = await usersAPI.fetchAll()
      setData(result)
    } catch (err) {
      setError(err.message || 'Gagal memuat data users')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleOpenAdd = () => {
    setEditId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const handleOpenEdit = (user) => {
    setEditId(user.id)
    setForm({ email: user.email, password: '', role: user.role })
    setShowModal(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email) return
    if (!editId && !form.password) { setError('Password wajib diisi'); return }

    setLoading(true)
    setError('')
    try {
      if (editId) {
        // Cegah admin gak sengaja menurunkan role akun sendiri yang sedang
        // login - kalau kejadian, dia gak akan bisa reset sendiri (alur Lupa
        // Password menolak reset mandiri untuk role admin) dan bisa kekunci total.
        const role = editId === currentUser.id ? currentUser.role : form.role
        const updateData = { email: form.email, role }
        if (form.password) updateData.password = form.password
        await usersAPI.update(editId, updateData)
        setSuccess('User berhasil diperbarui!')
      } else {
        const exists = await usersAPI.checkEmail(form.email)
        if (exists) { setError('Email sudah terdaftar'); setLoading(false); return }
        await usersAPI.register(form)
        setSuccess('User berhasil ditambahkan!')
      }
      setShowModal(false)
      setForm(emptyForm)
      setEditId(null)
      loadData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Gagal menyimpan: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, email) => {
    if (id === currentUser.id) {
      setError('Tidak bisa menghapus akun sendiri yang sedang login.')
      return
    }
    if (!confirm(`Yakin ingin menghapus user "${email}"?`)) return
    setLoading(true)
    try {
      await usersAPI.delete(id)
      setSuccess('User berhasil dihapus!')
      loadData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Gagal menghapus: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Users" breadcrumb={['Beranda', 'Users']}>
        <Button type="primary" icon={<MdPersonAdd/>} onClick={handleOpenAdd}>
          Tambah User Baru
        </Button>
      </PageHeader>

      {error   && <div className="mb-4"><Alert type="danger"  message={error}   onClose={() => setError('')}/></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')}/></div>}

      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">

        {loading && (
          <div className="flex items-center justify-center gap-3 py-10 text-teks-samping">
            <Spinner size="sm" color="biru"/>
            <span className="text-sm">Memuat data...</span>
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center py-12 text-teks-samping text-sm">
            Belum ada data user.
          </div>
        )}

        {!loading && data.length > 0 && (
          <Table headers={['Avatar', 'Email', 'Role', 'Dibuat', 'Aksi']}>
            {data.map(u => (
              <tr key={u.id} className="hover:bg-latar transition-colors">
                <td className="px-3 py-3.5">
                  <Avatar name={u.email} size="sm"/>
                </td>
                <td className="px-3 py-3.5 font-semibold text-teks">{u.email}</td>
                <td className="px-3 py-3.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-biru-muda text-biru' : 'bg-gray-100 text-gray-500'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-3 py-3.5 text-sm text-teks-samping">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : '-'}
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleOpenEdit(u)}
                      className="p-1.5 rounded-lg hover:bg-biru-muda text-teks-samping hover:text-biru transition-colors">
                      <MdEdit/>
                    </button>
                    <button onClick={() => handleDelete(u.id, u.email)}
                      disabled={u.id === currentUser.id}
                      title={u.id === currentUser.id ? 'Tidak bisa menghapus akun sendiri' : undefined}
                      className="p-1.5 rounded-lg hover:bg-merah-muda text-teks-samping hover:text-merah transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                      <MdDelete/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}

        <div className="flex items-center px-5 py-4 border-t border-garis">
          <p className="text-xs text-teks-samping">Total {data.length} user terdaftar</p>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditId(null) }}
        title={editId ? 'Edit User' : 'Tambah User Baru'}
        footer={
          <div className="flex gap-3">
            <Button type="outline" fullWidth onClick={() => { setShowModal(false); setEditId(null) }}>Batal</Button>
            <Button type="primary" fullWidth onClick={handleSubmit} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        }>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Email" name="email" type="email" value={form.email}
            onChange={handleChange} placeholder="email@klinik.com" required/>
          <InputField label={editId ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
            name="password" type="password" value={form.password}
            onChange={handleChange} placeholder="••••••••"
            hint="Minimal 8 karakter"/>
          <SelectField label="Role" name="role" value={form.role}
            onChange={handleChange} options={['user', 'admin']} placeholder=""
            hint={editId === currentUser.id ? 'Role akun sendiri tidak bisa diubah lewat sini' : undefined}/>
        </form>
      </Modal>
    </div>
  )
}
