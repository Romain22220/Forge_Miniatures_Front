<!-- src/views/ProfileView.vue -->
<template>
  <div :class="$style.profilePage">
    <div :class="$style.container">
      <h1 :class="$style.title">Mon profil</h1>

      <div v-if="!user" :class="$style.stateMessage">Chargement de votre profil...</div>

      <template v-else>
        <section :class="$style.card">
          <h2 :class="$style.sectionTitle">Informations personnelles</h2>

          <div :class="$style.infoGrid">
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Prénom</span>
              <span :class="$style.infoValue">{{ user.name }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Nom</span>
              <span :class="$style.infoValue">{{ user.lastName }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Pseudo</span>
              <span :class="$style.infoValue">{{ user.pseudo }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Email</span>
              <span :class="$style.infoValue">{{ user.email }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Téléphone</span>
              <span :class="$style.infoValue">{{ user.phoneNumber || '—' }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Adresse</span>
              <span :class="$style.infoValue">{{ user.address }}</span>
            </div>
          </div>

          <button type="button" :class="$style.editButton">Modifier mes informations</button>
        </section>

        <section :class="$style.card">
          <h2 :class="$style.sectionTitle">Mes commandes</h2>
          <p :class="$style.emptyState">
            Aucune commande pour le moment. (À brancher sur un futur endpoint commandes)
          </p>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/services/api'

const { user } = useAuth()
</script>

<style module>
.profilePage {
  width: 100%;
  min-height: calc(100vh - 72px);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
  padding: 64px;
  box-sizing: border-box;
}

.container {
  max-width: 720px;
  margin: 0 auto;
}

.title {
  font-size: 32px;
  font-weight: 700;
  line-height: 130%;
  margin: 0 0 32px;
}

.stateMessage {
  color: var(--color-text-muted);
  font-size: 16px;
}

.card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-bg-elevated);
  padding: 32px;
  margin-bottom: 24px;
}

.sectionTitle {
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  margin: 0 0 20px;
}

.infoGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.infoItem {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.infoLabel {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-subtle);
}

.infoValue {
  font-size: 15px;
  color: var(--color-text);
}

.editButton {
  border-radius: 8px;
  border: 2px solid var(--color-accent);
  background-color: transparent;
  color: var(--color-accent);
  font-family: Roboto;
  font-size: 14px;
  padding: 8px 20px;
  cursor: pointer;
}

.editButton:hover {
  background-color: var(--color-accent-bg-hover);
}

.emptyState {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 0;
}

@media (max-width: 640px) {
  .profilePage {
    padding: 32px 24px;
  }

  .infoGrid {
    grid-template-columns: 1fr;
  }
}
</style>