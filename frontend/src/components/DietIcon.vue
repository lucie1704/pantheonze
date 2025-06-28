<template>
  <div
    class="diet-icon-wrapper"
    v-html="svgContent"
    v-tooltip.top="label"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  iconPath: string
  label: string
}>()

const svgContent = ref('')

const loadSvg = async () => {
  try {
    const response = await fetch(props.iconPath)
    if (response.ok) {
      const svg = await response.text()
      // Ajouter la classe CSS pour la couleur verte
      svgContent.value = svg.replace('<svg', '<svg class="diet-svg-icon"')
    }
  } catch (error) {
    console.error('Erreur lors du chargement du SVG:', error)
  }
}

onMounted(() => {
  loadSvg()
})

watch(
  () => props.iconPath,
  () => {
    loadSvg()
  },
)
</script>

<style scoped>
.diet-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
}

:deep(.diet-svg-icon) {
  width: 100%;
  height: 100%;
  fill: #4caf50 !important;
}

:deep(.diet-svg-icon path) {
  fill: #4caf50 !important;
}

:deep(.diet-svg-icon circle) {
  fill: #4caf50 !important;
}

:deep(.diet-svg-icon rect) {
  fill: #4caf50 !important;
}
</style>
