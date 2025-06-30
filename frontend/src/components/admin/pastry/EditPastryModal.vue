<script setup lang="ts">
import type { Pastry } from '@/types'
import DietIcon from '@/components/DietIcon.vue'
import { DIET_CONFIG } from '@/constants/diets'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { pastryService } from '@/services/pastry.service'
import { API_URL } from '@/constants/api'
import axios from 'axios'

interface Props {
  visible: boolean
  pastry: Pastry | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', pastry: Pastry): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// État d'édition pour chaque champ
const editingState = reactive({
  name: false,
  description: false,
  price: false,
  stockCount: false,
  category: false,
  diets: false,
  nutrition: false,
  allergens: false,
  ingredients: false,
  tags: false
})

// Données éditables
const editableData = ref<{
  name?: string
  description?: string
  price?: number
  stockCount?: number
  category?: string
  tags?: string[]
  ingredients?: string[]
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    allergens: string[]
  }
  diets?: string[]
}>({})

// Données pour les sélecteurs
const categories = ref<{ label: string; value: string }[]>([])
const availableDiets = ref<{ label: string; value: string }[]>([])

// Options pour les tags
const tagOptions = ref([
  { label: 'Nouveau', value: 'new' },
  { label: 'Populaire', value: 'popular' }
])

// Variable pour le nouvel allergène
const newAllergen = ref('')

// Variable pour le nouvel ingrédient
const newIngredient = ref('')

