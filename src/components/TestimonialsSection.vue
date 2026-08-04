<!-- src/components/TestimonialsSection.vue -->
<template>
  <section :class="$style.testimonials">
    <div :class="$style.header">
      <h2 :class="$style.title">Témoignages de passionnés</h2>
      <p :class="$style.subtitle">Ce que nos collectionneurs disent de Fabrik'Miniatures</p>
    </div>

    <div :class="$style.grid">
      <article v-for="(item, index) in testimonials" :key="index" :class="$style.card">
        <div :class="$style.quoteMark">"</div>

        <div :class="$style.stars" aria-hidden="true">
          <span v-for="n in 5" :key="n" :class="$style.star">★</span>
        </div>

        <p :class="$style.quote">{{ item.quote }}</p>

        <div :class="$style.author">
          <div :class="$style.avatar">{{ initials(item.name) }}</div>
          <div>
            <p :class="$style.authorName">{{ item.name }}</p>
            <p :class="$style.authorRole">{{ item.role }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Testimonial {
  quote: string
  name: string
  role: string
}

const testimonials: Testimonial[] = [
  {
    quote: 'Chaque miniature est un chef-d\'œuvre de précision et de détail.',
    name: 'Marc Dupont',
    role: 'Collectionneur passionné',
  },
  {
    quote: 'Une qualité de fabrication qui dépasse toutes mes attentes.',
    name: 'Sophie Martin',
    role: 'Passionnée de modélisme',
  },
  {
    quote: 'Une collection qui raconte des histoires, miniature après miniature.',
    name: 'Jean Leclerc',
    role: 'Amateur de miniatures',
  },
]

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
</script>

<style module>
.testimonials {
  padding: 64px;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  line-height: 130%;
  margin: 0 0 8px;
}

.subtitle {
  font-size: 16px;
  line-height: 150%;
  color: var(--color-text-muted);
  margin: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  position: relative;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-elevated);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.25s ease, transform 0.25s ease;
}

.card:hover {
  border-color: var(--color-accent);
  transform: translateY(-4px);
}

.quoteMark {
  position: absolute;
  top: 16px;
  right: 24px;
  font-size: 64px;
  line-height: 1;
  font-family: Georgia, serif;
  color: var(--color-accent);
  opacity: 0.15;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: var(--color-accent);
  font-size: 16px;
}

.quote {
  font-size: 15px;
  line-height: 160%;
  color: var(--color-text);
  margin: 0;
  font-style: italic;
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid var(--color-border);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-accent);
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.authorName {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.authorRole {
  font-size: 13px;
  color: var(--color-text-subtle);
  margin: 0;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .testimonials {
    padding: 32px 24px;
  }
}
</style>