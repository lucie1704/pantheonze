<template>
  <div class="surface-ground">
    <div class="surface-section border-round-xl m-4 p-4">
      <h1 class="text-4xl font-bold mb-4 text-primary">Notre Histoire</h1>

      <div class="grid">
        <div class="col-12 md:col-6 mb-4">
          <div class="text-lg line-height-3">
            <p class="mb-4">
              Fondée en 2020, PanthéOnze est née de la passion pour la pâtisserie française traditionnelle et moderne.
              Notre équipe de pâtissiers passionnés crée chaque jour des délices qui ravissent les papilles de nos clients.
            </p>
            <p class="mb-4">
              Situés au cœur de Paris, nous mettons un point d'honneur à sélectionner les meilleurs ingrédients
              et à travailler avec des producteurs locaux pour vous offrir des pâtisseries d'exception.
            </p>
          </div>

          <div class="mt-4">
            <h2 class="text-2xl font-bold mb-3">Nos Valeurs</h2>
            <ul class="list-none p-0 m-0">
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-check-circle text-primary"></i>
                <span>Qualité et fraîcheur des produits</span>
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-check-circle text-primary"></i>
                <span>Savoir-faire artisanal</span>
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-check-circle text-primary"></i>
                <span>Innovation et tradition</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="surface-card p-4 border-round">
            <h2 class="text-2xl font-bold mb-3">Notre Équipe</h2>
            <div class="grid">
              <div class="col-12 mb-4">
                <div class="text-center">
                  <i class="pi pi-user text-4xl text-primary mb-3"></i>
                  <h3 class="text-xl font-bold mb-2">Marie Dupont</h3>
                  <p class="text-500">Chef Pâtissière</p>
                </div>
              </div>
              <div class="col-12">
                <div class="text-center">
                  <i class="pi pi-users text-4xl text-primary mb-3"></i>
                  <h3 class="text-xl font-bold mb-2">Notre Brigade</h3>
                  <p class="text-500">5 pâtissiers passionnés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
