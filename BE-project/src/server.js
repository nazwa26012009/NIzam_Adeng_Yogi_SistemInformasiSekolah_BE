import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import pool from './config/db.js'
import authRoutes from './routes/auth.js'
import siswaRoutes from './routes/siswa.js'
import kelasRoutes from './routes/kelas.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/auth', authRoutes)
app.use('/siswa', siswaRoutes)
app.use('/kelas', kelasRoutes)

async function ensureDefaultUser() {
  const [rows] = await pool.execute(
    `SELECT id FROM users WHERE username = :username AND deleted_at IS NULL LIMIT 1`,
    { username: 'admin' }
  )

  if (rows.length) return

  const hashedPassword = await bcrypt.hash('admin123', 10)
  await pool.execute(
    `INSERT INTO users (username, nis, password)
     VALUES (:username, :nis, :password)`,
    {
      username: 'admin',
      nis: '1234567890',
      password: hashedPassword
    }
  )
  console.log('User default dibuat: username=admin, nis=1234567890, password=admin123')
}

async function startServer() {
  try {
    await pool.query('SELECT 1')
    await ensureDefaultUser()

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Gagal menghubungkan ke database:', err.message)
    console.error('Pastikan MySQL aktif dan file database.sql sudah diimport.')
    process.exit(1)
  }
}

startServer()
