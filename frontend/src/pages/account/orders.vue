<template>
  <div class="surface-ground">
    <div class="surface-section border-round-xl m-4 p-4">
      <h1 class="text-4xl font-bold mb-4 text-primary">Mes commandes</h1>

      <div class="grid">
        <div class="col-12">
          <div class="surface-card p-4 border-round">
            <div class="flex justify-content-between align-items-center mb-4">
              <h2 class="text-2xl font-bold m-0">Historique des commandes</h2>
              <div class="flex gap-2">
                <Button icon="pi pi-filter" label="Filtrer" severity="secondary" text />
                <Button icon="pi pi-sort-alt" label="Trier" severity="secondary" text />
              </div>
            </div>

            <!-- Liste des commandes -->
            <div class="flex flex-column gap-3">
              <div v-for="order in orders" :key="order.id" class="surface-ground border-round p-3">
                <div class="flex justify-content-between align-items-center">
                  <div>
                    <span class="font-bold text-xl block mb-2">Commande #{{ order.id }}</span>
                    <span class="text-500 block">{{ order.date }}</span>
                  </div>
                  <div class="text-right">
                    <span class="font-bold text-xl block mb-2">{{ order.total }}€</span>
                    <span :class="['border-round-xl px-3 py-1', order.status === 'Livré' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700']">
                      {{ order.status }}
                    </span>
                  </div>
                </div>
                <div class="border-top-1 surface-border mt-3 pt-3">
                  <ul class="list-none p-0 m-0">
                    <li v-for="item in order.items" :key="item.id" class="mb-2">
                      {{ item.quantity }}x {{ item.name }}
                    </li>
                  </ul>
                </div>
                <div class="flex gap-2 mt-3">
                  <Button icon="pi pi-eye" label="Détails" text />
                  <Button icon="pi pi-replay" label="Commander à nouveau" text />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const orders = ref([
  {
    id: '2024-001',
    date: '15 Mars 2024',
    total: 42.50,
    status: 'Livré',
    items: [
      { id: 1, name: 'Éclair au chocolat', quantity: 2 },
      { id: 2, name: 'Paris-Brest', quantity: 1 },
      { id: 3, name: 'Mille-feuille', quantity: 1 }
    ]
  },
  {
    id: '2024-002',
    date: '18 Mars 2024',
    total: 35.00,
    status: 'En préparation',
    items: [
      { id: 4, name: 'Tarte aux fraises', quantity: 1 },
      { id: 5, name: 'Croissants', quantity: 4 }
    ]
  }
]);
</script> 