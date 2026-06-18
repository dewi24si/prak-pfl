import axios from 'axios'

const BASE_URL = 'https://llgekpimncxzwrdsmics.supabase.co/rest/v1'
const API_KEY  = 'sb_publishable_2pwdotHDvSMDG0N3jzOxvA_T5os18GG'

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export const usersAPI = {
  async fetchAll() {
    const res = await axios.get(`${BASE_URL}/users`, {
      headers,
      params: { select: '*', order: 'id.desc' },
    })
    return res.data
  },

  async login(email, password) {
    const res = await axios.get(`${BASE_URL}/users`, {
      headers,
      params: { email: `eq.${email}`, password: `eq.${password}`, select: '*' },
    })
    if (res.data.length === 0) throw new Error('Email atau password salah')
    return res.data[0]
  },

  async register(data) {
    const res = await axios.post(`${BASE_URL}/users`, data, { headers })
    return res.data[0]
  },

  async checkEmail(email) {
    const res = await axios.get(`${BASE_URL}/users`, {
      headers,
      params: { email: `eq.${email}`, select: 'id' },
    })
    return res.data.length > 0
  },

  async update(id, data) {
    const res = await axios.patch(`${BASE_URL}/users`, data, {
      headers,
      params: { id: `eq.${id}` },
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
