<script setup lang="ts">
import type { Pastry } from '@/types'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

interface Props {
  visible: boolean
  pastry: Pastry | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', pastry: Pastry): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  if (props.pastry) {
    emit('confirm', props.pastry)
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Confirmation de suppression"
    :style="{ width: '25rem' }"
    @update:visible="handleClose"
  >
    <div class="p-4">
      <p v-if="pastry">
        Êtes-vous sûr de vouloir supprimer le produit <strong>"{{ pastry.name }}"</strong> ?
      </p>
      <p class="text-sm text-gray-600 mt-2">Cette action est irréversible.</p>
    </div>
    <template #footer>
      <Button label="Annuler" text @click="handleClose" />
      <Button label="Supprimer" severity="danger" @click="handleConfirm" />
    </template>
  </Dialog>
</template> 