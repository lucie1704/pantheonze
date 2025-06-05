<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import TieredMenu from 'primevue/tieredmenu';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const isLoggedIn = ref(true);
const userMenu = ref();
const router = useRouter();

const menuItems = [
  {
    label: 'Pâtisseries',
    to: '/pastries'
  },
  {
    label: 'Viennoiseries',
    to: '/pastries'
  },
  {
    label: 'Gâteaux',
    to: '/pastries'
  },
  {
    label: 'À propos',
    to: '/about'
  }
];

const userMenuItems = [
  {
    label: 'Mon compte',
    icon: 'pi pi-user',
    command: () => router.push('/account'),
    class: 'my-1'
  },
  {
    label: 'Mes commandes',
    icon: 'pi pi-shopping-bag',
    command: () => router.push('/account/orders'),
    class: 'my-1'
  },
  {
    label: 'Paramètres',
    icon: 'pi pi-cog',
    command: () => router.push('/account/settings'),
    class: 'my-1'
  },
  {
    separator: true,
    class: 'my-1'
  },
  {
    label: 'Se déconnecter',
    icon: 'pi pi-sign-out',
    command: () => {
      isLoggedIn.value = false;
      router.push('/login');
    },
    class: 'my-1'
  }
];
</script>

<template>
  <div class="min-h-screen flex flex-column surface-ground">
    <!-- Header avec navigation -->
    <div class="surface-section border-bottom-1 surface-border">
      <div class="w-full md:w-9 mx-auto">
        <div class="flex align-items-center justify-content-between py-3" style="height: 80px;">
          <!-- Logo -->
          <div class="flex align-items-center">
            <RouterLink to="/" class="no-underline">
              <img src="/Logo.svg" alt="PanthéOnze" style="height: 60px;" />
            </RouterLink>
          </div>

          <!-- Menu principal -->
          <div class="flex-grow-1 flex justify-content-center">
            <ul class="list-none p-0 m-0 flex">
              <li v-for="(item, index) in menuItems" :key="item.label" class="flex align-items-center">
                <RouterLink :to="item.to" class="no-underline text-900 font-medium hover:text-primary transition-colors transition-duration-150 px-3">
                  {{ item.label }}
                </RouterLink>
                <span v-if="index < menuItems.length - 1" class="text-300">|</span>
              </li>
            </ul>
          </div>

          <!-- Icônes droite -->
          <div class="flex align-items-center gap-2">
            <Button 
              text
              plain
              class="w-3rem h-3rem p-0 hover:surface-200"
              @click="$router.push('/cart')"
              v-tooltip.bottom="{ value: 'Mon panier' }"
            >
              <i class="pi pi-shopping-cart text-900 text-xl hover:text-primary"></i>
            </Button>
            
            <Button 
              v-if="!isLoggedIn"
              text
              plain
              class="w-3rem h-3rem p-0 hover:surface-200"
              @click="$router.push('/login')"
              v-tooltip.bottom="{ value: 'Se connecter'}"
            >
              <i class="pi pi-sign-in text-900 text-xl hover:text-primary"></i>
            </Button>

            <div v-else class="relative">
              <Button 
                text
                plain
                class="w-3rem h-3rem p-0 hover:surface-200" 
                @click="userMenu.toggle($event)"
                v-tooltip.bottom="{ value: 'Mon compte'}"
              >
                <i class="pi pi-user text-900 text-xl hover:text-primary"></i>
              </Button>
              <TieredMenu 
                ref="userMenu" 
                :model="userMenuItems" 
                :popup="true"
                class="p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 py-4 px-3 md:px-4 max-w-screen-xl mx-auto w-full">
      <slot></slot>
    </main>
    
    <!-- Footer -->
    <footer class="surface-section border-top-1 surface-border">
      <div class="w-full md:w-9 mx-auto py-4">
        <div class="flex flex-column md:flex-row justify-content-between align-items-start">
          <!-- Contact -->
          <div class="mb-4 md:mb-0">
            <h3 class="text-xl font-bold mb-3 text-primary">Contact</h3>
            <ul class="list-none p-0 m-0">
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-map-marker text-primary"></i>
                <span>123 Rue de la Pâtisserie, Paris</span>
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-phone text-primary"></i>
                <span>01 23 45 67 89</span>
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-envelope text-primary"></i>
                <span>contact@pantheonze.com</span>
              </li>
            </ul>
          </div>

          <!-- Horaires -->
          <div class="mb-4 md:mb-0">
            <h3 class="text-xl font-bold mb-3 text-primary">Horaires</h3>
            <ul class="list-none p-0 m-0">
              <li class="mb-2 flex align-items-center gap-2">
                <span>Lun-Ven 7h30 - 19h30</span>
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <span>Samedi 7h30 - 20h00</span>
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <span>Dimanche 8h00 - 13h00</span>
              </li>
            </ul>
          </div>

          <!-- Liens légaux -->
          <div>
            <h3 class="text-xl font-bold mb-3 text-primary">Informations</h3>
            <ul class="list-none p-0 m-0">
              <li class="mb-2">
                <RouterLink to="legal/mentions-legales" class="text-primary hover:text-primary-600 no-underline flex align-items-center gap-2">
                  <i class="pi pi-file-edit"></i>
                  <span>Mentions légales</span>
                </RouterLink>
              </li>
              <li class="mb-2">
                <RouterLink to="/legal/cgv" class="text-primary hover:text-primary-600 no-underline flex align-items-center gap-2">
                  <i class="pi pi-file"></i>
                  <span>CGV</span>
                </RouterLink>
              </li>
              <li class="mb-2">
                <RouterLink to="/legal/politique-confidentialite" class="text-primary hover:text-primary-600 no-underline flex align-items-center gap-2">
                  <i class="pi pi-shield"></i>
                  <span>Politique de confidentialité</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="text-center mt-5 text-500 flex align-items-center justify-content-center gap-2 border-top-1 surface-border pt-3">
          <i class="pi pi-copyright"></i>
          <span>2024 PanthéOnze - Tous droits réservés</span>
        </div>
      </div>
    </footer>
  </div>
</template>