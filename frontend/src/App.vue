<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './stores/auth.store';

// Impor komponen Toast
import Toast from 'primevue/toast';

const authStore = useAuthStore();

// Saat aplikasi di-mount, cek localStorage
onMounted(() => {
  authStore.checkAuth();
});
</script>

<template>
  <Toast />
  <Navbar />
  <RouterView />
</template>