<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <Navbar />
  <router-view />
  <SiteFooter />
</template>