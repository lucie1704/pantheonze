<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { API_URL } from '@/constants/api'
import { DIET_CONFIG } from '@/constants/diets'
import type { Pastry } from '@/types'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', pastry: Partial<Pastry>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const toast = useToast()

// État de chargement
const isSaving = ref(false)

// Données du formulaire
const formData = ref({
  name: '',
  description: '',
  price: 0,
  stockCount: 0,
  category: '',
  tags: [] as string[],
  ingredients: [] as string[],
  nutrition: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    allergens: [] as string[]
  },
  diets: [] as string[]
})

// Options pour les selects
const categories = ref<{ label: string; value: string }[]>([])
const availableDiets = ref<{ label: string; value: string }[]>([])
const tagOptions = ref([
  { label: 'Populaire', value: 'Populaire' },
  { label: 'Nouveau', value: 'Nouveau' }
])

// Variables pour les nouveaux éléments
const newIngredient = ref('')
const newAllergen = ref('')

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

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    price: 0,
    stockCount: 0,
    category: '',
    tags: [],
    ingredients: [],
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      allergens: []
    },
    diets: []
  }
  newIngredient.value = ''
  newAllergen.value = ''
}

// Exposer la méthode de réinitialisation
defineExpose({
  resetForm
})

// Ajouter un ingrédient
const addIngredient = () => {
  if (newIngredient.value.trim()) {
    formData.value.ingredients.push(newIngredient.value.trim())
    newIngredient.value = ''
  }
}

// Supprimer un ingrédient
const removeIngredient = (index: number) => {
  formData.value.ingredients.splice(index, 1)
}

// Ajouter un allergène
const addAllergen = () => {
  if (newAllergen.value.trim()) {
    formData.value.nutrition.allergens.push(newAllergen.value.trim())
    newAllergen.value = ''
  }
}

// Supprimer un allergène
const removeAllergen = (index: number) => {
  formData.value.nutrition.allergens.splice(index, 1)
}

// Valider le formulaire
const validateForm = () => {
  if (!formData.value.name.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Le nom du produit est requis',
      life: 3000,
    })
    return false
  }
  
  if (!formData.value.description.trim() || formData.value.description.trim().length < 10) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'La description doit contenir au moins 10 caractères',
      life: 3000,
    })
    return false
  }
  
  if (formData.value.price <= 0) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Le prix doit être supérieur à 0',
      life: 3000,
    })
    return false
  }
  
  if (!formData.value.category) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'La catégorie est requise',
      life: 3000,
    })
    return false
  }
  
  if (formData.value.ingredients.length === 0) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Au moins un ingrédient est requis',
      life: 3000,
    })
    return false
  }
  
  return true
}

// Sauvegarder le produit
const handleSave = async () => {
  if (!validateForm()) return
  
  isSaving.value = true
  
  try {
    const newPastry = {
      name: formData.value.name,
      description: formData.value.description,
      price: formData.value.price,
      stockCount: formData.value.stockCount,
      categoryId: formData.value.category,
      tags: formData.value.tags,
      ingredients: formData.value.ingredients,
      nutrition: formData.value.nutrition,
      dietIds: formData.value.diets,
      images: [] // Pour l'instant, pas d'images
    }
    
    emit('save', newPastry as Partial<Pastry>)    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    isSaving.value = false
  }
}

// Fermer le modal
const handleClose = () => {
  resetForm()
  emit('update:visible', false)
}

