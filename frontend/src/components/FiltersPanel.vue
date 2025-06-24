<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Slider from 'primevue/slider'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import axios from 'axios'
import { API_URL } from '@/constants/api.ts'
import type { Filter } from '@/types'

const props = defineProps<{
  filters: Filter
}>()
const emit = defineEmits<{
  (e: 'update:filters', value: Filter): void
  (e: 'reset-filters'): void
}>()

const { filters } = toRefs(props)
const categories = ref<string[]>([])
const diets = ref<string[]>([])

onMounted(async () => {
  const categoriesResponse = await axios.get(`${API_URL}/categories`)
  categories.value = categoriesResponse.data.map((category: { name: string }) => category.name)

  const dietsResponse = await axios.get(`${API_URL}/diets`)
  diets.value = dietsResponse.data.map((diet: { name: string }) => diet.name)
})

const resetFilters = () => {
  emit('reset-filters')
}
</script>

<template>
  <div class="flex flex-column gap-4">
    <Accordion
      :value="['0', '1', '2']"
      multiple
    >
      <!-- Catégories -->
      <AccordionPanel value="0">
        <AccordionHeader>Catégories</AccordionHeader>
        <AccordionContent>
          <div class="flex flex-column gap-2">
            <div
              v-for="category of categories"
              :key="category"
              class="flex align-items-center"
            >
              <Checkbox
                v-model="filters.categories"
                :inputId="`category-${category}`"
                name="category"
                :value="category"
                @change="emit('update:filters', filters)"
              />
              <label
                :for="`category-${category}`"
                class="pl-2 cursor-pointer"
              >
                {{ category }}
              </label>
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
              v-for="diet in diets"
              :key="diet"
              class="flex align-items-center"
            >
              <Checkbox
                v-model="filters.diets"
                :inputId="`diet-${diet}`"
                name="diet"
                :value="diet"
                @change="emit('update:filters', filters)"
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
              :max="40"
              :step="1"
              class="w-full"
              @change="emit('update:filters', filters)"
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
        @change="emit('update:filters', filters)"
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
