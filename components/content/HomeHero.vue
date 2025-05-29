<template>
  <section class="hero-section section-primary">
    <v-container class="py-12 py-md-16">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6" class="pr-md-12">
          <div class="hero-content mb-8">
            <h1 class="hero-title mb-6">
              Statewide Violence Prevention Plan for Illinois: 2025-2029
            </h1>
            <p class="hero-description mb-8">
              Violence is a global public health crisis. The prevention of violence is paramount. 
              Illinois is committed to supporting violence prevention initiatives through 
              trauma-informed, healing-centered practices across communities most impacted by violence.
            </p>
            <div class="hero-buttons d-flex flex-column flex-sm-row" style="gap: 20px;">
              <v-btn
                variant="outlined"
                size="large"
                class="rounded-pill px-8 py-3 elevation-2 hero-download-btn"
                @click="handleDownloadPlan"
                @keydown.enter="handleDownloadPlan"
                @keydown.space.prevent="handleDownloadPlan"
                aria-label="Download the complete Violence Prevention Plan PDF"
              >
                Download the Plan
                <v-icon end icon="mdi-download" />
              </v-btn>
              <v-btn
                variant="outlined"
                color="primary"
                size="large"
                class="rounded-pill px-8 py-3 hero-button"
                @click="handleLearnMore"
                @keydown.enter="handleLearnMore"
                @keydown.space.prevent="handleLearnMore"
                aria-label="Learn more about violence prevention in Illinois"
              >
                Learn More
              </v-btn>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="mt-8 mt-md-0">
          <div class="hero-image-container">
            <ImageWithSpinner
              src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
              alt="Youth violence prevention summit participants collaborating on community safety initiatives"
              image-class="hero-image rounded-xl"
              cover
              aspect-ratio="4/3"
              spinner-color="primary"
              spinner-size="50"
            />
            <div class="hero-image-decoration-1" aria-hidden="true"></div>
            <div class="hero-image-decoration-2" aria-hidden="true"></div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
/**
 * Home Hero Section Component
 *
 * Hero section for the Violence Prevention Plan homepage.
 * Features mission-driven content based on the VPP analysis with
 * compelling opening statements about violence prevention being paramount.
 *
 * Features:
 * - Mission-driven opening statements from VPP analysis
 * - Responsive layout that adapts to different screen sizes
 * - Animated content with fade-in and subtle movement effects
 * - Decorative background elements for visual interest
 * - Accessible image loading with spinner during load
 * - Respects user preferences for reduced motion
 * - Keyboard navigation support for interactive elements
 * - WCAG 2.1 AA accessibility compliance
 *
 * @component
 */
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';

/**
 * Handle Download the Plan button activation
 * Downloads the complete Violence Prevention Plan PDF document
 */
const handleDownloadPlan = () => {
  // Open the complete Violence Prevention Plan PDF in a new tab
  window.open('/files/Full_Report_Statewide_Violence_Prevention_Plan_2025-2029_2025_Update.pdf', '_blank');
};

/**
 * Handle Learn More button activation
 * Scrolls to the statistics section for more information
 */
const handleLearnMore = () => {
  // Scroll to statistics section
  const statisticsSection = document.querySelector('.statistics-section');
  if (statisticsSection) {
    statisticsSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
/**
 * Hero Section Styles
 * Maintains the exact styling patterns from the existing HeroSection component
 * while adapting content for the Violence Prevention Plan
 */

/* Main container with theme-aware background */
.hero-section {
  position: relative;
  overflow: hidden;
  /* Background handled by global .section-primary class */
  color: rgb(var(--v-theme-on-surface));
}

/* Hero content animations and styling to match original */
.hero-title {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
  /* Font styling to match original HeroSection.vue */
  font-size: 60px;
  font-weight: 600;
  line-height: 1.2;
  color: inherit;
  font-family: 'Roboto', sans-serif;
  letter-spacing: -0.02em;
}

.hero-description {
  opacity: 0;
  animation: fadeSlideUpDescription 0.8s forwards;
  animation-delay: 0.4s;
  /* Font styling to match original HeroSection.vue */
  font-size: 1rem;
  line-height: 1.6;
  color: inherit;
  font-family: 'Roboto', sans-serif;
  max-width: 90%;
}

.hero-buttons {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.6s;
}

/* Button hover effects */
.hero-button {
  transition: all 0.3s ease;
}

.hero-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Hero image container with decorative elements */
.hero-image-container {
  position: relative;
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.8s;
}

/* Hero image with 3D perspective and subtle animation */
.hero-image {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transform: perspective(1000px) rotateY(-5deg) rotateX(3deg);
  transition: all 0.5s ease;
  animation: subtlePulseImage 8s ease-in-out infinite alternate;
  animation-delay: 1.5s;
  will-change: transform, box-shadow;
}

.hero-image:hover {
  transform: perspective(1000px) rotateY(-2deg) rotateX(1deg) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* Decorative elements */
.hero-image-decoration-1,
.hero-image-decoration-2 {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  pointer-events: none;
  z-index: -1;
}

.hero-image-decoration-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-accent-base));
  top: -50px;
  right: -50px;
  animation: float 6s ease-in-out infinite;
}

.hero-image-decoration-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, var(--v-secondary-base), var(--v-primary-base));
  bottom: -30px;
  left: -30px;
  animation: float 8s ease-in-out infinite reverse;
}

/* Animations */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeSlideUpDescription {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 0.9;
    transform: translateY(0);
  }
}

@keyframes subtlePulseImage {
  0% {
    transform: perspective(1000px) rotateY(-5deg) rotateX(3deg) scale(1);
  }
  100% {
    transform: perspective(1000px) rotateY(-5deg) rotateX(3deg) scale(1.01);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* Dark theme adjustments */
:root[data-theme="dark"] .hero-image {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

:root[data-theme="dark"] .hero-image:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .hero-title {
    font-size: 48px; /* 80% of 60px to match original */
    line-height: 1.15;
  }

  .hero-description {
    max-width: 95%;
  }

  .hero-image-decoration-1,
  .hero-image-decoration-2 {
    display: none;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 36px; /* 60% of 60px to match original */
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }

  .hero-description {
    max-width: 100%;
    font-size: 0.95rem;
  }
}
</style>
