import { Router } from 'express'
import pool from '../config/db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, nama_kelas, wali_kelas, jumlah_siswa
       FROM kelas
       WHERE deleted_at IS NULL
       ORDER BY nama_kelas ASC`
    )
    res.json(rows)
  } catch (err) {
    console.error('Get kelas error:', err.message)
    res.status(500).json({ message: 'Gagal mengambil data kelas' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nama_kelas, wali_kelas, jumlah_siswa } = req.body
    const [result] = await pool.execute(
      `INSERT INTO kelas (nama_kelas, wali_kelas, jumlah_siswa)
       VALUES (:nama_kelas, :wali_kelas, :jumlah_siswa)`,
      {
        nama_kelas: String(nama_kelas ?? '').trim(),
        wali_kelas: wali_kelas || null,
        jumlah_siswa: Number(jumlah_siswa) || 0
      }
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) {
    console.error('Create kelas error:', err.message)
    res.status(500).json({ message: 'Gagal menambah kelas' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { nama_kelas, wali_kelas, jumlah_siswa } = req.body
    const [result] = await pool.execute(
      `UPDATE kelas
       SET nama_kelas = :nama_kelas, wali_kelas = :wali_kelas, jumlah_siswa = :jumlah_siswa
       WHERE id = :id AND deleted_at IS NULL`,
      {
        id: Number(req.params.id),
        nama_kelas: String(nama_kelas ?? '').trim(),
        wali_kelas: wali_kelas || null,
        jumlah_siswa: Number(jumlah_siswa) || 0
      }
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }
    res.json({ id: Number(req.params.id), ...req.body })
  } catch (err) {
    console.error('Update kelas error:', err.message)
    res.status(500).json({ message: 'Gagal memperbarui kelas' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      `UPDATE kelas SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id AND deleted_at IS NULL`,
      { id: Number(req.params.id) }
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }
    res.status(204).send()
  } catch (err) {
    console.error('Delete kelas error:', err.message)
    res.status(500).json({ message: 'Gagal menghapus kelas' })
  }
})

export default router
