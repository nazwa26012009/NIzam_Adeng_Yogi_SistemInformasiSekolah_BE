import { Router } from 'express'
import pool from '../config/db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, nis, nama, tanggal_lahir, alamat, kelas, foto
       FROM siswa
       WHERE deleted_at IS NULL
       ORDER BY nama ASC`
    )
    res.json(rows)
  } catch (err) {
    console.error('Get siswa error:', err.message)
    res.status(500).json({ message: 'Gagal mengambil data siswa' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, nis, nama, tanggal_lahir, alamat, kelas, foto
       FROM siswa
       WHERE id = :id AND deleted_at IS NULL
       LIMIT 1`,
      { id: Number(req.params.id) }
    )
    if (!rows.length) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error('Get siswa by id error:', err.message)
    res.status(500).json({ message: 'Gagal mengambil data siswa' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nis, nama, tanggal_lahir, alamat, kelas, foto } = req.body
    const [result] = await pool.execute(
      `INSERT INTO siswa (nis, nama, tanggal_lahir, alamat, kelas, foto)
       VALUES (:nis, :nama, :tanggal_lahir, :alamat, :kelas, :foto)`,
      {
        nis: String(nis ?? '').trim(),
        nama: String(nama ?? '').trim(),
        tanggal_lahir: tanggal_lahir || null,
        alamat: alamat || null,
        kelas: kelas || null,
        foto: foto || null
      }
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) {
    console.error('Create siswa error:', err.message)
    res.status(500).json({ message: 'Gagal menambah siswa' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { nis, nama, tanggal_lahir, alamat, kelas, foto } = req.body
    const [result] = await pool.execute(
      `UPDATE siswa
       SET nis = :nis, nama = :nama, tanggal_lahir = :tanggal_lahir,
           alamat = :alamat, kelas = :kelas, foto = :foto
       WHERE id = :id AND deleted_at IS NULL`,
      {
        id: Number(req.params.id),
        nis: String(nis ?? '').trim(),
        nama: String(nama ?? '').trim(),
        tanggal_lahir: tanggal_lahir || null,
        alamat: alamat || null,
        kelas: kelas || null,
        foto: foto || null
      }
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' })
    }
    res.json({ id: Number(req.params.id), ...req.body })
  } catch (err) {
    console.error('Update siswa error:', err.message)
    res.status(500).json({ message: 'Gagal memperbarui siswa' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      `UPDATE siswa SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id AND deleted_at IS NULL`,
      { id: Number(req.params.id) }
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' })
    }
    res.status(204).send()
  } catch (err) {
    console.error('Delete siswa error:', err.message)
    res.status(500).json({ message: 'Gagal menghapus siswa' })
  }
})

export default router
