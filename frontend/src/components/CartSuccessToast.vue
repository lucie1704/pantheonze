<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <Toast position="bottom-right" group="cart">
    <template #message="slotProps">
      <div class="flex flex-column">
        <div class="flex align-items-center justify-content-between">
          <div class="flex align-items-center">
            <i :class="slotProps.message.icon" class="mr-2"></i>
            <span class="font-bold">{{ slotProps.message.summary }}</span>
          </div>
         
        </div>
        <div class="mt-2 flex flex-column gap-2">
          <span>{{ slotProps.message.detail }}</span>
          <Button
            v-if="slotProps.message.severity === 'success'"
            label="Voir le panier"
            size="small"
            @click="router.push('/cart')"
          />
        </div>
      </div>
    </template>
  </Toast>
</template> 