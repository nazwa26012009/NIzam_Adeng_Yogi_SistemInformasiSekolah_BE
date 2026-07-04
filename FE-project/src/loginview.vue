<template>
  <div class="login-page">
    <div class="login-card">
      <h2>Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <input v-model="username" type="text" placeholder="Username" required />
        </div>
        <div class="field">
          <input v-model="nis" type="text" placeholder="NIS" required />
        </div>
        <div class="field">
          <input v-model="password" type="password" placeholder="Password" required />
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? '...' : 'LOGIN' }}
        </button>
      </form>

      <a href="#" class="forgot" @click.prevent>Lupa password</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/service/siswa.service'

const username = ref('')
const nis = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    const result = await login(
      username.value.trim(),
      nis.value.trim(),
      password.value
    )
    if (!result?.token) {
      throw new Error('Token session tidak diterima dari server')
    }
    localStorage.setItem('token', result.token)
    localStorage.setItem('username', result.username)
    router.push('/dashboard')
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #9ca3af;
}

.login-card {
  background: #fff;
  width: 320px;
  padding: 28px 24px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.login-card h2 {
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: 700;
}

.field {
  margin-bottom: 12px;
}

.field input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  outline: none;
  font-size: 14px;
  background: #f3f4f6;
}

.field input:focus {
  border-color: #9ca3af;
}

.btn-login {
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  border: none;
  border-radius: 999px;
  background: #e5e7eb;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.btn-login:hover {
  background: #d1d5db;
}

.forgot {
  display: inline-block;
  margin-top: 14px;
  font-size: 13px;
  color: #374151;
  text-decoration: none;
}

.error {
  color: #dc2626;
  font-size: 13px;
  margin-top: 8px;
}
</style>
