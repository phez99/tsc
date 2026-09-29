<template>
  <q-layout view="hHh LpR lFf">
    <!-- ================= HEADER ================= -->
    <q-header class="company-dash-header">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawer = !drawer" />
        <q-toolbar-title class="text-weight-bold">Dashboard</q-toolbar-title>
        <div class="gt-xs q-mr-md text-body2">
          {{ user?.name }}
          <span class="text-grey-5">({{ user?.position }})</span>
        </div>
        <q-btn flat no-caps icon="logout" label="Keluar" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- ================= SIDEBAR ================= -->
    <q-drawer v-model="drawer" show-if-above :width="240" class="company-dash-drawer">
      <div class="company-dash-brand">
        <img :src="logo" alt="TSC" />
      </div>

      <q-list padding>
        <q-item
          v-for="item in visibleMenu"
          :key="item.to"
          :to="item.to"
          exact
          clickable
          v-ripple
          class="company-dash-menu-item"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- ================= ISI HALAMAN (child dari folder dashboard/) ================= -->
    <q-page-container class="company-dash-page-bg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '/src/composables/useAuth.js';
import { menuItems } from '/src/config/menu.js';

const router = useRouter();
const { user, logout: clearSession } = useAuth();

// Sesuaikan path logo dengan file kamu di folder public/
const logo = '/logo_white-removebg-preview.png';

const drawer = ref(false);

// Menu yang tampil: sudah ready DAN sesuai role user yang login.
// Atur daftar menu & role di src/config/menu.js
const visibleMenu = computed(() =>
  menuItems.filter((m) => m.ready && m.roles.includes(user.value?.role))
);

function logout() {
  clearSession();
  router.push('/login');
}
</script>
