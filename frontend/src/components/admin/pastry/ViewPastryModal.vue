<script setup lang="ts">
import type { Pastry } from '@/types'
import DietIcon from '@/components/DietIcon.vue'
import { DIET_CONFIG } from '@/constants/diets'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

interface Props {
  visible: boolean
  pastry: Pastry | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'edit', pastry: Pastry): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatTags = (tags: string[]) => {
  if (!tags || tags.length === 0) return []
  
  const tagMap: { [key: string]: string } = {
    'popular': 'Populaire',
    'new': 'Nouveau',
    'sale': 'Promo',
    'featured': 'Mis en avant'
  }
  
  return tags.map(tag => ({
    value: tag,
    label: tagMap[tag] || tag
  }))
}

const getTagSeverity = (tag: string) => {
  const severityMap: { [key: string]: string } = {
    'popular': 'success',
    'new': 'info',
    'sale': 'warning',
    'featured': 'help'
  }
  return severityMap[tag] || 'none'
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleEdit = () => {
  if (props.pastry) {
    emit('edit', props.pastry)
    emit('update:visible', false)
  }
}

const handleViewProduct = () => {
  if (props.pastry) {
    window.open(`/pastries/${props.pastry.slug}`, '_blank')
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Détails du produit"
    :style="{ width: '70rem' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
    @update:visible="handleClose"
  >
    <div v-if="pastry" class="p-4">
      <!-- En-tête avec image et infos principales -->
      <div class="flex gap-6">
        <!-- Image du produit -->
        <div class="w-25rem h-25rem border-round overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            :src="pastry.images && pastry.images.length > 0 ? pastry.images[0] : '/no-image.svg'"
            :alt="pastry.name"
            class="modal-product-image"
            @error="(e) => (e.target as HTMLImageElement).src = '/no-image.svg'"
          />
        </div>
        
        <!-- Informations principales -->
        <div class="flex-1">
          <div class="flex align-items-center gap-3 mb-3">
            <h2 class="text-3xl font-bold text-900 m-0">{{ pastry.name }}</h2>
            <Button
              label="Voir sur le site"
              icon="pi pi-arrow-right"
              class="p-button-outlined"
              @click="handleViewProduct"
              title="Voir le produit sur le site client"
            />
          </div>
          
          <p class="text-600 text-lg mb-4 leading-relaxed">{{ pastry.description }}</p>
          
          <!-- Prix et stock -->
          <div class="flex flex-column gap-2 mb-4">
            <div class="flex align-items-center gap-2">
              <span class="text-2xl font-bold text-900">{{ formatPrice(pastry.price) }}</span>
            </div>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-box text-500"></i>
              <Tag
                :value="pastry.stockCount.toString()"
                :severity="
                  pastry.stockCount > 10 ? 'success' :
                  pastry.stockCount >= 3 ? 'warn' : 'danger'
                "
              />
              <span>en stock</span>
            </div>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-tag text-500"></i>
              <span class="text-600 text-lg">{{ pastry.category.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Accordéon avec les détails -->
      <Accordion :value="['0', '1', '2', '3', '4']" multiple>
        <!-- Régimes alimentaires -->
        <AccordionTab value="0">
          <template #header>
            <span>Régimes alimentaires</span>
          </template>
          <div class="p-3">
            <div class="flex gap-2 flex-wrap">
              <DietIcon
                v-for="diet in pastry.diets"
                :diet-name="DIET_CONFIG[diet.name]?.dietName"
                :key="diet.id"
                :label="diet.name"
              />
            </div>
          </div>
        </AccordionTab>

        <!-- Tags -->
        <AccordionTab value="1" v-if="pastry.tags && pastry.tags.length > 0">
          <template #header>
            <span>Tags</span>
          </template>
          <div class="p-3">
            <div class="flex gap-2 flex-wrap">
              <Tag
                v-for="tag in formatTags(pastry.tags)"
                :key="tag.value"
                :value="tag.label"
                :severity="getTagSeverity(tag.value)"
              />
            </div>
          </div>
        </AccordionTab>

        <!-- Ingrédients -->
        <AccordionTab value="2">
          <template #header>
            <span>Ingrédients</span>
          </template>
          <div class="p-3">
            <div class="flex gap-2 flex-wrap">
              <Tag
                v-for="(ingredient, index) in pastry.ingredients" 
                :key="index"
                :value="ingredient"
                severity="secondary"
              />
            </div>
          </div>
        </AccordionTab>

        <!-- Allergènes -->
        <AccordionTab value="3">
          <template #header>
            <span>Allergènes</span>
          </template>
          <div class="p-3">
            <div class="flex gap-2 flex-wrap">
              <Tag
                v-for="(allergen, index) in pastry.nutrition?.allergens || []" 
                :key="index"
                :value="allergen"
                severity="secondary"
              />
              <div v-if="!pastry.nutrition?.allergens || pastry.nutrition.allergens.length === 0" class="text-500 italic">
                Aucun allergène déclaré
              </div>
            </div>
          </div>
        </AccordionTab>

        <!-- Valeurs nutritionnelles -->
        <AccordionTab value="4" v-if="pastry.nutrition">
          <template #header>
            <span>Valeurs nutritionnelles (pour 100g)</span>
          </template>
          <div class="p-3">
            <div class="surface-card border-round">
              <div class="overflow-x-auto">
                <table class="w-auto border-round overflow-hidden border-1 surface-border min-w-full">
                  <thead>
                    <tr>
                      <th class="text-center p-3 font-medium border-right-1 surface-border border-bottom-1 surface-border">
                        Énergie
                      </th>
                      <th class="text-center p-3 font-medium border-right-1 surface-border border-bottom-1 surface-border">
                        Matières grasses
                      </th>
                      <th class="text-center p-3 font-medium border-right-1 surface-border border-bottom-1 surface-border">
                        Glucides
                      </th>
                      <th class="text-center p-3 font-medium border-bottom-1 surface-border">
                        Protéines
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="p-3 text-center border-right-1 surface-border">
                        {{ pastry.nutrition.calories }} kcal
                      </td>
                      <td class="p-3 text-center border-right-1 surface-border">
                        {{ pastry.nutrition.fat }}g
                      </td>
                      <td class="p-3 text-center border-right-1 surface-border">
                        {{ pastry.nutrition.carbs }}g
                      </td>
                      <td class="p-3 text-center">
                        {{ pastry.nutrition.protein }}g
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </AccordionTab>
      </Accordion>

      <!-- Section des images supplémentaires -->
      <div v-if="pastry.images && pastry.images.length > 1" class="mt-6">
        <h3 class="text-xl font-semibold text-900 mb-3">Images supplémentaires</h3>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <div 
            v-for="(image, index) in pastry.images.slice(1)" 
            :key="index"
            class="w-8rem h-8rem border-round overflow-hidden bg-gray-100 flex-shrink-0"
          >
            <img
              :src="image"
              :alt="`${pastry.name} - Image ${index + 2}`"
              class="w-full h-full object-cover"
              @error="(e) => (e.target as HTMLImageElement).src = '/no-image.svg'"
            />
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <Button label="Fermer" text @click="handleClose" />
      <Button 
        label="Modifier" 
        icon="pi pi-pencil" 
        @click="handleEdit"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.modal-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 