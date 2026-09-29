<template>
  <q-page class="q-pa-lg">
    <q-btn
      flat
      no-caps
      dense
      icon="arrow_back"
      label="Kembali ke daftar proyek"
      class="q-mb-md"
      @click="router.push('/dashboard/projects')"
    />

    <!-- Loading -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="amber-8" size="40px" />
    </div>

    <!-- Tidak ditemukan -->
    <q-card v-else-if="!project" class="company-dash-card q-pa-xl text-center">
      <q-icon name="search_off" size="48px" color="grey-5" />
      <div class="text-h6 q-mt-md">Proyek tidak ditemukan</div>
      <div class="text-grey-7">Proyek ini mungkin sudah dihapus atau alamatnya salah.</div>
    </q-card>

    <!-- Detail -->
    <template v-else>
      <div class="row items-start justify-between q-mb-md">
        <div>
          <div class="text-caption text-grey-7">{{ project.code }}</div>
          <div class="text-h5 text-weight-bold" style="color: #0f172a">{{ project.name }}</div>
        </div>
        <q-badge
          :color="statusOf(project.status).color"
          :label="statusOf(project.status).label"
          class="q-pa-sm"
        />
      </div>

      <div class="row q-col-gutter-lg">
        <!-- ================= KIRI: Informasi + Progres ================= -->
        <div class="col-12 col-md-7">
          <q-card class="company-dash-card q-pa-lg q-mb-lg">
            <div class="text-subtitle1 text-weight-bold q-mb-md">Informasi Proyek</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div class="company-info-label">Klien</div>
                <div class="company-info-value">{{ project.client }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="company-info-label">Lokasi</div>
                <div class="company-info-value">{{ project.location || '-' }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="company-info-label">Kategori</div>
                <div class="company-info-value">{{ categoryLabel(project.category) }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="company-info-label">Jadwal</div>
                <div class="company-info-value">
                  {{ formatDate(project.startDate) }} &ndash; {{ formatDate(project.endDate) }}
                </div>
              </div>
            </div>
          </q-card>

          <q-card class="company-dash-card q-pa-lg">
            <div class="text-subtitle1 text-weight-bold q-mb-md">Status &amp; Progres</div>

            <q-select
              v-model="statusModel"
              :options="PROJECT_STATUSES"
              emit-value
              map-options
              outlined
              dense
              label="Status proyek"
              class="q-mb-lg"
              style="max-width: 260px"
              @update:model-value="saveStatus"
            />

            <div class="row items-center justify-between">
              <div class="company-info-label">Progres pekerjaan</div>
              <div class="text-weight-bold">{{ progressModel }}%</div>
            </div>
            <q-slider
              v-model="progressModel"
              :min="0"
              :max="100"
              :step="5"
              color="amber-8"
              label
              @change="saveProgress"
            />
          </q-card>
        </div>

        <!-- ================= KANAN: Anggota Tim ================= -->
        <div class="col-12 col-md-5">
          <q-card class="company-dash-card q-pa-lg">
            <div class="text-subtitle1 text-weight-bold q-mb-md">
              Anggota Tim
              <span class="text-grey-6 text-body2">({{ project.members.length }})</span>
            </div>

            <q-list v-if="project.members.length" separator>
              <q-item v-for="m in project.members" :key="m.id" class="q-px-none">
                <q-item-section avatar>
                  <q-avatar color="blue-grey-9" text-color="amber-6" size="36px">
                    {{ m.name.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ m.name }}</q-item-label>
                  <q-item-label caption>{{ m.role }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete_outline"
                    color="grey-7"
                    @click="removeMemberById(m.id)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-grey-6 text-body2 q-mb-md">Belum ada anggota tim.</div>

            <q-separator class="q-my-md" />

            <q-form @submit.prevent="addNewMember" class="q-gutter-sm">
              <q-input
                v-model="newMember.name"
                dense
                outlined
                label="Nama anggota"
                lazy-rules
                :rules="[(v) => !!v || 'Nama wajib diisi']"
              />
              <q-input
                v-model="newMember.role"
                dense
                outlined
                label="Peran (mis. Site Engineer)"
                lazy-rules
                :rules="[(v) => !!v || 'Peran wajib diisi']"
              />
              <q-btn
                type="submit"
                class="btn-gold full-width"
                no-caps
                icon="person_add"
                label="Tambah anggota"
              />
            </q-form>
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import {
  getProject,
  updateProject,
  addMember,
  removeMember,
} from '/src/services/projects.service.js';
import { PROJECT_STATUSES, statusOf, categoryLabel, formatDate } from '/src/config/projects.js';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const project = ref(null);
const loading = ref(true);
const statusModel = ref('');
const progressModel = ref(0);

function applyProject(p) {
  project.value = p;
  statusModel.value = p?.status ?? '';
  progressModel.value = p?.progress ?? 0;
}

onMounted(async () => {
  try {
    applyProject(await getProject(route.params.id));
  } finally {
    loading.value = false;
  }
});

async function patch(data, successMessage) {
  try {
    applyProject(await updateProject(project.value.id, data));
    $q.notify({ type: 'positive', message: successMessage });
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message || 'Gagal menyimpan' });
  }
}

const saveStatus = (value) => patch({ status: value }, 'Status diperbarui');
const saveProgress = (value) => patch({ progress: value }, 'Progres diperbarui');

// ---------- Anggota tim ----------
const newMember = reactive({ name: '', role: '' });

async function addNewMember() {
  try {
    applyProject(await addMember(project.value.id, { name: newMember.name, role: newMember.role }));
    newMember.name = '';
    newMember.role = '';
    $q.notify({ type: 'positive', message: 'Anggota ditambahkan' });
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message || 'Gagal menambah anggota' });
  }
}

async function removeMemberById(memberId) {
  try {
    applyProject(await removeMember(project.value.id, memberId));
    $q.notify({ type: 'positive', message: 'Anggota dihapus' });
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message || 'Gagal menghapus anggota' });
  }
}
</script>
