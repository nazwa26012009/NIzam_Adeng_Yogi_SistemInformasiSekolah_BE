<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="login-label" @click="logout">
          <span class="icon-user">&#9679;</span>
          <span>Login</span>
        </div>

        <div class="search-box">
          <input v-model="searchQuery" type="text" placeholder="Search" />
          <span class="search-icon">&#128269;</span>
        </div>

        <nav>
          <button
            :class="{ active: menuAktif === 'home' }"
            @click="pindahMenu('home')"
          >
            Home
          </button>
          <button
            :class="{ active: menuAktif === 'manajemen-kelas' }"
            @click="pindahMenu('manajemen-kelas')"
          >
            Manajemen Kelas
          </button>
          <button
            :class="{ active: menuAktif === 'manajemen-siswa' }"
            @click="pindahMenu('manajemen-siswa')"
          >
            manajemen Siswa
          </button>
        </nav>
      </div>
    </aside>

    <main class="main-area">
      <!-- HOME -->
      <section v-if="menuAktif === 'home'" class="panel">
        <h2 class="title">Home</h2>
        <p class="home-text">Selamat datang di Sistem Informasi Sekolah.</p>
      </section>

      <!-- MANAJEMEN KELAS -->
      <section v-if="menuAktif === 'manajemen-kelas'" class="panel">
        <button
          v-if="statusKelas !== 'list'"
          class="btn-back"
          @click="statusKelas = 'list'"
        >
          &#8592;
        </button>

        <div v-if="statusKelas === 'list'">
          <h2 class="title">Detail Kelas</h2>
          <div class="toolbar">
            <button class="btn-action" @click="bukaTambahKelas">Tambah Kelas</button>
          </div>
          <div v-if="loadingKelas" class="loading">Memuat data...</div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th>Kelas</th>
                <th>Jumlah Siswa</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="kelas in dataKelas" :key="kelas.id">
                <td>{{ kelas.nama_kelas }}</td>
                <td class="center">{{ kelas.jumlah_siswa }}</td>
                <td class="center aksi">
                  <a href="#" @click.prevent="bukaEditKelas(kelas)">Edit</a>
                  <span>|</span>
                  <a href="#" @click.prevent="konfirmasiHapusKelas(kelas)">Delete</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="statusKelas === 'tambah' || statusKelas === 'edit'" class="form-panel">
          <h2 class="title">{{ statusKelas === 'tambah' ? 'Tambah Kelas' : 'Edit Kelas' }}</h2>
          <div class="form-row">
            <label>Kelas</label>
            <input v-model="formKelas.nama_kelas" type="text" />
          </div>
          <div class="form-row">
            <label>Wali kelas</label>
            <input v-model="formKelas.wali_kelas" type="text" />
          </div>
          <div class="form-row">
            <label>Jumlah siswa</label>
            <input v-model.number="formKelas.jumlah_siswa" type="number" />
          </div>
          <div class="form-actions">
            <button class="btn-pill" @click="simpanKelas">
              {{ statusKelas === 'tambah' ? 'Tambah' : 'Update' }}
            </button>
            <button class="btn-pill" @click="statusKelas = 'list'">Batal</button>
          </div>
        </div>
      </section>

      <!-- MANAJEMEN SISWA -->
      <section v-if="menuAktif === 'manajemen-siswa'" class="panel">
        <button
          v-if="statusSiswa !== 'list'"
          class="btn-back"
          @click="statusSiswa = 'list'"
        >
          &#8592;
        </button>

        <div v-if="statusSiswa === 'list'">
          <h2 class="title">Daftar Siswa</h2>
          <div class="toolbar">
            <button class="btn-action" @click="bukaTambahSiswa">Tambah Siswa</button>
          </div>
          <div v-if="loadingSiswa" class="loading">Memuat data...</div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th>Nis</th>
                <th>Nama siswa</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="siswa in siswaFiltered" :key="siswa.id">
                <td>{{ siswa.nis }}</td>
                <td>
                  <a href="#" class="link-nama" @click.prevent="bukaDetailSiswa(siswa)">
                    {{ siswa.nama }}
                  </a>
                </td>
                <td class="center aksi">
                  <a href="#" @click.prevent="bukaEditSiswa(siswa)">Edit</a>
                  <span>|</span>
                  <a href="#" @click.prevent="konfirmasiHapusSiswa(siswa)">Delete</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="statusSiswa === 'tambah' || statusSiswa === 'edit'" class="form-panel">
          <h2 class="title">{{ statusSiswa === 'tambah' ? 'Tambah Siswa' : 'Update Siswa' }}</h2>
          <div class="form-row">
            <label>Nama</label>
            <input v-model="formSiswa.nama" type="text" />
          </div>
          <div class="form-row">
            <label>Tanggal lahir</label>
            <input v-model="formSiswa.tanggal_lahir" type="date" />
          </div>
          <div class="form-row">
            <label>Alamat</label>
            <input v-model="formSiswa.alamat" type="text" />
          </div>
          <div class="form-row">
            <label>Kelas</label>
            <input v-model="formSiswa.kelas" type="text" />
          </div>
          <div class="form-actions">
            <button class="btn-pill" @click="statusSiswa = 'list'">Batal</button>
            <button class="btn-pill" @click="simpanSiswa">
              {{ statusSiswa === 'tambah' ? 'Tambah' : 'Update' }}
            </button>
          </div>
        </div>

        <div v-if="statusSiswa === 'detail'" class="detail-panel">
          <h2 class="title">Detail Siswa</h2>
          <table class="detail-table">
            <thead>
              <tr>
                <th>Nis</th>
                <th>Nama siswa</th>
                <th>Kelas</th>
                <th>Tanggal lahir</th>
                <th>Foto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ formSiswa.nis }}</td>
                <td>{{ formSiswa.nama }}</td>
                <td>{{ formSiswa.kelas }}</td>
                <td>{{ formatTanggal(formSiswa.tanggal_lahir) }}</td>
                <td class="center">
                  <button class="btn-foto" @click="bukaFoto">&#128247;</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Modal Hapus -->
    <div v-if="tampilModalHapus" class="overlay">
      <div class="modal-small">
        <p>Apakah anda ingin menghapus?</p>
        <div class="modal-actions">
          <button class="btn-pill" @click="tampilModalHapus = false">Batal</button>
          <button class="btn-pill" @click="prosesHapus">Hapus</button>
        </div>
      </div>
    </div>

    <!-- Modal Foto -->
    <div v-if="tampilModalFoto" class="overlay">
      <div class="modal-foto">
        <h3>Foto</h3>
        <div class="foto-box">
          <img
            :src="formSiswa.foto || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400'"
            alt="Foto siswa"
          />
        </div>
        <button class="btn-back-foto" @click="tampilModalFoto = false">&#8592;</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getSiswa,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  getKelas,
  createKelas,
  updateKelas,
  deleteKelas,
  type Siswa,
  type Kelas
} from '@/service/siswa.service'

