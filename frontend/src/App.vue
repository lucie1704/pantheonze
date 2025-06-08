<script setup lang="ts">
import ShopLayout from './layouts/ShopLayout.vue'
</script>

<template>
  <Toast position="bottom-right" />
  <ShopLayout>
    <router-view />
  </ShopLayout>
</template>
