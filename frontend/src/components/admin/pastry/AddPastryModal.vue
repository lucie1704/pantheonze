<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Ajouter un produit"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @update:visible="handleClose"
  >
    <div class="p-4">
      <p>Formulaire d'ajout de produit à implémenter...</p>
    </div>
    <template #footer>
      <Button label="Annuler" text @click="handleClose" />
      <Button label="Ajouter" @click="handleClose" />
    </template>
  </Dialog>
</template> 