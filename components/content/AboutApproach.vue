<template>
  <section class="section py-16">
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="6" order="2" order-md="1" class="pr-md-12">
          <div class="mb-6">
            <slot />
          </div>

          <div class="mb-8 approach-item">
            <div class="d-flex align-start">
              <div class="approach-number mr-4" aria-hidden="true">1</div>
              <div>
                <slot name="lumen-enim-vitae" />
              </div>
            </div>
          </div>

          <div class="mb-8 approach-item">
            <div class="d-flex align-start">
              <div class="approach-number mr-4" aria-hidden="true">2</div>
              <div>
                <slot name="aliquam-ypsum-omnis" />
              </div>
            </div>
          </div>

          <div class="mb-8 approach-item">
            <div class="d-flex align-start">
              <div class="approach-number mr-4" aria-hidden="true">3</div>
              <div>
                <slot name="aliquam-omnis" />
              </div>
            </div>
          </div>

          <div class="mb-8 approach-item">
            <div class="d-flex align-start">
              <div class="approach-number mr-4" aria-hidden="true">4</div>
              <div>
                <slot name="ipsum-enim-vita-lumen" />
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" order="1" order-md="2" class="mb-8 mb-md-0">
          <ImageWithSpinner
            src="https://placehold.co/1200x800?text=VPP+Image+Here"
            alt="Our Approach"
            image-class="rounded-xl about-image"
            aspect-ratio="4/3"
            cover
            spinner-color="primary"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
/**
 * AboutApproach component for the About page
 *
 * This component displays the approach methodology section with:
 * - Numbered approach steps with animations
 * - Responsive layout with image and text
 * - Proper heading hierarchy for accessibility
 * - Staggered animations for visual appeal
 *
 * @component
 */
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';


</script>

<style scoped>
.about-image {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.5s ease;
}

/* Dark mode about image shadow */
:root[data-theme="dark"] .about-image {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
}

.about-image:hover {
  transform: scale(1.02);
}

.approach-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--v-primary-base);
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.approach-item {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
}

.approach-item:nth-child(1) { animation-delay: 0.1s; }
.approach-item:nth-child(2) { animation-delay: 0.3s; }
.approach-item:nth-child(3) { animation-delay: 0.5s; }
.approach-item:nth-child(4) { animation-delay: 0.7s; }

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .about-image {
    transition: none !important;
  }

  .about-image:hover {
    transform: none !important;
  }

  .approach-item {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
}

/* Markdown content styling */
:deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

:deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

:deep(strong) {
  font-weight: 700;
}

:deep(em) {
  font-style: italic;
}
</style>
