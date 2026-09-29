<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 text-weight-bold q-mb-md" style="color: #0f172a">Ringkasan</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3" v-for="card in cards" :key="card.label">
        <q-card class="company-dash-card q-pa-md">
          <div class="text-caption text-grey-7" style="text-transform: uppercase">
            {{ card.label }}
          </div>
          <div class="text-h5 text-weight-bold" style="color: #0f172a">{{ card.value }}</div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Data contoh — ganti dengan data dari API kamu
const cards = [
  { label: 'Proyek', value: '0' },
  { label: 'Klien', value: '0' },
  { label: 'Pesan Masuk', value: '0' },
  { label: 'Pengguna', value: '0' },
];
</script>
