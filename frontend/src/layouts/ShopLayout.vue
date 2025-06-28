<script setup lang="ts">
import AppBar from '../components/AppBar.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-column surface-ground">
    <AppBar />

    <main class="w-full px-3 lg:w-9 flex-1 mx-auto">
      <slot></slot>
    </main>

    <Footer class="mt-8" />
  </div>
</template>
