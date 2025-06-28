<template>
  <section class="banner-section relative overflow-hidden">
    <div class="banner-image-container">
      <img
        :src="imageUrl"
        :alt="imageAlt"
        class="banner-image"
      />
      <div class="banner-overlay"></div>
    </div>

    <div class="banner-content">
      <div class="text-center text-white">
        <div class="banner-logo mb-3">
          <img
            :src="logoUrl"
            :alt="logoAlt"
            class="logo-image"
          />
        </div>
        <p class="banner-subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  imageUrl: string
  imageAlt?: string
  logoUrl: string
  logoAlt?: string
  subtitle: string
}

const props = withDefaults(defineProps<Props>(), {
  imageAlt: 'Banner image',
  logoAlt: 'Logo',
})
</script>

<style scoped>
.banner-section {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.banner-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.banner-logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  max-height: 120px;
  max-width: 400px;
  object-fit: contain;
}

.banner-subtitle {
  font-size: 1.25rem;
  font-weight: 300;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .banner-section {
    height: 200px;
  }

  .logo-image {
    max-height: 80px;
    max-width: 300px;
  }

  .banner-subtitle {
    font-size: 1rem;
  }

  .banner-content {
    padding: 0 1rem;
  }
}
</style>
