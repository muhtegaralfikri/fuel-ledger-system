<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import apiClient from '@/services/api';

// Impor komponen PrimeVUE
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import { useToast } from 'primevue/usetoast'; // Impor Toast

const authStore = useAuthStore();
const toast = useToast(); // Inisialisasi Toast

// State untuk form
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

  loading.value = true;
  try {
    await apiClient.post('/stock/in', {
      amount: amount.value,
      description: description.value,
    });

    // Berhasil!
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: `Stok berhasil ditambah ${amount.value} liter.`,
      life: 3000,
    });

    // Reset form
    amount.value = null;
    description.value = '';
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Menambah Stok',
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
      <Panel header="Dashboard Admin">
        <p class="mb-4">
          Selamat datang,
          <strong>{{ authStore.user?.username }}</strong
          >. Gunakan form ini untuk menambah stok bahan bakar.
        </p>
        <form @submit.prevent="handleSubmit" class="p-fluid">
          <div class="field">
            <label for="amount">Jumlah (Liter)</label>
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
            <label for="description">Deskripsi</label>
            <Textarea
              id="description"
              v-model="description"
              rows="3"
              placeholder="Contoh: Pembelian dari Pertamina"
            />
          </div>
          <Button
            type="submit"
            label="Tambah Stok"
            icon="pi pi-plus"
            class="mt-4 w-full"
            :loading="loading"
          />
        </form>
      </Panel>
    </div>
  </div>
</template>