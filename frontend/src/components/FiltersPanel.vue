<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

interface FilterOptions {
  categories: string[]
  diets: string[]
  seasons: string[]
  regions: string[]
}

interface Props {
  filters: {
    categories: string[]
    diets: string[]
    priceRange: [number, number]
    season: string[]
    region: string[]
    availability: boolean
  }
  options: FilterOptions
}

const props = defineProps<Props>()
defineEmits<{
  (e: 'update:filters', filters: Props['filters']): void
}>()

const activeIndexes = [0, 1]
</script>

<template>
  <Accordion
    :multiple="true"
    v-model:activeIndex="activeIndexes"
  >
    <!-- Catégories -->
    <AccordionTab header="Catégories">
      <div class="flex flex-column gap-2">
        <div
          v-for="category in props.options.categories"
          :key="category"
          class="flex align-items-center py-1 border-round transition-colors transition-duration-150 cursor-pointer"
        >
          <Checkbox
            v-model="props.filters.categories"
            :value="category"
            :inputId="category"
          />
          <label
            :for="category"
            class="ml-2 text-900"
          >
            {{ category }}
          </label>
        </div>
      </div>
    </AccordionTab>

    <!-- Régimes alimentaires -->
    <AccordionTab header="Régimes">
      <div class="flex flex-column gap-2">
        <div
          v-for="diet in props.options.diets"
          :key="diet"
          class="flex align-items-center py-1 border-round transition-colors transition-duration-150 cursor-pointer"
        >
          <Checkbox
            v-model="props.filters.diets"
            :value="diet"
            :inputId="diet"
          />
          <label
            :for="diet"
            class="ml-2 text-900"
          >
            {{ diet }}
          </label>
        </div>
      </div>
    </AccordionTab>

    <!-- Prix -->
    <AccordionTab header="Prix">
      <Slider
        v-model="props.filters.priceRange"
        range
        class="mt-3"
      />
      <div class="flex justify-content-between mt-2 text-900">
        <span>{{ props.filters.priceRange[0] }}€</span>
        <span>{{ props.filters.priceRange[1] }}€</span>
      </div>
    </AccordionTab>

    <!-- Saison -->
    <AccordionTab header="Saison">
      <div class="flex flex-column gap-2">
        <div
          v-for="season in props.options.seasons"
          :key="season"
          class="flex align-items-center py-1 border-round transition-colors transition-duration-150 cursor-pointer"
        >
          <Checkbox
            v-model="props.filters.season"
            :value="season"
            :inputId="season"
          />
          <label
            :for="season"
            class="ml-2 text-900"
          >
            {{ season }}
          </label>
        </div>
      </div>
    </AccordionTab>

    <!-- Région -->
    <AccordionTab header="Région">
      <div class="flex flex-column gap-2">
        <div
          v-for="region in props.options.regions"
          :key="region"
          class="flex align-items-center py-1 border-round transition-colors transition-duration-150 cursor-pointer"
        >
          <Checkbox
            v-model="props.filters.region"
            :value="region"
            :inputId="region"
          />
          <label
            :for="region"
            class="ml-2 text-900"
          >
            {{ region }}
          </label>
        </div>
      </div>
    </AccordionTab>
  </Accordion>

  <!-- Disponibilité -->
  <div class="flex align-items-center py-4 border-round transition-colors transition-duration-150 cursor-pointer">
    <Checkbox
      v-model="props.filters.availability"
      inputId="availability"
      binary
    />
    <label
      for="availability"
      class="ml-2 text-900"
    >
      En stock uniquement
    </label>
  </div>
</template>