// Charger les catégories depuis l'API
const loadCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`)
    categories.value = response.data.map((cat: { id: string; name: string }) => ({
      label: cat.name,
      value: cat.id
    }))
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

// Charger les régimes depuis l'API
const loadDiets = async () => {
  try {
    const response = await axios.get(`${API_URL}/diets`)
    availableDiets.value = response.data.map((diet: { id: string; name: string }) => ({
      label: diet.name,
      value: diet.id
    }))
  } catch (error) {
    console.error('Error loading diets:', error)
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadCategories()
  loadDiets()
})

// Vérifier si on est en mode édition
const isEditing = computed(() => {
  return Object.values(editingState).some(state => state)
})

// Ajuster le line-clamp de la description selon l'état d'édition
const descriptionLineClamp = computed(() => {
  const editingFields = ['name', 'price', 'stockCount', 'category']
  const isEditingMainFields = editingFields.some(field => editingState[field as keyof typeof editingState])
  
  return isEditingMainFields ? 'line-clamp-6-custom' : 'line-clamp-7-custom'
})

// Initialiser les données éditables quand le pastry change
const initializeEditableData = () => {
  if (props.pastry) {
    console.log('Initializing editable data with pastry:', props.pastry)
    editableData.value = {
      name: props.pastry.name,
      description: props.pastry.description,
      price: props.pastry.price,
      stockCount: props.pastry.stockCount,
      category: props.pastry.category.id,
      tags: [...(props.pastry.tags || [])],
      ingredients: [...(props.pastry.ingredients || [])],
      nutrition: props.pastry.nutrition ? { ...props.pastry.nutrition } : undefined,
      diets: props.pastry.diets?.map(diet => diet.id) || []
    }
    console.log('Editable data initialized:', editableData.value)
  }
}

// Gérer l'édition d'un champ
const startEditing = (field: keyof typeof editingState) => {
  // Fermer tous les autres champs en édition
  Object.keys(editingState).forEach(key => {
    if (key !== field) {
      editingState[key as keyof typeof editingState] = false
    }
  })
  // Ouvrir le champ sélectionné
  editingState[field] = true
}

const stopEditing = (field: keyof typeof editingState) => {
  editingState[field] = false
}

const saveField = (field: keyof typeof editingState) => {
  editingState[field] = false
  // Ici on pourrait sauvegarder le champ individuellement
}

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

const handleSave = () => {
  if (props.pastry && editableData.value) {
    const updatedPastry = {
      ...props.pastry,
      name: editableData.value.name || props.pastry.name,
      description: editableData.value.description || props.pastry.description,
      price: editableData.value.price || props.pastry.price,
      stockCount: editableData.value.stockCount || props.pastry.stockCount,
      category: editableData.value.category ? 
        categories.value.find(cat => cat.value === editableData.value.category)?.label || props.pastry.category.name :
        props.pastry.category,
      tags: editableData.value.tags || props.pastry.tags,
      ingredients: editableData.value.ingredients || props.pastry.ingredients,
      nutrition: editableData.value.nutrition || props.pastry.nutrition,
      diets: editableData.value.diets ? 
        availableDiets.value.filter(diet => editableData.value.diets?.includes(diet.value)) :
        props.pastry.diets
    }
    emit('save', updatedPastry as Pastry)
    emit('update:visible', false)
  }
}

const handleCancel = () => {
  initializeEditableData()
  // Réinitialiser tous les états d'édition
  Object.keys(editingState).forEach(key => {
    editingState[key as keyof typeof editingState] = false
  })
}

// Initialiser les données quand le modal s'ouvre
watch(() => props.visible, (newVisible) => {
  if (newVisible && props.pastry) {
    initializeEditableData()
  }
})

// Initialiser les données quand le pastry change
watch(() => props.pastry, (newPastry) => {
  if (newPastry) {
    initializeEditableData()
  }
}, { immediate: true })

// Fonction pour ajouter un allergène
const addAllergen = () => {
  if (newAllergen.value.trim() && editableData.value.nutrition) {
    editableData.value.nutrition.allergens.push(newAllergen.value.trim())
    newAllergen.value = ''
  }
}

// Fonction pour ajouter un ingrédient
const addIngredient = () => {
  if (newIngredient.value.trim() && editableData.value.ingredients) {
    editableData.value.ingredients.push(newIngredient.value.trim())
    newIngredient.value = ''
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Modifier le produit"
    :style="{ width: '70rem' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
    @update:visible="(value) => emit('update:visible', value)"
  >
    <div v-if="pastry && editableData" class="p-4">
      <!-- En-tête avec image et infos principales -->
      <div class="flex gap-6 h-25rem mb-4">
        <!-- Image du produit -->
        <div class="w-25rem border-round overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            :src="pastry.images && pastry.images.length > 0 ? pastry.images[0] : '/no-image.svg'"
            :alt="pastry.name"
            class="modal-product-image"
            @error="(e) => (e.target as HTMLImageElement).src = '/no-image.svg'"
          />
        </div>
        
        <!-- Informations principales -->
        <div class="flex-1 overflow-hidden flex flex-column">
          <!-- Nom du produit -->
          <div class="mb-4">
            <div v-if="!editingState.name" class="flex align-items-center gap-2">
              <h2 class="text-3xl font-bold text-900 m-0 overflow-hidden text-ellipsis whitespace-nowrap">{{ pastry.name }}</h2>
              <Button
                icon="pi pi-pencil"
                text
                size="small"
                @click="startEditing('name')"
                class="p-button-text flex-shrink-0"
              />
            </div>
            <div v-else class="flex align-items-center gap-2">
              <InputText
                :model-value="editableData.name"
                @update:model-value="(value) => editableData.name = value"
                class="flex-1"
                @keyup.enter="saveField('name')"
                @keyup.esc="stopEditing('name')"
                autofocus
              />
            </div>
          </div>
          
          <!-- Description -->
          <div class="mb-4">
            <div v-if="!editingState.description" class="flex align-items-start gap-2">
              <p class="text-600 text-lg leading-relaxed m-0 flex-1 overflow-hidden text-ellipsis" :class="descriptionLineClamp">{{ pastry.description }}</p>
              <Button
                icon="pi pi-pencil"
                text
                size="small"
                @click="startEditing('description')"
                class="p-button-text flex-shrink-0"
              />
            </div>
            <div v-else class="flex align-items-start gap-2">
              <Textarea
                :model-value="editableData.description"
                @update:model-value="(value) => editableData.description = value"
                class="flex-1"
                rows="7"
                @keyup.esc="stopEditing('description')"
                autofocus
              />
            </div>
          </div>
          
          <!-- Spacer pour pousser les infos vers le bas -->
          <div class="flex-1"></div>
          
          <!-- Prix, stock, catégorie -->
          <div class="flex flex-column gap-2">
            <!-- Prix -->
            <div class="flex align-items-center gap-2">
              <div v-if="!editingState.price" class="flex align-items-center gap-2">
                <span class="text-2xl font-bold text-900">{{ formatPrice(pastry.price) }}</span>
                <Button
                  icon="pi pi-pencil"
                  text
                  size="small"
                  @click="startEditing('price')"
                  class="p-button-text"
                />
              </div>
              <div v-else class="flex align-items-center gap-2">
                <InputNumber
                  :model-value="editableData.price"
                  @update:model-value="(value) => editableData.price = value"
                  mode="currency"
                  currency="EUR"
                  locale="fr-FR"
                  class="text-2xl font-bold"
                  @keyup.enter="saveField('price')"
                  @keyup.esc="stopEditing('price')"
                  autofocus
                />
              </div>
            </div>
            
            <!-- Stock -->
            <div class="flex align-items-center gap-2">
              <i class="pi pi-box text-500"></i>
              <div v-if="!editingState.stockCount" class="flex align-items-center gap-2">
                <Tag
                  :value="pastry.stockCount.toString()"
                  :severity="
                    pastry.stockCount > 10 ? 'success' :
                    pastry.stockCount >= 3 ? 'warn' : 'danger'
                  "
                />
                <span>en stock</span>
                <Button
                  icon="pi pi-pencil"
                  text
                  size="small"
                  @click="startEditing('stockCount')"
                  class="p-button-text"
                />
              </div>
              <div v-else class="flex align-items-center gap-2">
                <InputNumber
                  :model-value="editableData.stockCount"
                  @update:model-value="(value) => editableData.stockCount = value"
                  class="w-6rem"
                  @keyup.enter="saveField('stockCount')"
                  @keyup.esc="stopEditing('stockCount')"
                  autofocus
                />
                <span>en stock</span>
              </div>
            </div>
            
            <!-- Catégorie -->
            <div class="flex align-items-center gap-2">
              <i class="pi pi-tag text-500"></i>
              <div v-if="!editingState.category" class="flex align-items-center gap-2">
                <span class="text-600 text-lg">{{ pastry.category.name }}</span>
                <Button
                  icon="pi pi-pencil"
                  text
                  size="small"
                  @click="startEditing('category')"
                  class="p-button-text"
                />
              </div>
              <div v-else class="flex align-items-center gap-2">
                <Dropdown
                  v-model="editableData.category"
                  :options="categories"
                  option-label="label"
                  option-value="value"
                  placeholder="Sélectionner une catégorie"
                  class="w-12rem"
                  @change="saveField('category')"
                  @keyup.esc="stopEditing('category')"
                  autofocus
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Accordéon avec les détails -->
      <Accordion :value="['0', '1', '2', '3', '4']" multiple>
        <!-- Régimes alimentaires -->
        <AccordionTab value="0">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <span>Régimes alimentaires</span>
              <Button
                v-if="!editingState.diets"
                icon="pi pi-pencil"
                text
                size="small"
                @click.stop="startEditing('diets')"
                class="p-button-text"
              />
            </div>
          </template>
          <div class="p-3">
            <div v-if="!editingState.diets" class="flex gap-2 flex-wrap">
              <DietIcon
                v-for="diet in pastry.diets"
                :diet-name="DIET_CONFIG[diet.name]?.dietName"
                :key="diet.id"
                :label="diet.name"
              />
            </div>
            <div v-else class="flex align-items-center gap-2">
              <MultiSelect
                v-model="editableData.diets"
                :options="availableDiets"
                option-label="label"
                option-value="value"
                placeholder="Sélectionner les régimes"
                class="flex-1"
                @change="saveField('diets')"
                @keyup.esc="stopEditing('diets')"
                autofocus
              />
            </div>
          </div>
        </AccordionTab>

        <!-- Tags -->
        <AccordionTab value="1" v-if="editableData.tags && editableData.tags.length > 0">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <span>Tags</span>
              <Button
                v-if="!editingState.tags"
                icon="pi pi-pencil"
                text
                size="small"
                @click.stop="startEditing('tags')"
                class="p-button-text"
              />
            </div>
          </template>
          <div class="p-3">
            <div v-if="!editingState.tags" class="flex gap-2 flex-wrap">
              <Tag
                v-for="tag in formatTags(pastry.tags)"
                :key="tag.value"
                :value="tag.label"
                :severity="getTagSeverity(tag.value)"
              />
            </div>
            <div v-else class="flex align-items-center gap-2">
              <Select
                v-model="editableData.tags"
                :options="tagOptions"
                option-label="label"
                option-value="value"
                placeholder="Sélectionner un tag"
                class="flex-1"
                @change="saveField('tags')"
                @keyup.esc="stopEditing('tags')"
                autofocus
              />
            </div>
          </div>
        </AccordionTab>

        <!-- Ingrédients -->
        <AccordionTab value="2">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <span>Ingrédients</span>
              <Button
                v-if="!editingState.ingredients"
                icon="pi pi-pencil"
                text
                size="small"
                @click.stop="startEditing('ingredients')"
                class="p-button-text"
              />
            </div>
          </template>
          <div class="p-3">
            <div v-if="!editingState.ingredients" class="flex gap-2 flex-wrap">
              <Tag
                v-for="(ingredient, index) in pastry.ingredients" 
                :key="index"
                :value="ingredient"
                severity="secondary"
              />
            </div>
            <div v-else class="flex align-items-start gap-2">
              <div class="flex-1">
                <div class="flex gap-2 flex-wrap mb-3">
                  <div 
                    v-for="(ingredient, index) in editableData.ingredients" 
                    :key="index"
                    class="flex align-items-center gap-1 surface-100 border-round px-2 py-1 cursor-pointer hover:surface-200"
                    @click="() => {
                      if (editableData.ingredients) {
                        editableData.ingredients = editableData.ingredients.filter((_, i) => i !== index)
                      }
                    }"
                  >
                    <i class="pi pi-times text-500 text-sm"></i>
                    <span class="text-600">{{ ingredient }}</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <InputText
                    v-model="newIngredient"
                    placeholder="Ajouter un ingrédient"
                    class="flex-1"
                    @keyup.enter="addIngredient"
                    @keyup.esc="stopEditing('ingredients')"
                  />
                  <Button
                    label="Ajouter"
                    size="small"
                    @click="addIngredient"
                  />
                </div>
              </div>
            </div>
          </div>
        </AccordionTab>

        <!-- Allergènes -->
        <AccordionTab value="3">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <span>Allergènes</span>
              <Button
                v-if="!editingState.allergens"
                icon="pi pi-pencil"
                text
                size="small"
                @click.stop="startEditing('allergens')"
                class="p-button-text"
              />
            </div>
          </template>
          <div class="p-3">
            <div v-if="!editingState.allergens" class="flex gap-2 flex-wrap">
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
            <div v-else class="flex align-items-start gap-2">
              <div class="flex-1">
                <div class="flex gap-2 flex-wrap mb-3">
                  <div 
                    v-for="(allergen, index) in editableData.nutrition?.allergens || []" 
                    :key="index"
                    class="flex align-items-center gap-1 surface-100 border-round px-2 py-1 cursor-pointer hover:surface-200"
                    @click="() => {
                      if (editableData.nutrition) {
                        editableData.nutrition.allergens = editableData.nutrition.allergens.filter((_, i) => i !== index)
                      }
                    }"
                  >
                    <i class="pi pi-times text-500 text-sm"></i>
                    <span class="text-600">{{ allergen }}</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <InputText
                    v-model="newAllergen"
                    placeholder="Ajouter un allergène"
                    class="flex-1"
                    @keyup.enter="addAllergen"
                    @keyup.esc="stopEditing('allergens')"
                  />
                  <Button
                    label="Ajouter"
                    size="small"
                    @click="addAllergen"
                  />
                </div>
              </div>
            </div>
          </div>
        </AccordionTab>

        <!-- Valeurs nutritionnelles -->
        <AccordionTab value="4" v-if="editableData.nutrition">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <span>Valeurs nutritionnelles (pour 100g)</span>
              <Button
                v-if="!editingState.nutrition"
                icon="pi pi-pencil"
                text
                size="small"
                @click.stop="startEditing('nutrition')"
                class="p-button-text"
              />
            </div>
          </template>
          <div class="p-3">
            <div v-if="!editingState.nutrition" class="flex-1">
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
                          {{ editableData.nutrition.calories }} kcal
                        </td>
                        <td class="p-3 text-center border-right-1 surface-border">
                          {{ editableData.nutrition.fat }}g
                        </td>
                        <td class="p-3 text-center border-right-1 surface-border">
                          {{ editableData.nutrition.carbs }}g
                        </td>
                        <td class="p-3 text-center">
                          {{ editableData.nutrition.protein }}g
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div v-else class="flex align-items-start gap-2">
              <div class="flex-1">
                <div class="surface-card border-round p-4">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="flex flex-column gap-2">
                      <label class="font-medium text-900">Énergie (kcal)</label>
                      <InputNumber
                        :model-value="editableData.nutrition?.calories"
                        @update:model-value="(value) => editableData.nutrition && (editableData.nutrition.calories = value)"
                        class="w-full"
                        @keyup.esc="stopEditing('nutrition')"
                        autofocus
                      />
                    </div>
                    <div class="flex flex-column gap-2">
                      <label class="font-medium text-900">Matières grasses (g)</label>
                      <InputNumber
                        :model-value="editableData.nutrition?.fat"
                        @update:model-value="(value) => editableData.nutrition && (editableData.nutrition.fat = value)"
                        class="w-full"
                        @keyup.esc="stopEditing('nutrition')"
                      />
                    </div>
                    <div class="flex flex-column gap-2">
                      <label class="font-medium text-900">Glucides (g)</label>
                      <InputNumber
                        :model-value="editableData.nutrition?.carbs"
                        @update:model-value="(value) => editableData.nutrition && (editableData.nutrition.carbs = value)"
                        class="w-full"
                        @keyup.esc="stopEditing('nutrition')"
                      />
                    </div>
                    <div class="flex flex-column gap-2">
                      <label class="font-medium text-900">Protéines (g)</label>
                      <InputNumber
                        :model-value="editableData.nutrition?.protein"
                        @update:model-value="(value) => editableData.nutrition && (editableData.nutrition.protein = value)"
                        class="w-full"
                        @keyup.esc="stopEditing('nutrition')"
                      />
                    </div>
                  </div>
                </div>
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
      <Button 
        label="Annuler" 
        icon="pi pi-times" 
        text
        @click="handleCancel"
        v-if="isEditing"
      />
      <Button 
        label="Enregistrer" 
        icon="pi pi-check" 
        @click="handleSave"
        v-if="isEditing"
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

.line-clamp-7-custom {
  display: -webkit-box;
  line-clamp: 7;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-6-custom {
  display: -webkit-box;
  line-clamp: 6;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 