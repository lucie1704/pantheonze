<script setup lang="ts">
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
    season: string
    region: string
    availability: boolean
  }
  options: FilterOptions
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:filters', filters: Props['filters']): void
}>()
</script>

<template>
  <!-- Catégories -->
  <div class="mb-4">
    <h3 class="text-xl mb-2">Catégories</h3>
    <div class="flex flex-column gap-2">
      <div
        v-for="category in props.options.categories"
        :key="category"
        class="flex align-items-center p-2 hover:surface-hover border-round transition-colors transition-duration-150 cursor-pointer"
      >
        <Checkbox
          v-model="props.filters.categories"
          :value="category"
          :inputId="category"
        />
        <label
          :for="category"
          class="ml-2"
          >{{ category }}</label
        >
      </div>
    </div>
  </div>

  <!-- Régimes alimentaires -->
  <div class="mb-4">
    <h3 class="text-xl mb-2">Régimes alimentaires</h3>
    <div class="flex flex-column gap-2">
      <div
        v-for="diet in props.options.diets"
        :key="diet"
        class="flex align-items-center p-2 hover:surface-hover border-round transition-colors transition-duration-150 cursor-pointer"
      >
        <Checkbox
          v-model="props.filters.diets"
          :value="diet"
          :inputId="diet"
        />
        <label
          :for="diet"
          class="ml-2"
          >{{ diet }}</label
        >
      </div>
    </div>
  </div>

  <!-- Prix -->
  <div class="mb-4">
    <h3 class="text-xl mb-2">Prix</h3>
    <Slider
      v-model="props.filters.priceRange"
      range
      class="mt-3"
    />
    <div class="flex justify-content-between mt-2">
      <span>{{ props.filters.priceRange[0] }}€</span>
      <span>{{ props.filters.priceRange[1] }}€</span>
    </div>
  </div>

  <!-- Saison -->
  <div class="mb-4">
    <h3 class="text-xl mb-2">Saison</h3>
    <Dropdown
      v-model="props.filters.season"
      :options="props.options.seasons"
      placeholder="Sélectionner une saison"
      class="w-full"
    />
  </div>

  <!-- Région -->
  <div class="mb-4">
    <h3 class="text-xl mb-2">Région</h3>
    <Dropdown
      v-model="props.filters.region"
      :options="props.options.regions"
      placeholder="Sélectionner une région"
      class="w-full"
    />
  </div>

  <!-- Disponibilité -->
  <div class="mb-4">
    <div
      class="flex align-items-center p-2 hover:surface-hover border-round transition-colors transition-duration-150 cursor-pointer"
    >
      <Checkbox
        v-model="props.filters.availability"
        inputId="availability"
        binary
      />
      <label
        for="availability"
        class="ml-2"
        >En stock uniquement</label
      >
    </div>
  </div>
</template>
