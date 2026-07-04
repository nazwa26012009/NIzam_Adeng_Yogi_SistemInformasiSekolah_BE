// @ts-ignore
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Mengarah ke router/index.ts yang sudah kita perbaiki

const app = createApp(App);

app.use(router); // Wajib memasang router agar halaman login bisa dimuat
app.mount('#app'); // Menghubungkan Vue ke <div id="app"> di index.html
