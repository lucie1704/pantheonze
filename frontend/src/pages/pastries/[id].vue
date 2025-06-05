<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const quantity = ref(1)
const selectedSize = ref('standard')
const customMessage = ref('')

// Galerie photos
const images = [
  { itemImageSrc: '/product1.jpg', thumbnailImageSrc: '/product1-thumb.jpg', alt: 'Vue principale' },
  { itemImageSrc: '/product2.jpg', thumbnailImageSrc: '/product2-thumb.jpg', alt: 'Vue détaillée' },
  { itemImageSrc: '/product3.jpg', thumbnailImageSrc: '/product3-thumb.jpg', alt: 'Vue des ingrédients' }
]

// Informations produit (à remplacer par des données réelles)
const product = {
  name: 'Paris-Brest Traditionnel',
  price: 24.90,
  description: 'Notre Paris-Brest traditionnel, garni d\'une délicieuse crème pralinée et parsemé d\'amandes effilées.',
  ingredients: [
    { name: 'Farine', allergen: false },
    { name: 'Œufs', allergen: true },
    { name: 'Lait', allergen: true },
    { name: 'Amandes', allergen: true },
    { name: 'Noisettes', allergen: true }
  ],
  nutrition: {
    calories: 385,
    proteines: 8.5,
    glucides: 42,
    lipides: 21
  },
  weight: '180g',
  conservation: '48h au réfrigérateur',
  preparation: '30 minutes',
  diets: ['Sans conservateurs', 'Fait maison'],
  availability: true
}

// Options de personnalisation
const sizeOptions = [
  { label: '4 personnes', value: 'small', price: 24.90 },
  { label: '6 personnes', value: 'standard', price: 34.90 },
  { label: '8 personnes', value: 'large', price: 44.90 }
]

// Avis clients
const reviews = [
  { id: 1, author: 'Marie L.', rating: 5, comment: 'Délicieux et très frais !', date: '2024-03-15' },
  { id: 2, author: 'Pierre D.', rating: 4, comment: 'Très bon, mais un peu cher', date: '2024-03-14' }
]

// Produits similaires
const similarProducts = [
  { id: 1, name: 'Éclair au Chocolat', price: 4.50, image: '/eclair.jpg' },
  { id: 2, name: 'Saint-Honoré', price: 28.90, image: '/saint-honore.jpg' },
  { id: 3, name: 'Millefeuille', price: 25.90, image: '/millefeuille.jpg' }
]

const addToCart = () => {
  // Logique d'ajout au panier
  console.log('Ajout au panier:', {
    productId: route.params.id,
    quantity: quantity.value,
    size: selectedSize.value,
    message: customMessage.value
  })
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-4">
    <!-- En-tête produit -->
    <div class="grid">
      <!-- Galerie photos -->
      <div class="col-12 md:col-6 mb-4">
        <Galleria 
          :value="images" 
          :numVisible="5"
          :showThumbnails="true"
          :showIndicators="true"
          containerClass="w-full"
        >
          <template #item="slotProps">
            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" class="w-full" />
          </template>
          <template #thumbnail="slotProps">
            <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
          </template>
        </Galleria>
      </div>

      <!-- Informations principales -->
      <div class="col-12 md:col-6">
        <h1 class="text-4xl font-bold mb-3">{{ product.name }}</h1>
        <div class="text-2xl text-primary mb-4">{{ product.price }}€</div>
        <p class="mb-4">{{ product.description }}</p>

        <!-- Options de personnalisation -->
        <div class="mb-4">
          <h3 class="text-xl mb-2">Taille</h3>
          <div class="flex flex-wrap gap-3">
            <div v-for="option in sizeOptions" :key="option.value" class="flex align-items-center">
              <RadioButton 
                v-model="selectedSize" 
                :value="option.value" 
                :inputId="option.value"
              />
              <label :for="option.value" class="ml-2">{{ option.label }} - {{ option.price }}€</label>
            </div>
          </div>
        </div>

        <!-- Message personnalisé -->
        <div class="mb-4">
          <h3 class="text-xl mb-2">Message personnalisé</h3>
          <Textarea 
            v-model="customMessage" 
            rows="3" 
            placeholder="Exemple : Joyeux Anniversaire !"
            class="w-full"
          />
        </div>

        <!-- Quantité et ajout au panier -->
        <div class="flex align-items-center gap-3 mb-4">
          <InputNumber v-model="quantity" :min="1" :max="10" showButtons />
          <Button 
            label="Ajouter au panier" 
            icon="pi pi-shopping-cart" 
            @click="addToCart"
            :disabled="!product.availability"
          />
        </div>

        <!-- Disponibilité -->
        <div class="mb-4">
          <Tag 
            :severity="product.availability ? 'success' : 'danger'"
            :value="product.availability ? 'En stock' : 'Indisponible'"
          />
          <small class="block mt-2">Délai de préparation : {{ product.preparation }}</small>
        </div>
      </div>
    </div>

    <!-- Détails produit -->
    <TabView class="mt-6">
      <!-- Ingrédients -->
      <TabPanel header="Ingrédients">
        <ul class="list-none p-0">
          <li v-for="ingredient in product.ingredients" :key="ingredient.name" class="mb-2">
            <span :class="{ 'font-bold': ingredient.allergen }">
              {{ ingredient.name }}
            </span>
            <Tag v-if="ingredient.allergen" severity="warning" value="Allergène" class="ml-2" />
          </li>
        </ul>
      </TabPanel>

      <!-- Valeurs nutritionnelles -->
      <TabPanel header="Valeurs nutritionnelles">
        <div class="grid">
          <div v-for="(value, key) in product.nutrition" :key="key" class="col-6 md:col-3">
            <div class="surface-card p-3 border-round text-center">
              <div class="text-xl font-bold mb-2">{{ value }}</div>
              <div class="text-500">{{ key }}</div>
            </div>
          </div>
        </div>
      </TabPanel>

      <!-- Conservation -->
      <TabPanel header="Conservation">
        <p>{{ product.conservation }}</p>
        <ul class="list-none p-0 mt-3">
          <li class="mb-2">
            <i class="pi pi-info-circle mr-2"></i>
            À conserver au réfrigérateur
          </li>
          <li class="mb-2">
            <i class="pi pi-clock mr-2"></i>
            À consommer dans les 48h
          </li>
        </ul>
      </TabPanel>
    </TabView>

    <!-- Avis clients -->
    <div class="mt-6">
      <h2 class="text-2xl font-bold mb-4">Avis clients</h2>
      <div class="grid">
        <div v-for="review in reviews" :key="review.id" class="col-12 md:col-6">
          <div class="surface-card p-4 border-round mb-3">
            <Rating :modelValue="review.rating" readonly :cancel="false" />
            <p class="my-3">{{ review.comment }}</p>
            <div class="flex justify-content-between text-500">
              <span>{{ review.author }}</span>
              <span>{{ new Date(review.date).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Produits similaires -->
    <div class="mt-6">
      <h2 class="text-2xl font-bold mb-4">Vous aimerez aussi</h2>
      <div class="grid">
        <div v-for="product in similarProducts" :key="product.id" class="col-12 md:col-4">
          <div class="surface-card p-4 border-round text-center">
            <img :src="product.image" :alt="product.name" class="w-full h-12rem mb-3" />
            <h3 class="text-xl mb-2">{{ product.name }}</h3>
            <div class="text-primary font-bold">{{ product.price }}€</div>
            <Button label="Voir" text class="mt-3" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 