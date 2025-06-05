<script setup lang="ts">
import ShopLayout from './layouts/ShopLayout.vue'
</script>

<template>
  <Toast />
  <ShopLayout>
    <router-view />
  </ShopLayout>
</template>
