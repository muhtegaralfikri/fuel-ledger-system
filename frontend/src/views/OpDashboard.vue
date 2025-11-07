<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import apiClient from '@/services/api';

// Impor komponen PrimeVUE
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import Calendar from 'primevue/calendar'; // <-- Kalender yang kamu minta
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const toast = useToast();

// State untuk form
const date = ref(new Date()); // Default hari ini
const amount = ref<number | null>(null);
const description = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  if (!amount.value || amount.value <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Gagal',
      detail: 'Jumlah liter harus lebih dari 0',
      life: 3000,
    });
    return;
  }
  if (!description.value) {
    toast.add({
      severity: 'warn',
      summary: 'Gagal',
      detail: 'Uraian pemakaian wajib diisi.',
      life: 3000,
    });
    return;
  }

  loading.value = true;
  try {
    // NOTE: Backend kita belum menerima 'date'.
    // Untuk saat ini, 'date' hanya untuk UI.
    // Backend akan otomatis mencatat 'timestamp' saat ini.
    await apiClient.post('/stock/out', {
      amount: amount.value,
      description: description.value,
    });

    // Berhasil!
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: `Pemakaian ${amount.value} liter berhasil dicatat.`,
      life: 3000,
    });

    // Reset form
    amount.value = null;
    description.value = '';
    date.value = new Date();
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Mencatat Pemakaian',
      detail: error.response?.data?.message || 'Terjadi kesalahan server.',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="grid justify-content-center p-4">
    <div class="col-12 md:col-8 lg:col-6">
      <Panel header="Dashboard Operasional">
        <p class="mb-4">
          Selamat datang,
          <strong>{{ authStore.user?.username }}</strong
          >. Gunakan form ini untuk mencatat pemakaian.
        </p>
        <form @submit.prevent="handleSubmit" class="p-fluid">
          <div class="field">
            <label for="date">Tanggal Pemakaian</label>
            <Calendar
              id="date"
              v-model="date"
              dateFormat="dd/mm/yy"
              showIcon
              showButtonBar
            />
          </div>
          <div class="field mt-4">
            <label for="amount">Jumlah Pemakaian (Liter)</label>
            <InputNumber
              id="amount"
              v-model="amount"
              placeholder="Masukkan jumlah liter"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
            />
          </div>
          <div class="field mt-4">
            <label for="description">Uraian Pemakaian (Wajib)</label>
            <Textarea
              id="description"
              v-model="description"
              rows="3"
              placeholder="Contoh: Pemakaian untuk Kapal X"
            />
          </div>
          <Button
            type="submit"
            label="Kirim Data Pemakaian"
            icon="pi pi-send"
            class="mt-4 w-full"
            :loading="loading"
          />
        </form>
      </Panel>
    </div>
  </div>
</template>