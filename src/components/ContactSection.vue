<template>
  <section class="company-section-dark q-py-xl">
    <div class="q-px-lg" style="max-width: 900px; margin: 0 auto">
      <div class="text-center q-mb-lg">
        <h2 class="text-h4 text-white text-weight-bold q-mb-md">{{ title }}</h2>
        <p class="text-grey-4" style="line-height: 1.8">{{ description }}</p>
      </div>

      <div class="company-contact-banner">
        <div class="row q-col-gutter-md justify-center">
          <div class="col-12 col-sm-auto">
            <div class="company-contact-item">
              <div class="company-contact-icon">
                <q-icon name="call" />
              </div>
              <span>{{ phone }}</span>
            </div>
          </div>
          <div class="col-12 col-sm-auto">
            <div class="company-contact-item">
              <div class="company-contact-icon">
                <q-icon name="mail" />
              </div>
              <span>{{ email }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Let's Work Together With TSC" },
  description: {
    type: String,
    default:
      'Kami terbuka untuk menjalin kerja sama sebagai partner, subkontraktor, maupun joint operation dalam pelaksanaan proyek gedung, komersial, dan fasilitas industri. Dengan komitmen pada kualitas, keselamatan kerja, dan kepatuhan standar, kami siap menjadi mitra yang andal dan profesional.',
  },
  phone: { type: String, default: '+62 812 1050 1150' },
  email: { type: String, default: 'trimitrasolusindocemerlang@gmail.com' },
});
</script>
