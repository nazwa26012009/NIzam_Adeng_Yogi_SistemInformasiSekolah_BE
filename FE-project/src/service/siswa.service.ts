import { apiFetch } from './api'

export interface Siswa {
  id: number
  nis: string
  nama: string
  tanggal_lahir?: string
  alamat?: string
  kelas?: string
  foto?: string
}

export interface Kelas {
  id: number
  nama_kelas: string
  wali_kelas?: string
  jumlah_siswa?: number
}

export const getSiswa = (): Promise<Siswa[]> => apiFetch('/siswa')
export const getSiswaById = (id: number): Promise<Siswa> => apiFetch(`/siswa/${id}`)
export const createSiswa = (data: Partial<Siswa>): Promise<Siswa> =>
  apiFetch('/siswa', { method: 'POST', body: JSON.stringify(data) })
export const updateSiswa = (id: number, data: Partial<Siswa>): Promise<Siswa> =>
  apiFetch(`/siswa/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteSiswa = (id: number): Promise<void> =>
  apiFetch(`/siswa/${id}`, { method: 'DELETE' })

export const getKelas = (): Promise<Kelas[]> => apiFetch('/kelas')
export const createKelas = (data: Partial<Kelas>): Promise<Kelas> =>
  apiFetch('/kelas', { method: 'POST', body: JSON.stringify(data) })
export const updateKelas = (id: number, data: Partial<Kelas>): Promise<Kelas> =>
  apiFetch(`/kelas/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteKelas = (id: number): Promise<void> =>
  apiFetch(`/kelas/${id}`, { method: 'DELETE' })

export const login = (
  username: string,
  nis: string,
  password: string
): Promise<{ token: string; username: string }> =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, nis, password })
  })
