<!-- src/components/PassionBanner.vue -->
<template>
  <section :class="$style.banner">
    <div :class="$style.overlay"></div>
    <div :class="$style.content">
      <h2 :class="$style.title">Votre passion, notre collection</h2>

      <div :class="$style.rightColumn">
        <p :class="$style.text">
          Plongez dans un univers de miniatures où chaque modèle raconte une histoire unique.
          Rejoignez notre communauté de collectionneurs passionnés.
        </p>
        <div :class="$style.actions">
          <router-link to="/boutique" :class="$style.primaryButton">Découvrir</router-link>
          <router-link to="/boutique?tri=precommandes" :class="$style.secondaryButton">
            Précommander
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style module>
.banner {
  position: relative;
  width: 100%;
  min-height: 260px;
  display: flex;
  align-items: center;
  background-image: url('../assets/images/f1-1.jpg');
  background-size: cover;
  background-position: center;
  font-family: Roboto;
  overflow: hidden;
  box-sizing: border-box;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.35) 100%
  );
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  padding: 32px 64px;
  box-sizing: border-box;
  color: #fff;
}

.title {
  flex: 0 0 auto;
  max-width: 340px;
  font-size: 32px;
  font-weight: 700;
  line-height: 130%;
  margin: 0;
}

.rightColumn {
  flex: 1 1 auto;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.text {
  font-size: 15px;
  line-height: 160%;
  color: #e5e5e5;
  margin: 0;
}

.actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.primaryButton {
  border-radius: 8px;
  background-color: var(--color-accent);
  border: 2px solid var(--color-accent);
  color: #fff;
  text-decoration: none;
  padding: 8px 20px;
  font-size: 16px;
  white-space: nowrap;
}

.primaryButton:hover {
  opacity: 0.9;
}

.secondaryButton {
  border-radius: 8px;
  border: 2px solid #fff;
  color: #fff;
  text-decoration: none;
  padding: 8px 20px;
  font-size: 16px;
  white-space: nowrap;
}

.secondaryButton:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 900px) {
  .content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .title,
  .rightColumn {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .content {
    padding: 32px 24px;
  }

  .title {
    font-size: 24px;
  }
}
</style>