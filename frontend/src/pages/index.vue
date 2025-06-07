<script setup lang="ts">
const seasonalProducts = [
  {
    name: 'Galette des Rois',
    price: '22.00',
    image: '/galette.jpg',
    description: "Parfaite pour célébrer l'Épiphanie",
  },
  {
    name: 'Bûche de Noël',
    price: '28.00',
    image: '/buche.jpg',
    description: 'Notre spécialité des fêtes',
  },
  {
    name: 'Tarte aux Fraises',
    price: '24.00',
    image: '/tarte-fraises.jpg',
    description: 'Fraises fraîches de saison',
  },
]

const categories = [
  { name: 'Gâteaux', icon: 'pi pi-star', count: '25' },
  { name: 'Macarons', icon: 'pi pi-circle-fill', count: '15' },
  { name: 'Viennoiseries', icon: 'pi pi-moon', count: '20' },
  { name: 'Tartes', icon: 'pi pi-heart', count: '18' },
]

const trending = [
  { name: 'Éclair Chocolat', price: '4.50', tag: 'Nouveau' },
  { name: 'Croissant Amandes', price: '3.80', tag: 'Populaire' },
  { name: 'Paris-Brest', price: '5.20', tag: 'Classique' },
]

const testimonials = [
  {
    name: 'Marie L.',
    comment: 'Les meilleurs macarons de Paris !',
    rating: 5,
    date: '15/03/2024',
  },
  {
    name: 'Pierre D.',
    comment: 'Service impeccable et pâtisseries divines.',
    rating: 5,
    date: '12/03/2024',
  },
  {
    name: 'Sophie M.',
    comment: 'Un vrai délice, je recommande vivement.',
    rating: 5,
    date: '10/03/2024',
  },
]

const dietaryOptions = [
  {
    label: 'Sans Gluten',
    icon: 'pi pi-check-circle',
    description: 'Délices adaptés',
  },
  {
    label: 'Vegan',
    icon: 'pi pi-heart-fill',
    description: 'Sans produits animaux',
  },
  {
    label: 'Sans Sucre',
    icon: 'pi pi-star',
    description: 'Alternatives saines',
  },
]
</script>

<template>
  <Button
    label="Click"
    severity="secondary"
  />
  <!-- <div class="surface-ground">
    <div class="relative overflow-hidden mb-8">
      <div class="bg-primary-800 text-white">
        <div class="max-w-screen-xl mx-auto px-4 py-8">
          <div class="flex flex-column md:flex-row align-items-center justify-content-between">
            <div class="mb-4 md:mb-0 text-center md:text-left">
              <div class="text-6xl font-bold mb-3">Pâtisseries de Saison</div>
              <div class="text-2xl mb-5">Découvrez nos créations artisanales</div>
              <Button label="Commander" icon="pi pi-shopping-cart" size="large" />
            </div>
            <div class="w-full md:w-6 px-4">
              <Carousel :value="seasonalProducts" :numVisible="1" :numScroll="1" class="border-round-xl overflow-hidden">
                <template #item="slotProps">
                  <div class="p-4">
                    <div class="surface-card p-4 border-round-xl">
                      <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-full h-15rem border-round-xl" />
                      <h3 class="text-xl font-bold mt-3">{{ slotProps.data.name }}</h3>
                      <div class="text-primary font-bold">{{ slotProps.data.price }}€</div>
                    </div>
                  </div>
                </template>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-screen-xl mx-auto px-4 mb-8">
      <h2 class="text-4xl font-bold mb-4 text-center">Catégories Populaires</h2>
      <div class="grid">
        <div v-for="category in categories" :key="category.name" class="col-12 md:col-3">
          <div class="surface-card p-4 border-round text-center cursor-pointer hover:surface-hover transition-colors transition-duration-150">
            <i :class="category.icon" class="text-4xl text-primary mb-3"></i>
            <h3 class="text-xl font-bold mb-2">{{ category.name }}</h3>
            <span class="text-500">{{ category.count }} produits</span>
          </div>
        </div>
      </div>
    </div>

    <div class="surface-section px-4 py-8 mb-8">
      <div class="max-w-screen-xl mx-auto">
        <h2 class="text-4xl font-bold mb-4 text-center">Tendances & Nouveautés</h2>
        <div class="grid">
          <div v-for="product in trending" :key="product.name" class="col-12 md:col-4">
            <div class="surface-card p-4 border-round">
              <Tag :value="product.tag" severity="info" class="mb-3" />
              <h3 class="text-xl font-bold mb-2">{{ product.name }}</h3>
              <div class="text-primary font-bold">{{ product.price }}€</div>
              <Button label="Ajouter" icon="pi pi-plus" text class="mt-3" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-screen-xl mx-auto px-4 mb-8">
      <h2 class="text-4xl font-bold mb-4 text-center">Avis Clients</h2>
      <div class="grid">
        <div v-for="testimonial in testimonials" :key="testimonial.name" class="col-12 md:col-4">
          <div class="surface-card p-4 border-round">
            <Rating :modelValue="testimonial.rating" readonly :cancel="false" class="mb-2" />
            <p class="text-lg mb-3">"{{ testimonial.comment }}"</p>
            <div class="flex justify-content-between align-items-center">
              <span class="font-bold">{{ testimonial.name }}</span>
              <span class="text-500">{{ testimonial.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="surface-section px-4 py-8 mb-8">
      <div class="max-w-screen-xl mx-auto">
        <h2 class="text-4xl font-bold mb-4 text-center">Régimes Spéciaux</h2>
        <div class="grid">
          <div v-for="option in dietaryOptions" :key="option.label" class="col-12 md:col-4">
            <div class="surface-card p-4 border-round text-center">
              <i :class="option.icon" class="text-4xl text-primary mb-3"></i>
              <h3 class="text-xl font-bold mb-2">{{ option.label }}</h3>
              <p class="text-500">{{ option.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-primary-900 text-white px-4 py-8 mb-8">
      <div class="max-w-screen-xl mx-auto text-center">
        <h2 class="text-4xl font-bold mb-4">Prêt à Commander ?</h2>
        <p class="text-xl mb-4">Livraison à domicile ou retrait en boutique</p>
        <Button label="Commander Maintenant" size="large" severity="secondary" />
      </div>
    </div>

   
  </div> -->
</template>
