<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store'; // <-- Impor Pinia Store

// Impor komponen PrimeVUE
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';

const router = useRouter();
const authStore = useAuthStore(); // <-- Gunakan store

// Definisikan item menu.
const menuItems = ref([
  {
    label: 'Beranda',
    icon: 'pi pi-fw pi-home',
    command: () => {
      router.push('/');
    },
  },
  // Menu Dashboard Admin (hanya tampil jika admin)
  {
    label: 'Dashboard Admin',
    icon: 'pi pi-fw pi-cog',
    command: () => {
      router.push('/admin-dashboard');
    },
    visible: () => authStore.isAdmin, // <-- Kunci Reaktif
  },
  // Menu Dashboard Operasional (hanya tampil jika operasional)
  {
    label: 'Dashboard Operasional',
    icon: 'pi pi-fw pi-wrench',
    command: () => {
      router.push('/ops-dashboard');
    },
    visible: () => authStore.isOperasional, // <-- Kunci Reaktif
  },
]);

// Navigasi ke Halaman Login
const goToLogin = () => {
  router.push('/login');
};

// Panggil action logout dari store
const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <Menubar :model="menuItems">
    <template #start>
      <div class="flex align-items-center mr-4">
        <span class="font-bold text-lg">BOSOWA FUEL</span>
      </div>
    </template>

    <template #end>
      <Button
        v-if="!authStore.isAuthenticated"
        label="Log In"
        icon="pi pi-sign-in"
        class="p-button-text p-button-sm"
        @click="goToLogin"
      />

      <div v-if="authStore.isAuthenticated" class="flex align-items-center">
        <Avatar
          icon="pi pi-user"
          shape="circle"
          class="mr-2"
        />
        <span class="mr-3">Halo, {{ authStore.user?.username }}</span>
        <Button
          label="Log Out"
          icon="pi pi-sign-out"
          class="p-button-text p-button-sm p-button-danger"
          @click="handleLogout"
        />
      </div>
    </template>
  </Menubar>
</template>

<style scoped>
/* Style tetap sama */
.p-menubar {
  border-radius: 0;
  border-bottom: 1px solid var(--surface-d);
  padding: 0.5rem 1.5rem;
}
:deep(.p-menubar-start) {
  margin-right: auto;
}
</style>