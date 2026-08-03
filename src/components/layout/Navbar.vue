
<template>
  <div :class="$style.navbar28">
    <div :class="$style.header">
      <div :class="$style.container">
        <div :class="$style.content">
          <div :class="$style.companyLogo">
            <!-- Redirect to home-->
            <router-link to="/">
              <img :class="$style.logoWide1Icon" alt="" />
            </router-link>
          </div>
          <div :class="$style.column">
            <div :class="$style.linkText">Boutique</div>
            <div :class="$style.linkText">Nouveautés</div>
            <div :class="$style.navLinkDropdown">
              <div :class="$style.linkText">Catégories</div>
              <span :class="$style.chevronDownIcon" aria-hidden="true"></span>
              <div :class="$style.categoryDropdown">
                <div :class="$style.categoryDropdownItem">Voitures</div>
                <div :class="$style.categoryDropdownItem">Motos</div>
                <div :class="$style.categoryDropdownItem">Engins Agricoles</div>
                <div :class="$style.categoryDropdownItem">Engins de chantier</div>
                <div :class="$style.categoryDropdownItem">Bateaux</div>
              </div>
            </div>
            <div :class="$style.linkText">Contact</div>
          </div>
        </div>
        <div :class="$style.actions">
          <div v-if="!user" :class="$style.button">
            <router-link to="/connexion" :class="$style.linkText">Connexion</router-link>
          </div>
          <div v-else :class="$style.button" @click="handleLogout" style="cursor: pointer;">
            <span :class="$style.linkText">Déconnexion</span>
          </div>

          <div :class="$style.button2">
            <div :class="$style.linkText">Panier</div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.megaMenu1">
      <div :class="$style.menu">
        <div :class="$style.menuList">
          <div :class="$style.productCategories">Catégories de miniatures</div>
          <div :class="$style.list">
            <div :class="$style.link">Voitures</div>
            <div :class="$style.link">Motos</div>
            <div :class="$style.link">Engins Agricoles</div>
            <div :class="$style.link">Engins de chantier</div>
            <div :class="$style.link">Bateaux</div>
          </div>
        </div>
      </div>
      <div :class="$style.productList">
        <div :class="$style.cardParent">
          <!-- Add WRC Image in background via /assets/images/Ogier.png -->
          <div :class="[$style.card, $style.wrcCard]">
            <div :class="$style.contentTop">
              <b :class="$style.heading">Voitures WRC</b>
              <div :class="$style.text">Découvrez nos séries de miniatures collector.</div>
            </div>
            <div :class="$style.navbar28Actions">
              <div :class="$style.button4">
                <div :class="$style.linkText">Voir tout</div>
              </div>
            </div>
          </div>
          <div :class="[$style.navbar28Card, $style.motogpCard]">
            <div :class="$style.contentTop">
              <b :class="$style.heading">MotoGP</b>
              <div :class="$style.text">Explorez nos MotoGP.</div>
            </div>
            <div :class="$style.navbar28Actions">
              <div :class="$style.button4">
                <div :class="$style.linkText">Voir tout</div>
              </div>
            </div>
          </div>
          <div :class="[$style.card, $style.enduranceCard]">
            <div :class="$style.contentTop">
              <b :class="$style.heading">Endurance</b>
              <div :class="$style.text">Parcourez nos collections d’endurance.</div>
            </div>
            <div :class="$style.navbar28Actions">
              <div :class="$style.button4">
                <div :class="$style.linkText">Voir tout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuth } from '@/services/api'

