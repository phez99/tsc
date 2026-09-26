<template>
  <section class="company-section-slate q-py-xl">
    <div class="q-px-lg" style="max-width: 1280px; margin: 0 auto">
      <div class="text-center q-mb-xl">
        <span class="company-eyebrow" style="color: #d97706; background: rgba(245, 158, 11, 0.1)">{{
          eyebrow
        }}</span>
        <h2 class="text-h4 text-weight-bold q-mt-md" style="color: #0f172a">{{ title }}</h2>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-6 col-sm-4 col-md-3" v-for="logo in logos" :key="logo.name">
          <div class="company-logo-item">
            <img :src="logo.image" :alt="logo.name" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Komponen ini dipakai untuk 2 section: "Referensi" (klien) dan "Mitra Kami" (partner/brand).
// Tinggal panggil 2x dengan title & logos berbeda.
defineProps({
  eyebrow: { type: String, default: 'Klien Kami' },
  title: { type: String, default: 'Referensi' },
  logos: {
    type: Array,
    default: () => [],
    // contoh isi: [{ name: 'Adhi Karya', image: '/logos/adhi.png' }, ...]
  },
});
</script>