// Réinitialiser le formulaire quand le modal s'ouvre
const handleVisibleChange = (visible: boolean) => {
  if (visible) {
    resetForm()
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Ajouter un nouveau produit"
    :style="{ width: '70rem' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
    @update:visible="handleVisibleChange"
  >
    <div class="p-4">
      <!-- En-tête avec image placeholder et infos principales -->
      <div class="flex gap-6 h-25rem mb-4">
        <!-- Image placeholder -->
        <div class="w-25rem border-round overflow-hidden bg-gray-100 flex-shrink-0 relative flex align-items-center justify-content-center">
          <div class="text-center">
            <i class="pi pi-image text-6xl text-400 mb-3"></i>
            <p class="text-500">Aucune image</p>
            <p class="text-sm text-400">L'upload d'images sera disponible bientôt</p>
          </div>
        </div>

        <!-- Informations principales -->
        <div class="flex-1 overflow-hidden flex flex-column">
          <!-- Nom du produit -->
          <div class="mb-2">
            <label class="block font-medium text-900 mb-2">Nom du produit <span class="text-red-500 font-bold">*</span></label>
            <InputText
              v-model="formData.name"
              placeholder="Ex: Éclair au chocolat"
              class="w-full"
            />
          </div>
          
          <!-- Description -->
          <div>
            <label class="block font-medium text-900 mb-2">Description <span class="text-red-500 font-bold">*</span></label>
            <Textarea
              v-model="formData.description"
              placeholder="Décrivez votre produit..."
              rows="4"
              class="w-full"
            />
          </div>
          
          <!-- Spacer pour pousser les infos vers le bas -->
          <div class="flex-1"></div>
          
          <!-- Prix, stock, catégorie -->
          <div class="flex flex-column gap-2">
            <!-- Prix -->
            <div class="flex align-items-center gap-2">
              <i class="pi pi-euro text-500"></i>
              <label class="font-medium text-900">Prix <span class="text-red-500 font-bold">*</span></label>
              <InputNumber
                v-model="formData.price"
                mode="currency"
                currency="EUR"
                locale="fr-FR"
                class="w-8rem"
                :min="0"
                :step="0.01"
              />
            </div>
            
            <!-- Stock -->
            <div class="flex align-items-center gap-2">
              <i class="pi pi-box text-500"></i>
              <label class="font-medium text-900">Stock</label>
              <InputNumber
                v-model="formData.stockCount"
                class="w-6rem"
                :min="0"
              />
              <span>en stock</span>
            </div>
            
            <!-- Catégorie -->
            <div class="flex align-items-center gap-2">
              <i class="pi pi-tag text-500"></i>
              <label class="font-medium text-900">Catégorie <span class="text-red-500 font-bold">*</span></label>
              <Select
                v-model="formData.category"
                :options="categories"
                option-label="label"
                option-value="value"
                placeholder="Sélectionner une catégorie"
                class="w-12rem"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Accordéon avec les détails -->
      <Accordion :value="['0', '1', '2', '3', '4']" multiple>
        <!-- Régimes alimentaires -->
        <AccordionPanel value="0">
          <AccordionHeader>
            <span>Régimes alimentaires</span>
          </AccordionHeader>
          <AccordionContent>
            <div class="p-3">
              <MultiSelect
                v-model="formData.diets"
                :options="availableDiets"
                option-label="label"
                option-value="value"
                placeholder="Sélectionner les régimes"
                class="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionPanel>

        <!-- Tags -->
        <AccordionPanel value="1">
          <AccordionHeader>
            <span>Tags</span>
          </AccordionHeader>
          <AccordionContent>
            <div class="p-3">
              <MultiSelect
                v-model="formData.tags"
                :options="tagOptions"
                option-label="label"
                option-value="value"
                placeholder="Sélectionner un ou plusieurs tags"
                class="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionPanel>

        <!-- Ingrédients -->
        <AccordionPanel value="2">
          <AccordionHeader>
            <span>Ingrédients <span class="text-red-500 font-bold">*</span></span>
          </AccordionHeader>
          <AccordionContent>
            <div class="p-3">
              <div class="flex gap-2 flex-wrap mb-3">
                <div 
                  v-for="(ingredient, index) in formData.ingredients" 
                  :key="index"
                  class="flex align-items-center gap-1 surface-100 border-round px-2 py-1 cursor-pointer hover:surface-200"
                  @click="removeIngredient(index)"
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
                />
                <Button
                  label="Ajouter"
                  size="small"
                  @click="addIngredient"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>

        <!-- Allergènes -->
        <AccordionPanel value="3">
          <AccordionHeader>
            <span>Allergènes</span>
          </AccordionHeader>
          <AccordionContent>
            <div class="p-3">
              <div class="flex gap-2 flex-wrap mb-3">
                <div 
                  v-for="(allergen, index) in formData.nutrition.allergens" 
                  :key="index"
                  class="flex align-items-center gap-1 surface-100 border-round px-2 py-1 cursor-pointer hover:surface-200"
                  @click="removeAllergen(index)"
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
                />
                <Button
                  label="Ajouter"
                  size="small"
                  @click="addAllergen"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>

        <!-- Valeurs nutritionnelles -->
        <AccordionPanel value="4">
          <AccordionHeader>
            <span>Valeurs nutritionnelles (pour 100g)</span>
          </AccordionHeader>
          <AccordionContent>
            <div class="p-3">
              <div class="surface-card border-round p-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="flex flex-column gap-2">
                    <label class="font-medium text-900">Énergie (kcal)</label>
                    <InputNumber
                      v-model="formData.nutrition.calories"
                      class="w-full"
                      :min="0"
                    />
                  </div>
                  <div class="flex flex-column gap-2">
                    <label class="font-medium text-900">Matières grasses (g)</label>
                    <InputNumber
                      v-model="formData.nutrition.fat"
                      class="w-full"
                      :min="0"
                    />
                  </div>
                  <div class="flex flex-column gap-2">
                    <label class="font-medium text-900">Glucides (g)</label>
                    <InputNumber
                      v-model="formData.nutrition.carbs"
                      class="w-full"
                      :min="0"
                    />
                  </div>
                  <div class="flex flex-column gap-2">
                    <label class="font-medium text-900">Protéines (g)</label>
                    <InputNumber
                      v-model="formData.nutrition.protein"
                      class="w-full"
                      :min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <template #footer>
      <Button 
        label="Annuler" 
        text 
        @click="handleClose"
        :disabled="isSaving"
      />
      <Button 
        label="Ajouter"
        @click="handleSave"
        :loading="isSaving"
        :disabled="isSaving"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.edit-image-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-image-button:hover {
  background: rgba(0, 0, 0, 0.9);
}

.modal-product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style> 