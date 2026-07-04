import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const username = String(req.body.username ?? '').trim()
    const nis = String(req.body.nis ?? '').trim()
    const password = String(req.body.password ?? '')

    if (!username || !nis || !password) {
      return res.status(400).json({ message: 'Username, NIS, dan password wajib diisi' })
    }

    const [rows] = await pool.execute(
      `SELECT id, username, nis, password
       FROM users
       WHERE username = :username AND nis = :nis AND deleted_at IS NULL
       LIMIT 1`,
      { username, nis }
    )

    if (!rows.length) {
      return res.status(401).json({ message: 'Username, NIS, atau password salah' })
    }

    const user = rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Username, NIS, atau password salah' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, nis: user.nis },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    return res.json({
      token,
      username: user.username
    })
  } catch (err) {
    console.error('Login error:', err.message)
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' })
  }
})

export default router
