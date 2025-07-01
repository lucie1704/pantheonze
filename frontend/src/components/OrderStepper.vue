<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import Step from 'primevue/step'

const route = useRoute()

// Determine current step based on route
const currentStep = computed(() => {
  const path = route.path
  if (path === '/cart') return '1'
  if (path === '/order/informations') return '2'
  if (path === '/order/collect') return '3'
  if (path === '/order/payment') return '4'
  if (path === '/order/confirmation') return '5'
  return '1'
})

const steps = [
  { value: '1', label: 'Panier' },
  { value: '2', label: 'Informations' },
  { value: '3', label: 'Récupération' },
  { value: '4', label: 'Paiement' },
  { value: '5', label: 'Confirmation' }
]
</script>

<template>
  <div class="w-full mb-6">
    <Stepper :value="currentStep" linear class="w-full">
      <StepList>
        <Step 
          v-for="step in steps" 
          :key="step.value"
          :value="step.value"
          class="flex-1"
        >
          <template #default="{ active }">
            <span class="font-bold hidden md:block">{{ step.label }}</span>
          </template>
        </Step>
      </StepList>
    </Stepper>
  </div>
</template>
