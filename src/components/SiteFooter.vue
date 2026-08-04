<!-- src/components/SiteFooter.vue -->
<template>
  <footer :class="$style.footer">
    <div :class="$style.top">
      <nav :class="$style.nav">
        <router-link to="/boutique" :class="$style.navLink">Boutique</router-link>
        <router-link to="/categories" :class="$style.navLink">Catégories</router-link>
        <router-link to="/favoris" :class="$style.navLink">Favoris</router-link>
        <router-link to="/compte" :class="$style.navLink">Compte</router-link>
        <router-link to="/contact" :class="$style.navLink">Contact</router-link>
      </nav>

      <div :class="$style.socials">
        <a href="#" :class="$style.socialLink" aria-label="Facebook">
          <span :class="$style.socialIcon">f</span>
        </a>
        <a href="#" :class="$style.socialLink" aria-label="Instagram">
          <span :class="$style.socialIcon">◎</span>
        </a>
        <a href="#" :class="$style.socialLink" aria-label="X (Twitter)">
          <span :class="$style.socialIcon">𝕏</span>
        </a>
        <a href="#" :class="$style.socialLink" aria-label="LinkedIn">
          <span :class="$style.socialIcon">in</span>
        </a>
        <a href="#" :class="$style.socialLink" aria-label="YouTube">
          <span :class="$style.socialIcon">▶</span>
        </a>
      </div>
    </div>

    <div :class="$style.divider"></div>

    <div :class="$style.bottom">
      <p :class="$style.copyright">© {{ currentYear }} Fabrik'Miniatures. Tous droits réservés.</p>
      <div :class="$style.legalLinks">
        <router-link to="/confidentialite" :class="$style.legalLink">
          Politique de confidentialité
        </router-link>
        <router-link to="/conditions" :class="$style.legalLink">
          Conditions d'utilisation
        </router-link>
        <router-link to="/cookies" :class="$style.legalLink">
          Paramètres des cookies
        </router-link>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style module>
.footer {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
  padding: 40px 64px 24px;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
}

.nav {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.navLink {
  color: var(--color-text);
  text-decoration: none;
  font-size: 14px;
}

.navLink:hover {
  color: var(--color-accent);
}

.socials {
  display: flex;
  gap: 16px;
}

.socialLink {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}

.socialLink:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.socialIcon {
  font-size: 14px;
  line-height: 1;
}

.divider {
  height: 1px;
  background-color: var(--color-border);
  margin-bottom: 24px;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.copyright {
  font-size: 13px;
  color: var(--color-text-subtle);
  margin: 0;
}

.legalLinks {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.legalLink {
  font-size: 13px;
  color: var(--color-text-subtle);
  text-decoration: none;
}

.legalLink:hover {
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .footer {
    padding: 32px 24px 20px;
  }

  .top,
  .bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>