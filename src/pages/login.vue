<template>
  <div class="company-login-wrap">
    <!-- ================= KIRI: Branding (disembunyikan di layar kecil) ================= -->
    <div class="company-login-brand gt-sm">
      <div class="company-login-brand-inner">
        <img :src="logo" alt="TSC" class="company-login-brand-logo" />
        <h2 class="text-h4 text-white text-weight-bold q-mt-lg q-mb-md" style="line-height: 1.3">
          Selamat Datang di
          <span class="company-gradient-text">Portal TSC</span>
        </h2>
        <p class="text-grey-4" style="max-width: 380px; line-height: 1.8">
          Solusi terintegrasi Security System, Mechanical, Electrical &amp; Plumbing (MEP),
          Advertising, serta Pengadaan Material.
        </p>
      </div>
    </div>

    <!-- ================= KANAN: Form login ================= -->
    <div class="company-login-form-side">
      <div class="company-login-form-box">
        <img :src="logo" alt="TSC" class="company-login-mobile-logo lt-md" />

        <span class="company-eyebrow" style="color: #d97706">Login</span>
        <h1 class="text-h5 text-weight-bold q-mt-md q-mb-xs" style="color: #0f172a">
          Masuk ke akun Anda
        </h1>
        <p class="text-grey-7 q-mb-lg">Silakan masukkan email dan password Anda.</p>

        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            type="email"
            label="Email"
            outlined
            lazy-rules
            :rules="[
              (v) => !!v || 'Email wajib diisi',
              (v) => /.+@.+\..+/.test(v) || 'Format email tidak valid',
            ]"
          >
            <template #prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            outlined
            lazy-rules
            :rules="[
              (v) => !!v || 'Password wajib diisi',
              (v) => v.length >= 6 || 'Minimal 6 karakter',
            ]"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div class="row items-center justify-between">
            <q-checkbox v-model="remember" label="Ingat saya" dense />
            <a href="#" class="text-body2">Lupa password?</a>
          </div>

          <q-btn
            type="submit"
            class="btn-gold full-width"
            no-caps
            size="lg"
            label="Masuk"
            :loading="loading"
          />
        </q-form>

        <div class="text-center text-caption text-grey-6 q-mt-lg">
          &copy; {{ new Date().getFullYear() }} PT. Trimitra Solusindo Cemerlang
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuth } from '/src/composables/useAuth.js';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const { login } = useAuth();

// Sesuaikan path logo dengan file kamu di folder public/
const logo = '/logo_white-removebg-preview.png';

const email = ref('');
const password = ref('');
const remember = ref(false);
const showPassword = ref(false);
const loading = ref(false);

async function onSubmit() {
  loading.value = true;
  try {
    await login(email.value, password.value);

    // Kembali ke halaman yang tadi dituju (kalau ada), hanya di area /dashboard
    const target = String(route.query.redirect || '');
    router.push(target.startsWith('/dashboard') ? target : '/dashboard');

    $q.notify({ type: 'positive', message: 'Login berhasil' });
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message || 'Login gagal' });
  } finally {
    loading.value = false;
  }
}
</script>
