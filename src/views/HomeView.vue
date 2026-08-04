<script setup lang="ts">
// Pas de logique particulière pour l'instant.
// Les liens de cartes pointent vers /boutique avec un filtre en query param,
// à adapter selon la route réelle de ta boutique.
import ProductCarousel from '@/components/ProductCarousel.vue'
import TestimonialsSection from '@/components/TestimonialsSection.vue'
import PassionBanner from '@/components/PassionBanner.vue'

</script>
<!-- src/views/HomeView.vue -->
<template>
  <div :class="$style.homeView">
    <!-- HEADER / HERO -->
    <section :class="$style.hero">
      <div :class="$style.heroOverlay"></div>
      <div :class="$style.heroContent">
        <h1 :class="$style.heroTitle">Fabrik'Miniatures</h1>
        <p :class="$style.heroSubtitle">
          Découvrez un monde de miniatures détaillées. Chaque modèle raconte une histoire de
          précision et de passion.
        </p>
      </div>
    </section>

    <!-- SECTION COLLECTIONS -->
    <section :class="$style.collections">
      <p :class="$style.collectionsEyebrow">Découvrez</p>
      <h2 :class="$style.collectionsTitle">Nos collections exclusives</h2>
      <p :class="$style.collectionsSubtitle">
        Des modèles qui capturent l'essence de chaque véhicule avec précision
      </p>

      <div :class="$style.cardGrid">
        <div :class="[$style.collectionCard, $style.collectionCardBestSellers]">
          <div :class="$style.cardIcon">🏆</div>
          <h3 :class="$style.cardTitle">Meilleurs ventes</h3>
          <p :class="$style.cardText">Nos modèles les plus prisés</p>
          <router-link to="/boutique?tri=ventes" :class="$style.cardLink">
            Découvrir <span :class="$style.arrow">›</span>
          </router-link>
        </div>

        <div :class="[$style.collectionCard, $style.collectionCardNew]">
          <div :class="$style.cardIcon">✨</div>
          <h3 :class="$style.cardTitle">Nouveautés</h3>
          <p :class="$style.cardText">Dernières arrivées de notre collection</p>
          <router-link to="/boutique?tri=nouveautes" :class="$style.cardLink">
            Explorer <span :class="$style.arrow">›</span>
          </router-link>
        </div>

        <div :class="[$style.collectionCard, $style.collectionCardPreorders]">
          <div :class="$style.cardIcon">📦</div>
          <h3 :class="$style.cardTitle">Précommandes</h3>
          <p :class="$style.cardText">Réservez vos miniatures avant leur sortie</p>
          <router-link to="/boutique?tri=precommandes" :class="$style.cardLink">
            Réserver <span :class="$style.arrow">›</span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
  <div :class="$style.homeView">
    <!-- ... hero + collections inchangés ... -->

    <ProductCarousel />
    <TestimonialsSection />
    <PassionBanner />
  </div>
</template>

<style module>
.homeView {
  width: 100%;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
}

/* ---------- HERO ---------- */
.hero {
  position: relative;
  width: 100%;
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('../assets/images/Ogier.png');
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.heroOverlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.75) 100%);
}

.heroContent {
  position: relative;
  z-index: 1;
  max-width: 720px;
  text-align: center;
  padding: 32px 64px;
}

.heroTitle {
  font-size: 48px;
  font-weight: 700;
  line-height: 130%;
  margin: 0 0 16px;
}

.heroSubtitle {
  font-size: 16px;
  line-height: 150%;
  color: var(--color-text-light);
  margin: 0;
}

/* ---------- COLLECTIONS ---------- */
.collections {
  padding: 64px;
  text-align: center;
}

.collectionsEyebrow {
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin: 0 0 8px;
}

.collectionsTitle {
  font-size: 32px;
  font-weight: 600;
  line-height: 130%;
  margin: 0 0 12px;
}

.collectionsSubtitle {
  font-size: 16px;
  line-height: 150%;
  color: var(--color-text-muted);
  margin: 0 0 40px;
}

.cardGrid {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.collectionCard {
  width: 280px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 32px;
  text-align: left;
  background-color: var(--color-bg);
  transition: border-color 0.2s;
  background-image: url('../assets/images/Ogier.png');
  background-size: cover;
  background-position: center;
}

.collectionCardBestSellers {
  background-image: url('../assets/images/Ogier.png');
  opacity: 0.9;
}

.collectionCardNew {
  background-image: url('../assets/images/fa.jpg');
  opacity: 0.9;
}

.collectionCardPreorders {
  background-image: url('../assets/images/solberg.jpg');
  opacity: 0.9;
}

.collectionCard:hover {
  border-color: var(--color-accent);
}

.cardIcon {
  font-size: 28px;
  margin-bottom: 16px;
}

.cardTitle {
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  margin: 0 0 8px;
}

.cardText {
  font-size: 14px;
  line-height: 150%;
  color: var(--color-text-muted);
  margin: 0 0 20px;
}

.cardLink {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-accent);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.cardLink:hover {
  text-decoration: underline;
}

.arrow {
  font-size: 16px;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 900px) {
  .cardGrid {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .hero,
  .collections {
    padding: 32px 24px;
  }

  .heroTitle {
    font-size: 32px;
  }
}
</style>