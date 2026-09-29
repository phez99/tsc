<template>
  <q-page class="q-pa-lg">
    <!-- ================= JUDUL + TOMBOL TAMBAH ================= -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold" style="color: #0f172a">Request Material</div>
        <div class="text-grey-7 text-body2">Pengajuan kebutuhan material per proyek.</div>
      </div>
      <q-btn class="btn-gold" no-caps icon="add" label="Ajukan Material" @click="openDialog" />
    </div>

    <!-- ================= TABEL ================= -->
    <q-card class="company-dash-card">
      <q-table
        class="company-dash-table"
        flat
        row-key="id"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="Belum ada pengajuan"
        @row-click="openDetail"
      >
        <template #top>
          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            emit-value
            map-options
            dense
            outlined
            label="Status"
            style="min-width: 200px"
          />
          <q-space />
          <div class="text-caption text-grey-6">Klik baris untuk lihat detail</div>
        </template>

        <template #body-cell-projectName="props">
          <q-td :props="props">{{ projectName(props.row.projectId) }}</q-td>
        </template>

        <template #body-cell-requesterName="props">
          <q-td :props="props">
            <div>{{ props.row.requesterName }}</div>
            <div class="text-caption text-grey-6">{{ props.row.requesterPosition }}</div>
          </q-td>
        </template>

        <template #body-cell-priority="props">
          <q-td :props="props">
            <q-badge
              v-if="props.row.priority === 'urgent'"
              color="red-5"
              :label="priorityLabel(props.row.priority)"
            />
            <span v-else class="text-grey-7">{{ priorityLabel(props.row.priority) }}</span>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="approvalStatusOf(props.row.status).color"
              :label="approvalStatusOf(props.row.status).label"
            />
          </q-td>
        </template>

        <template #body-cell-itemCount="props">
          <q-td :props="props">{{ props.row.items.length }} jenis</q-td>
        </template>
      </q-table>
    </q-card>

    <!-- ================= DIALOG AJUKAN MATERIAL ================= -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="width: 640px; max-width: 95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Ajukan Request Material</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeDialog" />
        </q-card-section>

        <q-form @submit.prevent="save">
          <q-card-section class="q-gutter-md" style="max-height: 60vh; overflow-y: auto">
            <q-select
              v-model="form.projectId"
              :options="projectOptions"
              emit-value
              map-options
              outlined
              label="Proyek"
              lazy-rules
              :rules="[(v) => !!v || 'Pilih proyek terlebih dahulu']"
            />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.neededDate"
                  type="date"
                  label="Dibutuhkan tanggal"
                  stack-label
                  outlined
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="form.priority"
                  :options="MATERIAL_PRIORITIES"
                  emit-value
                  map-options
                  outlined
                  label="Prioritas"
                />
              </div>
            </div>

            <q-input
              v-model="form.notes"
              type="textarea"
              autogrow
              outlined
              label="Catatan (opsional)"
            />

            <!-- ---------- Daftar item ---------- -->
            <div class="text-weight-bold q-mt-sm">Daftar Material</div>

            <div v-for="(item, i) in form.items" :key="i" class="row q-col-gutter-sm items-start">
              <div class="col-5">
                <q-input v-model="item.name" dense outlined label="Nama material" />
              </div>
              <div class="col-3">
                <q-input
                  v-model.number="item.qty"
                  type="number"
                  min="1"
                  dense
                  outlined
                  label="Jumlah"
                />
              </div>
              <div class="col-3">
                <q-select
                  v-model="item.unit"
                  :options="MATERIAL_UNITS"
                  dense
                  outlined
                  label="Satuan"
                />
              </div>
              <div class="col-1 flex items-center">
                <q-btn
                  flat
                  round
                  dense
                  icon="delete_outline"
                  color="grey-7"
                  :disable="form.items.length === 1"
                  @click="removeItemRow(i)"
                />
              </div>
            </div>

            <q-btn
              flat
              no-caps
              dense
              icon="add"
              label="Tambah baris material"
              color="amber-9"
              @click="addItemRow"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat no-caps label="Batal" @click="closeDialog" />
            <q-btn type="submit" class="btn-gold" no-caps label="Ajukan" :loading="saving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuth } from '/src/composables/useAuth.js';
import { getProjects } from '/src/services/projects.service.js';
import {
  getMaterialRequests,
  createMaterialRequest,
} from '/src/services/material-requests.service.js';
import { approvalStatusOf, APPROVAL_STATUSES } from '/src/config/approval.js';
import { MATERIAL_UNITS, MATERIAL_PRIORITIES, priorityLabel } from '/src/config/material.js';

const $q = useQuasar();
const router = useRouter();
const { user } = useAuth();

const requests = ref([]);
const projects = ref([]);
const loading = ref(false);
const statusFilter = ref('all');

const statusOptions = [{ value: 'all', label: 'Semua status' }, ...APPROVAL_STATUSES];
const projectOptions = computed(() =>
  projects.value.map((p) => ({ value: p.id, label: `${p.code} — ${p.name}` }))
);

const rows = computed(() =>
  statusFilter.value === 'all'
    ? requests.value
    : requests.value.filter((r) => r.status === statusFilter.value)
);

const columns = [
  { name: 'code', label: 'Kode', field: 'code', align: 'left', sortable: true },
  { name: 'projectName', label: 'Proyek', field: 'projectId', align: 'left' },
  { name: 'requesterName', label: 'Pemohon', field: 'requesterName', align: 'left' },
  { name: 'itemCount', label: 'Item', field: (r) => r.items.length, align: 'left' },
  { name: 'priority', label: 'Prioritas', field: 'priority', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
];

function projectName(projectId) {
  const p = projects.value.find((p) => p.id === projectId);
  return p ? p.name : '-';
}

async function load() {
  loading.value = true;
  try {
    const [reqs, projs] = await Promise.all([getMaterialRequests(), getProjects()]);
    requests.value = reqs;
    projects.value = projs;
  } finally {
    loading.value = false;
  }
}

onMounted(load);

function openDetail(_evt, row) {
  router.push(`/dashboard/material-requests/${row.id}`);
}

// ---------- Dialog tambah ----------
const dialog = ref(false);
const saving = ref(false);

const emptyForm = () => ({
  projectId: null,
  neededDate: '',
  priority: 'normal',
  notes: '',
  items: [{ name: '', qty: 1, unit: 'pcs' }],
});
const form = reactive(emptyForm());

function openDialog() {
  Object.assign(form, emptyForm());
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

function addItemRow() {
  form.items.push({ name: '', qty: 1, unit: 'pcs' });
}

function removeItemRow(i) {
  form.items.splice(i, 1);
}

async function save() {
  const validItems = form.items.filter((it) => it.name.trim() && it.qty > 0);
  if (!validItems.length) {
    $q.notify({ type: 'negative', message: 'Isi minimal 1 material dengan jumlah lebih dari 0' });
    return;
  }

  saving.value = true;
  try {
    const created = await createMaterialRequest({ ...form, items: validItems }, user.value);
    $q.notify({ type: 'positive', message: `Pengajuan ${created.code} dikirim` });
    closeDialog();
    await load();
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message || 'Gagal mengajukan material' });
  } finally {
    saving.value = false;
  }
}
</script>
