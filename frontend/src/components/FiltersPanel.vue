<script setup lang="ts">
import { ref, computed } from 'vue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
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

const selectedCategories = ref<string[]>(props.filters.categories)

// Génère dynamiquement les valeurs pour ouvrir tous les panneaux
const defaultOpenPanels = computed(() => {
  // Nombre de panneaux dans l'accordion (3 actuellement)
  const panelCount = 3
  return Array.from({ length: panelCount }, (_, i) => i.toString())
})

const updateFilters = (key: keyof typeof props.filters, value: any) => {
  emit('update:filters', {
    ...props.filters,
    [key]: value,
  })
}

const toggleFilter = (key: keyof typeof props.filters, value: string) => {
  const currentArray = [...(props.filters[key] as string[])]
  const index = currentArray.indexOf(value)

  if (index > -1) {
    currentArray.splice(index, 1)
  } else {
    currentArray.push(value)
  }

  updateFilters(key, currentArray)
}

const resetFilters = () => {
  emit('reset-filters')
}
</script>

<template>
  <div class="flex flex-column gap-4">
    <Accordion
      :value="defaultOpenPanels"
      multiple
    >
      <!-- Catégories -->
      <AccordionPanel value="0">
        <AccordionHeader>Catégories</AccordionHeader>
        <AccordionContent>
          <div class="flex flex-column gap-2">
            <div
              v-for="category of options.categories"
              :key="category"
              class="flex align-items-center"
            >
              <Checkbox
                v-model="selectedCategories"
                :inputId="`category-${category}`"
                name="category"
                :value="category"
              />
              <label
                :for="`category-${category}`"
                class="pl-2 cursor-pointer"
                >{{ category }}</label
              >
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>

      <!-- Régimes alimentaires -->
      <AccordionPanel value="1">
        <AccordionHeader>Régimes alimentaires</AccordionHeader>
        <AccordionContent>
          <div class="flex flex-column gap-2">
            <div
              v-for="diet in options.diets"
              :key="diet"
              class="flex align-items-center"
            >
              <Checkbox
                :modelValue="filters.diets.includes(diet)"
                @update:modelValue="() => toggleFilter('diets', diet)"
                :inputId="`diet-${diet}`"
              />
              <label
                :for="`diet-${diet}`"
                class="ml-2 cursor-pointer"
              >
                {{ diet }}
              </label>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>

      <!-- Prix -->
      <AccordionPanel value="2">
        <AccordionHeader>Prix</AccordionHeader>
        <AccordionContent>
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
        </AccordionContent>
      </AccordionPanel>
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
