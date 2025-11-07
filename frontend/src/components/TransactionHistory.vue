<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import * as XLSX from 'xlsx';
import apiClient from '@/services/api';

interface TransactionUser {
  id: string;
  username: string;
  email: string;
}

interface TransactionHistoryItem {
  id: string;
  timestamp: string;
  type: 'IN' | 'OUT';
  amount: number;
  description: string | null;
  user: TransactionUser;
}

interface HistoryResponse {
  data: TransactionHistoryItem[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

const defaultTimeZone = 'Asia/Makassar';

const props = withDefaults(
  defineProps<{
    type: 'IN' | 'OUT';
    title: string;
    description?: string;
    limit?: number;
    timeZone?: string;
  }>(),
  {
    description: '',
    limit: 10,
    timeZone: defaultTimeZone,
  },
);

const resolvedTimeZone = computed(
  () =>
    props.timeZone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    defaultTimeZone,
);

const history = ref<TransactionHistoryItem[]>([]);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

const formatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatDate = (value: string | number | Date) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: resolvedTimeZone.value,
  }).format(new Date(value));

const fetchHistory = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    const { data } = await apiClient.get<HistoryResponse>('/stock/history', {
      params: {
        limit: props.limit,
        type: props.type,
      },
    });
    history.value = (data?.data || []).map((item) => ({
      ...item,
      amount: Number(item.amount),
    }));
  } catch (error: any) {
    console.error('Failed to load history', error);
    errorMessage.value =
      error.response?.data?.message ||
      'Gagal memuat riwayat transaksi. Coba lagi beberapa saat.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchHistory);

const refresh = () => fetchHistory();

const exportToExcel = () => {
  if (!history.value.length) {
    return;
  }

  const worksheetData = history.value.map((item, index) => ({
    No: index + 1,
    Tanggal: formatDate(item.timestamp),
    Jenis: item.type === 'IN' ? 'Tambah Stok' : 'Pemakaian',
    'Jumlah (Liter)': item.amount,
    Petugas: item.user?.username || '-',
    Keterangan: item.description || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat');

  const filename = `riwayat-${
    props.type === 'IN' ? 'tambah-stok' : 'pemakaian'
  }-${new Date().toISOString().split('T')[0]}.xlsx`;

  XLSX.writeFile(workbook, filename);
};

defineExpose({
  refresh,
});
</script>

<template>
  <Card class="history-card dashboard-card">
    <template #title>
      <div class="history-header">
        <div>
          <p class="eyebrow mb-2">{{ title }}</p>
          <h3 class="m-0">
            {{ type === 'IN' ? 'Riwayat Penambahan Stok' : 'Riwayat Pemakaian Bahan Bakar' }}
          </h3>
        </div>
        <div class="history-actions">
          <Button
            icon="pi pi-refresh"
            label="Muat Ulang"
            size="small"
            outlined
            :loading="loading"
            @click="refresh"
          />
          <Button
            icon="pi pi-file-excel"
            label="Export Excel"
            size="small"
            severity="success"
            :disabled="!history.length"
            @click="exportToExcel"
          />
        </div>
      </div>
    </template>

    <template #content>
      <p v-if="description" class="history-description">
        {{ description }}
      </p>

      <div v-if="loading" class="history-state">
        <i class="pi pi-spin pi-spinner" aria-hidden="true" />
        <span>Memuat riwayat...</span>
      </div>

      <div v-else-if="errorMessage" class="history-state error">
        <i class="pi pi-times-circle" aria-hidden="true" />
        <span>{{ errorMessage }}</span>
        <Button label="Coba Lagi" link @click="refresh" />
      </div>

      <div v-else-if="!history.length" class="history-state empty">
        <i class="pi pi-inbox" aria-hidden="true" />
        <span>Belum ada riwayat untuk jenis transaksi ini.</span>
      </div>

      <div v-else class="history-table-wrapper">
        <table class="history-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Petugas</th>
              <th>Jumlah (L)</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in history" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ formatDate(item.timestamp) }}</td>
              <td>{{ item.user?.username || '-' }}</td>
              <td class="amount-cell">
                {{ formatter.format(item.amount) }}
              </td>
              <td>{{ item.description || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.history-card {
  margin-top: 1.5rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.history-description {
  color: var(--surface-600);
  margin-bottom: 1rem;
}

.history-table-wrapper {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.history-table th,
.history-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.history-table th {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--surface-500);
}

.history-table tbody tr:hover {
  background: rgba(15, 23, 42, 0.03);
}

.amount-cell {
  font-weight: 600;
  color: var(--surface-900);
}

.history-state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
  color: var(--surface-700);
}

.history-state i {
  font-size: 1.35rem;
}

.history-state.error {
  color: #dc2626;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.history-state.empty {
  color: var(--surface-500);
}
</style>
