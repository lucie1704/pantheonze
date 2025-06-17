<script setup lang="ts">
import { ref } from 'vue'
import Select from 'primevue/select'
import Accordion from 'primevue/accordion'
import Slider from 'primevue/slider'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

const props = defineProps<{
  filters: {
    categories: string[]
    diets: string[]
    priceRange: [number, number]
    season: string[]
    region: string[]
    availability: boolean
  }
  options: {
    categories: string[]
    diets: string[]
    seasons: string[]
    regions: string[]
  }
}>()

const emit = defineEmits<{
  (e: 'update:filters', value: typeof props.filters): void
  (e: 'reset-filters'): void
}>()

const activeIndex = ref([0])

const updateFilters = (key: keyof typeof props.filters, value: any) => {
  emit('update:filters', {
    ...props.filters,
    [key]: value,
  })
}

const resetFilters = () => {
  emit('reset-filters')
}
</script>

<template>
  <div class="flex flex-column gap-4">
    <Accordion
      v-model:activeIndex="activeIndex"
      multiple
    >
      <!-- Catégories -->
      <div class="accordion-item">
        <div class="accordion-header">
          <span>Catégories</span>
          <i class="pi pi-chevron-down"></i>
        </div>
        <div class="accordion-content">
          <div class="flex flex-column gap-2">
            <Select
              v-model="filters.categories"
              :options="options.categories"
              multiple
              placeholder="Sélectionner des catégories"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Régimes alimentaires -->
      <div class="accordion-item">
        <div class="accordion-header">
          <span>Régimes alimentaires</span>
          <i class="pi pi-chevron-down"></i>
        </div>
        <div class="accordion-content">
          <div class="flex flex-column gap-2">
            <Select
              v-model="filters.diets"
              :options="options.diets"
              multiple
              placeholder="Sélectionner des régimes"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Prix -->
      <div class="accordion-item">
        <div class="accordion-header">
          <span>Prix</span>
          <i class="pi pi-chevron-down"></i>
        </div>
        <div class="accordion-content">
          <div class="flex flex-column gap-2">
            <Slider
              v-model="filters.priceRange"
              range
              :min="0"
              :max="100"
              class="w-full"
            />
            <div class="flex justify-content-between text-sm">
              <span>{{ filters.priceRange[0] }}€</span>
              <span>{{ filters.priceRange[1] }}€</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Saison -->
      <div class="accordion-item">
        <div class="accordion-header">
          <span>Saison</span>
          <i class="pi pi-chevron-down"></i>
        </div>
        <div class="accordion-content">
          <div class="flex flex-column gap-2">
            <Select
              v-model="filters.season"
              :options="options.seasons"
              multiple
              placeholder="Sélectionner des saisons"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Région -->
      <div class="accordion-item">
        <div class="accordion-header">
          <span>Région</span>
          <i class="pi pi-chevron-down"></i>
        </div>
        <div class="accordion-content">
          <div class="flex flex-column gap-2">
            <Select
              v-model="filters.region"
              :options="options.regions"
              multiple
              placeholder="Sélectionner des régions"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </Accordion>

    <!-- Disponibilité -->
    <div class="flex align-items-center gap-2">
      <Checkbox
        v-model="filters.availability"
        :binary="true"
        inputId="availability"
      />
      <label
        for="availability"
        class="cursor-pointer"
        >En stock uniquement</label
      >
    </div>

    <!-- Bouton réinitialiser -->
    <Button
      label="Réinitialiser les filtres"
      severity="secondary"
      @click="resetFilters"
      class="w-full"
    />
  </div>
</template>

<style scoped>
.accordion-item {
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
}

.accordion-header {
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--surface-card);
  border-radius: var(--border-radius);
}

.accordion-content {
  padding: 1rem;
  background-color: var(--surface-ground);
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}
</style>
