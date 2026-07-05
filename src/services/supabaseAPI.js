import axios from 'axios'

const BASE_URL = 'https://llgekpimncxzwrdsmics.supabase.co/rest/v1'
const API_KEY  = 'sb_publishable_2pwdotHDvSMDG0N3jzOxvA_T5os18GG'

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

// Kolom password tidak pernah dikirim ke/dari client dalam bentuk asli:
// di-hash dulu di browser, dan baris users selalu diminta kembali tanpa
// kolom password (lihat safeSelect di bawah). Verifikasi login dilakukan
// lewat RPC login_user() di database, bukan query tabel langsung, supaya
// anon key tidak butuh (dan memang tidak diberi) akses baca ke kolom itu.
const safeSelect = 'id,email,role,created_at'

async function hashPassword(plain) {
  const bytes = new TextEncoder().encode(plain)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export const usersAPI = {
  async fetchAll() {
    const res = await axios.get(`${BASE_URL}/users`, {
      headers,
      params: { select: safeSelect, order: 'id.desc' },
    })
    return res.data
  },

  async login(email, password) {
    const passwordHash = await hashPassword(password)
    const res = await axios.post(`${BASE_URL}/rpc/login_user`,
      { p_email: email, p_password_hash: passwordHash },
      { headers },
    )
    if (res.data.length === 0) throw new Error('Email atau password salah')
    return res.data[0]
  },

  async register(data) {
    const payload = { ...data, password: await hashPassword(data.password) }
    const res = await axios.post(`${BASE_URL}/users`, payload, {
      headers, params: { select: safeSelect },
    })
    return res.data[0]
  },

  async checkEmail(email) {
    const res = await axios.get(`${BASE_URL}/users`, {
      headers,
      params: { email: `eq.${email}`, select: 'id' },
    })
    return res.data.length > 0
  },

  async findByEmail(email) {
    const res = await axios.get(`${BASE_URL}/users`, {
      headers,
      params: { email: `eq.${email}`, select: safeSelect },
    })
    return res.data[0] || null
  },

  async update(id, data) {
    const payload = data.password ? { ...data, password: await hashPassword(data.password) } : data
    const res = await axios.patch(`${BASE_URL}/users`, payload, {
      headers, params: { id: `eq.${id}`, select: safeSelect },
    })
    return res.data[0]
  },

  async delete(id) {
    await axios.delete(`${BASE_URL}/users`, {
      headers,
      params: { id: `eq.${id}` },
    })
  },
}

// ─── PASIEN ───────────────────────────────────────────────────────────────────

export const pasienAPI = {
  async fetchAll() {
    const res = await axios.get(`${BASE_URL}/pasien`, {
      headers,
      params: { select: '*', order: 'id.desc' },
    })
    return res.data
  },

  async fetchById(id) {
    const res = await axios.get(`${BASE_URL}/pasien`, {
      headers,
      params: { id: `eq.${id}`, select: '*' },
    })
    if (res.data.length === 0) throw new Error('Pasien tidak ditemukan')
    return res.data[0]
  },

  async findByUserId(user_id) {
    const res = await axios.get(`${BASE_URL}/pasien`, {
      headers,
      params: { user_id: `eq.${user_id}`, select: '*' },
    })
    return res.data[0] || null
  },

  async create(data) {
    const res = await axios.post(`${BASE_URL}/pasien`, data, { headers })
    return res.data[0]
  },

  async update(id, data) {
    const res = await axios.patch(`${BASE_URL}/pasien`, data, {
      headers,
      params: { id: `eq.${id}` },
    })
    return res.data[0]
  },

  async delete(id) {
    await axios.delete(`${BASE_URL}/pasien`, {
      headers,
      params: { id: `eq.${id}` },
    })
  },
}

// ─── JADWAL ───────────────────────────────────────────────────────────────────

export const jadwalAPI = {
  async fetchAll() {
    const res = await axios.get(`${BASE_URL}/jadwal`, {
      headers, params: { select: '*', order: 'tanggal.desc,jam.desc' },
    })
    return res.data
  },
  async fetchByPasien(pasien_id) {
    const res = await axios.get(`${BASE_URL}/jadwal`, {
      headers, params: { pasien_id: `eq.${pasien_id}`, select: '*', order: 'tanggal.desc,jam.desc' },
    })
    return res.data
  },
  async fetchByDokterTanggal(dokter, tanggal) {
    const res = await axios.get(`${BASE_URL}/jadwal`, {
      headers, params: { dokter: `eq.${dokter}`, tanggal: `eq.${tanggal}`, select: '*' },
    })
    return res.data
  },
  async create(data) {
    const res = await axios.post(`${BASE_URL}/jadwal`, data, { headers })
    return res.data[0]
  },
  async update(id, data) {
    const res = await axios.patch(`${BASE_URL}/jadwal`, data, {
      headers, params: { id: `eq.${id}` },
    })
    return res.data[0]
  },
  async delete(id) {
    await axios.delete(`${BASE_URL}/jadwal`, { headers, params: { id: `eq.${id}` } })
  },
}

// ─── PEMBAYARAN ───────────────────────────────────────────────────────────────

export const pembayaranAPI = {
  async fetchAll() {
    const res = await axios.get(`${BASE_URL}/pembayaran`, {
      headers, params: { select: '*', order: 'tanggal.desc' },
    })
    return res.data
  },
  async fetchByPasien(pasien_id) {
    const res = await axios.get(`${BASE_URL}/pembayaran`, {
      headers, params: { pasien_id: `eq.${pasien_id}`, select: '*', order: 'tanggal.desc' },
    })
    return res.data
  },
  async fetchByJadwal(jadwal_id) {
    const res = await axios.get(`${BASE_URL}/pembayaran`, {
      headers, params: { jadwal_id: `eq.${jadwal_id}`, select: '*' },
    })
    return res.data
  },
  async create(data) {
    const res = await axios.post(`${BASE_URL}/pembayaran`, data, { headers })
    return res.data[0]
  },
  async update(id, data) {
    const res = await axios.patch(`${BASE_URL}/pembayaran`, data, {
      headers, params: { id: `eq.${id}` },
    })
    return res.data[0]
  },
  async delete(id) {
    await axios.delete(`${BASE_URL}/pembayaran`, { headers, params: { id: `eq.${id}` } })
  },
}

// ─── RIWAYAT ──────────────────────────────────────────────────────────────────

export const riwayatAPI = {
  async fetchAll() {
    const res = await axios.get(`${BASE_URL}/riwayat`, {
      headers, params: { select: '*', order: 'tanggal.desc' },
    })
    return res.data
  },
  async fetchByPasien(pasien_id) {
    const res = await axios.get(`${BASE_URL}/riwayat`, {
      headers, params: { pasien_id: `eq.${pasien_id}`, select: '*', order: 'tanggal.desc' },
    })
    return res.data
  },
  async create(data) {
    const res = await axios.post(`${BASE_URL}/riwayat`, data, { headers })
    return res.data[0]
  },
  async update(id, data) {
    const res = await axios.patch(`${BASE_URL}/riwayat`, data, {
      headers, params: { id: `eq.${id}` },
    })
    return res.data[0]
  },
  async delete(id) {
    await axios.delete(`${BASE_URL}/riwayat`, { headers, params: { id: `eq.${id}` } })
  },
}