const router = useRouter()

const menuAktif = ref<'home' | 'manajemen-kelas' | 'manajemen-siswa'>('manajemen-siswa')
const searchQuery = ref('')

const dataSiswa = ref<Siswa[]>([])
const dataKelas = ref<Kelas[]>([])
const loadingSiswa = ref(true)
const loadingKelas = ref(true)

const statusSiswa = ref<'list' | 'tambah' | 'edit' | 'detail'>('list')
const statusKelas = ref<'list' | 'tambah' | 'edit'>('list')

const formSiswa = ref<Partial<Siswa>>({})
const formKelas = ref<Partial<Kelas>>({})

const tampilModalHapus = ref(false)
const tampilModalFoto = ref(false)
const hapusTarget = ref<{ type: 'siswa' | 'kelas'; item: Siswa | Kelas } | null>(null)

const siswaFiltered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return dataSiswa.value
  return dataSiswa.value.filter(
    (s) => s.nama.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q)
  )
})

const pindahMenu = (menu: typeof menuAktif.value) => {
  menuAktif.value = menu
  statusSiswa.value = 'list'
  statusKelas.value = 'list'
}

const formatTanggal = (val?: string) => {
  if (!val) return '-'
  const d = new Date(val)
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
}

const ambilSiswa = async () => {
  loadingSiswa.value = true
  try {
    dataSiswa.value = await getSiswa()
  } catch {
    alert('Gagal memuat data siswa')
  } finally {
    loadingSiswa.value = false
  }
}

const ambilKelas = async () => {
  loadingKelas.value = true
  try {
    dataKelas.value = await getKelas()
  } catch {
    alert('Gagal memuat data kelas')
  } finally {
    loadingKelas.value = false
  }
}

const bukaDetailSiswa = (siswa: Siswa) => {
  formSiswa.value = { ...siswa }
  statusSiswa.value = 'detail'
}

const bukaTambahSiswa = () => {
  formSiswa.value = { nama: '', tanggal_lahir: '', alamat: '', kelas: '' }
  statusSiswa.value = 'tambah'
}

const bukaEditSiswa = (siswa: Siswa) => {
  formSiswa.value = { ...siswa }
  statusSiswa.value = 'edit'
}

const bukaTambahKelas = () => {
  formKelas.value = { nama_kelas: '', wali_kelas: '', jumlah_siswa: 0 }
  statusKelas.value = 'tambah'
}

const bukaEditKelas = (kelas: Kelas) => {
  formKelas.value = { ...kelas }
  statusKelas.value = 'edit'
}

