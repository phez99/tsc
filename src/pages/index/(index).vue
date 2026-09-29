<template>
  <q-page>
    <q-header elevated class="bg-navy-950 text-white" height-hint="98">
      <div class="q-pa-md">
        <q-toolbar class="text-white">
          <img alt="TSC" src="@/assets/logo_white-removebg-preview.png" width="80" />

          <q-space />
          <q-btn-toggle
            v-model="model"
            class="gt-sm"
            flat
            stretch
            toggle-color="yellow"
            :options="options"
            @click="go(model)"
            @update:model-value="scrollToId"
          />
          <q-btn
            aria-label="Toggle drawer"
            flat
            round
            dense
            icon="menu"
            class="q-mr-sm lt-md"
            @click="toggleDrawer"
          />
        </q-toolbar>
      </div>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left" bordered class="bg-navy-950">
      <div class="q-pa-md text-white">
        <q-list
          v-for="option in options"
          :key="option.value"
          dark
          separator
          style="max-width: 318px"
        >
          <q-item clickable v-ripple @click="scrollToId(option.value)">
            <q-item-section>{{ option.label }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <HeroSection
      id="home"
      background-image="/01.jpg"
      :logo-position="{ top: '10px', left: '10px', width: '60px' }"
    />

    <AboutSection id="tentangkami" />
    <VisionMissionSection id="visi&misi" />
    <HowWeWorkSection id="proseskerja" />
    <ServicesSection id="layanan" />
    <PortfolioSection id="portofolio" />
    <AdvantagesSection id="keunggulan" image="/01.jpg" />
    <ContactSection id="kontak" />
    <!-- Section Referensi (klien) -->
    <LogoGridSection
      id="klien"
      eyebrow="Klien Kami"
      title="Referensi"
      :logos="[
        { name: 'Adhi Karya', image: '/images/client/adhi-karya.png' },
        { name: 'Sahid Jaya', image: '/images/client/sahid-jaya.png' },
        { name: 'Biofarma', image: '/images/client/bio-farma.png' },
        { name: 'Telkom Indonesia', image: '/images/client/telkom_indonesia.png' },
        { name: 'Agung Sedayu group', image: '/images/client/agung-sedayu.png' },
        { name: 'Mayora', image: '/images/client/logo-mayora.png' },
        { name: 'Biofarma', image: '/images/client/bio-farma.png' },
        { name: 'Adhi Karya', image: '/images/client/adhi-karya.png' },
        { name: 'Sahid Jaya', image: '/images/client/sahid-jaya.png' },
        { name: 'Biofarma', image: '/images/client/bio-farma.png' },
        { name: 'Adhi Karya', image: '/images/client/adhi-karya.png' },
        { name: 'Sahid Jaya', image: '/images/client/sahid-jaya.png' },
        { name: 'Biofarma', image: '/images/client/bio-farma.png' },
      ]"
    />

    <!-- Section Mitra Kami (brand/partner produk) -->
    <LogoGridSection
      eyebrow="Partner Kami"
      title="Mitra Kami"
      :logos="[
        { name: 'Adhi Karya', image: '/images/client/adhi-karya.png' },
        { name: 'Sahid Jaya', image: '/images/client/sahid-jaya.png' },
        { name: 'Biofarma', image: '/images/client/bio-farma.png' },
        { name: 'Telkom Indonesia', image: '/images/client/telkom_indonesia.png' },
        { name: 'Adhi Karya', image: '/images/client/adhi-karya.png' },
        { name: 'Sahid Jaya', image: '/images/client/sahid-jaya.png' },
        { name: 'Biofarma', image: '/images/client/bio-farma.png' },
        { name: 'Adhi Karya', image: '/images/client/adhi-karya.png' },
        { name: 'Sahid Jaya', image: '/images/client/sahid-jaya.png' },
        { name: 'Biofarma', image: '/images/client/bio-farma.png' },
        { name: 'Adhi Karya', image: '/images/client/adhi-karya.png' },
        { name: 'Sahid Jaya', image: '/images/client/sahid-jaya.png' },
        { name: 'Biofarma', image: '/images/client/bio-farma.png' },
      ]"
    />

    <FooterSection logo-image="/logo_white-removebg-preview.png" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import HeroSection from '@/components/HeroSection.vue';
import AboutSection from '@/components/AboutSection.vue';
import VisionMissionSection from '@/components/VisionMissionSection.vue';
import HowWeWorkSection from '@/components/HowWeWorkSection.vue';
import ServicesSection from '@/components/ServicesSection.vue';
import PortfolioSection from '@/components/PortfolioSection.vue';
import AdvantagesSection from '@/components/AdvantagesSection.vue';
import ContactSection from '@/components/ContactSection.vue';
import LogoGridSection from '@/components/LogoGridSection.vue';
import FooterSection from '@/components/FooterSection.vue';
// const rightDrawerOpen = ref(false);

const model = ref('home');
const leftDrawerOpen = ref(false);
const options = [
  { label: 'Home', value: 'home' },
  { label: 'Tentang Kami', value: 'tentangkami' },
  { label: 'Visi & Misi', value: 'visi&misi' },
  { label: 'Proses Kerja', value: 'proseskerja' },
  { label: 'Layanan', value: 'layanan' },
  { label: 'Keunggulan', value: 'keunggulan' },
  { label: 'Kontak', value: 'kontak' },
  { label: 'Klien Kami', value: 'klien' },
];
function scrollToId(targetId) {
  leftDrawerOpen.value = false;
  if (!targetId) return;

  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth', // Efek geser mulus/halus
      block: 'start', // Posisi elemen di paling atas layar
    });
  }
}

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
