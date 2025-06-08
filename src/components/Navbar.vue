<template>
  <nav class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo / Titre -->
        <router-link to="/home" class="text-2xl font-bold text-red-700">Forge Miniatures</router-link>

        <!-- Navigation -->
        <ul class="hidden md:flex space-x-8">
          <li>
            <router-link to="/home" class="text-gray-800">
              Home
            </router-link>
          </li>
          <li>
            <router-link to="/contact" class="text-gray-800">
              Nous contacter
            </router-link>
          </li>
          <li>
            <router-link to="/connexion" class="text-gray-800">
              Connexion
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <main class="pt-16">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">Bienvenue sur Forge Miniatures</h1>
    <p class="text-gray-700 mb-6">
      Explorez notre collection de miniatures et découvrez les dernières nouveautés.
    </p>
  </div>
</main>
</template>

<style scoped>
/* Le padding supérieur du body peut être ajusté pour éviter que le contenu soit caché sous la navbar */
body {
  padding-top: 4rem;
}
</style>
