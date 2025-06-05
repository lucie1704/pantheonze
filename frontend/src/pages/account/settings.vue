<template>
  <div class="surface-ground">
    <div class="surface-section border-round-xl m-4 p-4">
      <h1 class="text-4xl font-bold mb-4 text-primary">Paramètres</h1>

      <div class="grid">
        <div class="col-12 md:col-8">
          <div class="surface-card p-4 border-round mb-4">
            <h2 class="text-2xl font-bold mb-4">Préférences de notification</h2>
            <div class="flex flex-column gap-3">
              <div class="flex align-items-center justify-content-between">
                <div>
                  <h3 class="text-xl m-0 mb-1">Notifications par email</h3>
                  <p class="text-500 m-0">Recevoir des emails pour les mises à jour de commande</p>
                </div>
                <InputSwitch v-model="settings.emailNotifications" />
              </div>
              <div class="flex align-items-center justify-content-between">
                <div>
                  <h3 class="text-xl m-0 mb-1">Notifications promotionnelles</h3>
                  <p class="text-500 m-0">Recevoir des offres spéciales et promotions</p>
                </div>
                <InputSwitch v-model="settings.promoNotifications" />
              </div>
            </div>
          </div>

          <div class="surface-card p-4 border-round mb-4">
            <h2 class="text-2xl font-bold mb-4">Préférences de livraison</h2>
            <div class="flex flex-column gap-3">
              <div class="field">
                <label for="defaultAddress" class="block mb-2">Adresse de livraison par défaut</label>
                <Textarea 
                  id="defaultAddress" 
                  v-model="settings.defaultAddress" 
                  rows="3" 
                  class="w-full"
                />
              </div>
              <div class="field">
                <label for="deliveryInstructions" class="block mb-2">Instructions de livraison</label>
                <InputText 
                  id="deliveryInstructions" 
                  v-model="settings.deliveryInstructions" 
                  class="w-full"
                  placeholder="Ex: Code d'entrée, étage..."
                />
              </div>
            </div>
          </div>

          <div class="surface-card p-4 border-round">
            <h2 class="text-2xl font-bold mb-4">Préférences de paiement</h2>
            <div class="flex flex-column gap-3">
              <div class="field">
                <label class="block mb-2">Mode de paiement préféré</label>
                <div class="flex gap-4">
                  <div class="flex align-items-center gap-2">
                    <RadioButton 
                      v-model="settings.preferredPayment" 
                      value="card" 
                      inputId="payment1" 
                    />
                    <label for="payment1">Carte bancaire</label>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <RadioButton 
                      v-model="settings.preferredPayment" 
                      value="paypal" 
                      inputId="payment2" 
                    />
                    <label for="payment2">PayPal</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-4">
          <div class="surface-card p-4 border-round sticky" style="top: 1rem;">
            <h2 class="text-2xl font-bold mb-4">Actions</h2>
            <div class="flex flex-column gap-2">
              <Button label="Enregistrer les modifications" icon="pi pi-check" class="w-full" />
              <Button label="Réinitialiser" icon="pi pi-refresh" severity="secondary" text class="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputSwitch from 'primevue/inputswitch';
import Textarea from 'primevue/textarea';
import RadioButton from 'primevue/radiobutton';

const settings = ref({
  emailNotifications: true,
  promoNotifications: false,
  defaultAddress: '',
  deliveryInstructions: '',
  preferredPayment: 'card'
});
</script> 