const simpanSiswa = async () => {
  try {
    if (statusSiswa.value === 'tambah') {
      const nis = String(Date.now()).slice(-10)
      await createSiswa({ ...formSiswa.value, nis })
    } else if (statusSiswa.value === 'edit' && formSiswa.value.id) {
      await updateSiswa(formSiswa.value.id, formSiswa.value)
    }
    statusSiswa.value = 'list'
    await ambilSiswa()
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : 'Gagal menyimpan siswa')
  }
}

const simpanKelas = async () => {
  try {
    if (statusKelas.value === 'tambah') {
      await createKelas(formKelas.value)
    } else if (statusKelas.value === 'edit' && formKelas.value.id) {
      await updateKelas(formKelas.value.id, formKelas.value)
    }
    statusKelas.value = 'list'
    await ambilKelas()
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : 'Gagal menyimpan kelas')
  }
}

const konfirmasiHapusSiswa = (siswa: Siswa) => {
  hapusTarget.value = { type: 'siswa', item: siswa }
  tampilModalHapus.value = true
}

const konfirmasiHapusKelas = (kelas: Kelas) => {
  hapusTarget.value = { type: 'kelas', item: kelas }
  tampilModalHapus.value = true
}

const prosesHapus = async () => {
  if (!hapusTarget.value) return
  try {
    if (hapusTarget.value.type === 'siswa') {
      await deleteSiswa((hapusTarget.value.item as Siswa).id)
      await ambilSiswa()
    } else {
      await deleteKelas((hapusTarget.value.item as Kelas).id)
      await ambilKelas()
    }
  } catch {
    alert('Gagal menghapus data')
  } finally {
    tampilModalHapus.value = false
    hapusTarget.value = null
  }
}

const bukaFoto = () => {
  tampilModalFoto.value = true
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/')
}

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/')
    return
  }
  ambilSiswa()
  ambilKelas()
})
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #9ca3af;
}

.sidebar {
  width: 220px;
  background: #6b7280;
  color: #fff;
  padding: 20px 16px;
  flex-shrink: 0;
}

.login-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  cursor: pointer;
}

.icon-user {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #d1d5db;
  color: #374151;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: none;
  border-radius: 999px;
  background: #e5e7eb;
  outline: none;
  font-size: 13px;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
}

nav button {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: #fff;
  padding: 8px 4px;
  font-size: 14px;
  margin-bottom: 6px;
}

nav button.active {
  font-weight: 700;
}

.main-area {
  flex: 1;
  padding: 24px;
  display: flex;
  justify-content: center;
}

.panel {
  width: 100%;
  max-width: 780px;
  background: #d1d5db;
  border-radius: 12px;
  padding: 28px 32px 32px;
  position: relative;
  min-height: 480px;
}

.btn-back {
  position: absolute;
  top: 16px;
  left: 16px;
  background: none;
  border: none;
  font-size: 22px;
  color: #374151;
}

.title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}

.home-text {
  text-align: center;
  color: #374151;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.btn-action {
  background: #e5e7eb;
  border: 1px solid #9ca3af;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 13px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-style: italic;
}

.data-table,
.detail-table {
  width: 100%;
  background: #fff;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td,
.detail-table th,
.detail-table td {
  border: 1px solid #d1d5db;
  padding: 10px 14px;
  font-size: 14px;
}

.data-table thead,
.detail-table thead {
  background: #e5e7eb;
}

.center {
  text-align: center;
}

.aksi a {
  color: #374151;
  text-decoration: none;
  font-size: 13px;
}

.aksi span {
  margin: 0 4px;
  color: #9ca3af;
}

.link-nama {
  color: #2563eb;
  text-decoration: underline;
}

.form-panel {
  max-width: 420px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  gap: 12px;
}

.form-row label {
  width: 110px;
  font-size: 14px;
  flex-shrink: 0;
}

.form-row input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #9ca3af;
  border-radius: 999px;
  background: #fff;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.btn-pill {
  background: #e5e7eb;
  border: 1px solid #9ca3af;
  border-radius: 999px;
  padding: 8px 24px;
  font-size: 14px;
}

.detail-panel {
  margin-top: 8px;
}

.btn-foto {
  background: none;
  border: none;
  font-size: 20px;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-small {
  background: #fff;
  border-radius: 12px;
  padding: 24px 28px;
  text-align: center;
  min-width: 260px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-small p {
  margin-bottom: 20px;
  font-size: 15px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.modal-foto {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px 16px;
  width: 320px;
  text-align: center;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-foto h3 {
  font-size: 18px;
  margin-bottom: 12px;
}

.foto-box {
  width: 220px;
  height: 280px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px;
  background: #f3f4f6;
}

.foto-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-back-foto {
  position: absolute;
  bottom: 12px;
  left: 16px;
  background: none;
  border: none;
  font-size: 22px;
}
</style>
