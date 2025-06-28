<template>
  <div class="about-page">
    <!-- Notre Vision -->
    <section class="vision-section my-3">
      <div class="container mx-auto px-4">
        <div class="grid align-items-center">
          <div class="col-12 lg:col-6">
            <div class="pr-0 lg:pr-6">
              <h2 class="text-4xl font-bold text-900 mb-4">Notre Vision</h2>
              <p class="text-xl text-primary font-medium mb-4">
                Réinventer la pâtisserie parisienne avec audace et modernité
              </p>
              <p class="text-lg text-700 mb-4 line-height-3">
                Chez Panthéonze, nous croyons que la pâtisserie est un art en constante évolution. Installés dans le
                vibrant 11e arrondissement, nous puisons notre inspiration dans l'énergie créative de ce quartier
                emblématique de Paris.
              </p>
              <p class="text-lg text-600 line-height-3">
                Chaque création est pensée pour surprendre, émouvoir et créer des souvenirs gustatifs uniques. Nous
                mélangeons techniques innovantes et respect des fondamentaux pour offrir une expérience pâtissière
                contemporaine.
              </p>
            </div>
          </div>
          <div class="col-12 lg:col-6">
            <div class="vision-image-container">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2089&auto=format&fit=crop"
                alt="Atelier de création moderne"
                class="vision-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Notre Approche -->
    <section class="approach-section my-3 surface-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-6">
          <h2 class="text-4xl font-bold text-900 mb-3">Notre Approche</h2>
          <p class="text-xl text-600">L'excellence à travers l'innovation</p>
        </div>

        <div class="grid">
          <div class="col-12 md:col-4">
            <div class="approach-card surface-0 text-center p-6 h-full">
              <div class="approach-icon mb-4">
                <i class="pi pi-palette text-5xl text-primary"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">Créativité</h3>
              <p class="text-600 line-height-3">
                Nous explorons constamment de nouvelles saveurs, textures et présentations pour créer des pâtisseries
                qui sortent de l'ordinaire.
              </p>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="approach-card surface-0 text-center p-6 h-full">
              <div class="approach-icon mb-4">
                <i class="pi pi-verified text-5xl text-primary"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">Qualité</h3>
              <p class="text-600 line-height-3">
                Ingrédients premium, techniques maîtrisées et attention aux détails : chaque élément contribue à
                l'excellence de nos créations.
              </p>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="approach-card surface-0 text-center p-6 h-full">
              <div class="approach-icon mb-4">
                <i class="pi pi-globe text-5xl text-primary"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">Durabilité</h3>
              <p class="text-600 line-height-3">
                Partenariats avec des producteurs locaux, emballages éco-responsables et démarche respectueuse de
                l'environnement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Notre Lieu -->
    <section class="location-section my-3 surface-50">
      <div class="container mx-auto px-4">
        <div class="grid align-items-center">
          <div class="col-12 lg:col-6">
            <div class="location-image-container">
              <img
                src="https://gifex.com/fr/wp-content/uploads/16376/Plan-de-localisation-du-11e-arrondissement-dans-Paris.gif"
                alt="Notre boutique dans le 11e"
                class="location-image"
              />
            </div>
          </div>
          <div class="col-12 lg:col-6">
            <div class="pl-0 lg:pl-6">
              <h2 class="text-4xl font-bold text-900 mb-4">Notre Écrin Parisien</h2>
              <p class="text-xl text-primary font-medium mb-4">Au cœur du 11e, là où bat le pouls créatif de Paris</p>
              <p class="text-lg text-700 mb-4 line-height-3">
                Notre boutique-atelier s'épanouit dans l'effervescence du 11e arrondissement, ce quartier où se
                mélangent tradition parisienne et innovation contemporaine.
              </p>
              <p class="text-lg text-600 mb-6 line-height-3">
                Espace de création ouvert, notre atelier vous invite à découvrir l'envers du décor et à partager notre
                passion pour l'art pâtissier moderne.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Pas de logique spécifique nécessaire pour cette page statique
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.hero-section {
  background:
    linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%),
    url('https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=2064&auto=format&fit=crop') center/cover;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.25rem;
  font-weight: 300;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  margin: 0 auto;
}

.vision-image-container,
.location-image-container {
  height: 400px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.vision-image,
.location-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.location-image {
  filter: grayscale(100%);
}

.vision-image:hover,
.location-image:hover {
  transform: scale(1.05);
}

.approach-card,
.team-card {
  transition: all 0.3s ease;
  border-radius: 1rem;
  border: 1px solid transparent;
}

.approach-card:hover,
.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.approach-icon,
.team-avatar {
  transition: all 0.3s ease;
}

.approach-card:hover .approach-icon,
.team-card:hover .team-avatar {
  transform: scale(1.1);
}
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .vision-image-container,
  .location-image-container {
    height: 300px;
  }
}
</style>
