<template>
  <footer class="surface-section border-top-1 surface-border">
    <div class="w-full px-3 lg:w-9 md:w-11 mx-auto py-4">
      <div
        class="flex flex-column md:flex-row md:justify-content-between align-items-center md:align-items-start gap-4"
      >
        <!-- Contact -->
        <div class="w-fit-content text-center md:text-left mb-4 md:mb-0">
          <h3 class="text-xl font-bold mb-3 text-primary">Contact</h3>
          <ul class="list-none p-0 m-0">
            <li class="mb-2 flex align-items-center gap-2">
              <i class="pi pi-map-marker text-primary w-1rem"></i>
              <span class="text-sm lg:text-base">123 Rue de la Pâtisserie, Paris</span>
            </li>
            <li class="mb-2 flex align-items-center gap-2">
              <i class="pi pi-phone text-primary w-1rem"></i>
              <span class="text-sm lg:text-base">01 23 45 67 89</span>
            </li>
            <li class="mb-2 flex align-items-center gap-2">
              <i class="pi pi-envelope text-primary w-1rem"></i>
              <span class="text-sm lg:text-base">contact@pantheonze.com</span>
            </li>
          </ul>
        </div>

        <!-- Horaires -->
        <div class="w-fit-content text-center md:text-left mb-4 md:mb-0">
          <h3 class="text-xl font-bold mb-3 text-primary">Horaires</h3>
          <ul class="list-none p-0 m-0">
            <li class="mb-2 flex align-items-center">
              <i class="pi pi-clock text-primary w-1rem mr-2"></i>
              <div class="flex gap-2">
                <span class="text-sm lg:text-base w-5rem text-left">Lun-Ven</span>
                <span class="text-sm lg:text-base">7h30 - 19h30</span>
              </div>
            </li>
            <li class="mb-2 flex align-items-center">
              <i class="pi pi-clock text-primary w-1rem mr-2"></i>
              <div class="flex gap-2">
                <span class="text-sm lg:text-base w-5rem text-left">Samedi</span>
                <span class="text-sm lg:text-base">7h30 - 20h00</span>
              </div>
            </li>
            <li class="mb-2 flex align-items-center">
              <i class="pi pi-clock text-primary w-1rem mr-2"></i>
              <div class="flex gap-2">
                <span class="text-sm lg:text-base w-5rem text-left">Dimanche</span>
                <span class="text-sm lg:text-base">8h00 - 13h00</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Liens légaux -->
        <div class="w-fit-content text-center md:text-left">
          <h3 class="text-xl font-bold mb-3 text-primary">Informations</h3>
          <ul class="list-none p-0 m-0">
            <li class="mb-2">
              <RouterLink
                to="legal/mentions-legales"
                class="text-primary hover:text-primary-600 no-underline flex align-items-center gap-2"
              >
                <i class="pi pi-file-edit w-1rem"></i>
                <span class="text-sm lg:text-base">Mentions légales</span>
              </RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink
                to="/legal/cgv"
                class="text-primary hover:text-primary-600 no-underline flex align-items-center gap-2"
              >
                <i class="pi pi-file w-1rem"></i>
                <span class="text-sm lg:text-base">CGV</span>
              </RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink
                to="/legal/politique-confidentialite"
                class="text-primary hover:text-primary-600 no-underline flex align-items-center gap-2"
              >
                <i class="pi pi-shield w-1rem"></i>
                <span class="text-sm lg:text-base">Politique de confidentialité</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="text-center mt-5 text-500 flex flex-column lg:flex-row align-items-center justify-content-center gap-2 border-top-1 surface-border pt-3"
      >
        <i class="pi pi-copyright"></i>
        <span class="text-sm lg:text-base">2025 PanthéOnze - Tous droits réservés</span>
      </div>
    </div>
  </footer>
</template>
