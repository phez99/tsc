// ============================================================
// AUTH SERVICE (MOCK)
// Sementara backend Express belum ada, login dicek ke data
// contoh di bawah. Semua halaman memanggil fungsi di file ini,
// jadi saat Express siap, CUKUP ubah isi fungsi login() di sini.
//
// Nanti (dengan axios):
//   const { data } = await api.post('/auth/login', { email, password })
//   return data   // bentuknya tetap: { token, user }
// ============================================================

// HAPUS blok DEMO_USERS ini saat sudah pakai backend sungguhan.
const DEMO_USERS = [
  {
    id: 1,
    name: 'Admin TSC',
    email: 'admin@tsc.local',
    password: 'admin123',
    role: 'admin',
    position: 'Administrator',
  },
  {
    id: 2,
    name: 'Manager TSC',
    email: 'manager@tsc.local',
    password: 'manager123',
    role: 'manager',
    position: 'Manager Operasional',
  },
  {
    id: 3,
    name: 'Project Manager',
    email: 'pm@tsc.local',
    password: 'pm123',
    role: 'pm',
    position: 'Project Manager',
  },
  {
    id: 4,
    name: 'Finance TSC',
    email: 'finance@tsc.local',
    password: 'finance123',
    role: 'finance',
    position: 'Staff Finance',
  },
  {
    id: 5,
    name: 'Staf Teknisi',
    email: 'staff@tsc.local',
    password: 'staff123',
    role: 'staff',
    position: 'Teknisi Lapangan',
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(email, password) {
  await delay(600); // simulasi waktu request jaringan

  const found = DEMO_USERS.find((u) => u.email === email && u.password === password);
  if (!found) {
    throw new Error('Email atau password salah');
  }

  // eslint-disable-next-line no-unused-vars
  const { password: _password, ...user } = found;
  return { token: `mock-token-${user.id}`, user };
}