const { user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>
<style module>
.navbar28 {
  width: 100%;
  position: relative;
  background-color: #000;
  border-bottom: 1px solid #fff;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  font-size: 16px;
  color: #fff;
  font-family: Roboto;
}
.header {
  align-self: stretch;
  height: 72px;
  overflow: visible;
  position: relative;
  z-index: 50;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 64px;
  box-sizing: border-box;
}
.container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.content {
  display: flex;
  align-items: center;
  gap: 24px;
}
.companyLogo {
  height: 36px;
  width: 84px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.logoWide1Icon {
  position: absolute;
  top: calc(50% - 18px);
  left: calc(50% - 35.33px);
  width: 70px;
  height: 36px;
}
.column {
  overflow: visible;
  display: flex;
  align-items: center;
  gap: 32px;
}
.linkText {
  position: relative;
  line-height: 150%;
  color: inherit;
  text-decoration: none;
}
.linkText:visited,
.linkText:hover,
.linkText:active,
.linkText:focus-visible {
  color: inherit;
  text-decoration: none;
}
.navLinkDropdown {
  position: relative;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
}
.navLinkDropdown::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 14px;
}
.navLinkDropdown:hover .categoryDropdown,
.navLinkDropdown:focus-within .categoryDropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}
.chevronDownIcon {
  width: 8px;
  height: 8px;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(45deg) translateY(-1px);
  display: inline-block;
}
.categoryDropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 220px;
  background: #0b0b0b;
  border: 1px solid #2e2e2e;
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  pointer-events: none;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    visibility 0.2s ease;
  z-index: 80;
}
.categoryDropdownItem {
  line-height: 150%;
  color: #fff;
  padding: 8px 10px;
  border-radius: 6px;
  white-space: nowrap;
}
.categoryDropdownItem:hover {
  background-color: rgba(217, 166, 91, 0.18);
}
.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #d9a65b;
}
.button {
  border-radius: 8px;
  border: 2px solid #d9a65b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
}
.button2 {
  border-radius: 8px;
  background-color: #d9a65b;
  border: 2px solid #d9a65b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  color: #fff;
}
.megaMenu1 {
  position: relative;
  z-index: 10;
  align-self: stretch;
  border-bottom: 0px solid transparent;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0px 64px;
  gap: 48px;
  max-height: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-8px);
  transition:
    max-height 0.35s ease,
    opacity 0.25s ease,
    transform 0.25s ease,
    padding 0.25s ease,
    border-bottom-color 0.25s ease;
}
.navbar28:hover .megaMenu1 {
  border-bottom: 1px solid #fff;
  padding: 32px 64px;
  max-height: 360px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0);
}
.menu {
  align-self: stretch;
  width: 240px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}
.menuList {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.productCategories {
  align-self: stretch;
  position: relative;
  line-height: 150%;
  font-weight: 600;
}
.list {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.link {
  align-self: stretch;
  position: relative;
  line-height: 150%;
}
.productList {
  flex: 1;
  display: flex;
  align-items: flex-start;
  font-size: 32px;
}
.cardParent {
  height: 250px;
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 24px;
}
.card {
  height: 250px;
  width: 325.3px;
  overflow: hidden;
  position: relative;
  isolation: isolate;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 32px;
  box-sizing: border-box;
  gap: 32px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
}
.card > * {
  position: relative;
  z-index: 1;
}
.wrcCard::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('../../assets/images/ott.webp');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.35;
  z-index: 0;
}
.motogpCard {
  position: relative;
  isolation: isolate;
}
.motogpCard > * {
  position: relative;
  z-index: 1;
}
.motogpCard::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('../../assets/images/motogp.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.35;
  z-index: 0;
}
.enduranceCard::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('../../assets/images/24h.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.35;
  z-index: 0;
}
.contentTop {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.heading {
  align-self: stretch;
  position: relative;
  line-height: 130%;
}
.text {
  align-self: stretch;
  position: relative;
  font-size: 16px;
  line-height: 150%;
}
.navbar28Actions {
  align-self: stretch;
  display: flex;
  align-items: center;
  font-size: 16px;
}
.button4 {
  border-radius: 8px;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
}
.navbar28Card {
  height: 226px;
  width: 325.3px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 32px;
  box-sizing: border-box;
  gap: 32px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
}
</style>
