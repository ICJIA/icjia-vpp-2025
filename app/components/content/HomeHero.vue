<template>
  <section class="hero-section section-primary">
    <v-container class="py-12 py-md-16">
      <v-row align="center" justify="space-between" class="hero-row">
        <v-col cols="12" md="6" class="pr-md-12">
          <div class="hero-content mb-8">
            <h1 class="hero-title mb-6">
              <span class="hero-title-highlight"
                >Statewide Violence Prevention Plan</span
              >
              for Illinois: 2025-2029
            </h1>
            <p class="hero-description mb-8">
              Violence is a global public health crisis. Violence is prevalent
              for many individuals and communities in Illinois, and a leading
              cause of death. Experiencing or perpetrating violence can result
              in an array of negative health, mental health, economic, and
              relational impacts. Thus, the prevention of violence is paramount.
            </p>
            <p class="hero-description mb-8">
              The Illinois Criminal Justice Information Authority (ICJIA) aims
              to continue funding and supporting violence prevention efforts
              across Illinois. This report was written to inform ICJIA’s
              violence prevention planning for 2025-2029, but also with the
              intent to be utilized by any state or community group interested
              in violence prevention efforts or in developing their own
              localized plan. This plan presents three violence prevention goals
              and recommendations within each goal.
            </p>
            <div
              class="hero-buttons d-flex flex-column flex-sm-row"
              style="gap: 20px"
            >
              <v-btn
                variant="flat"
                color="primary"
                size="large"
                class="rounded-pill px-8 py-3 elevation-2 hero-download-btn"
                @click="handleDownloadPlan"
                @keydown.enter="handleDownloadPlan"
                @keydown.space.prevent="handleDownloadPlan"
                aria-label="Go to download page for the Violence Prevention Plan"
              >
                Download
                <!-- <v-icon end icon="mdi-download" /> -->
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
          <div class="hero-image-wrapper">
            <v-card
              class="hero-image-card"
              @click="handleDownloadPlan"
              role="button"
              tabindex="0"
              @keydown.enter="handleDownloadPlan"
              @keydown.space="handleDownloadPlan"
              aria-label="Download the Violence Prevention Plan"
              :elevation="0"
              rounded="0"
            >
              <img
                src="/images/front-cover.png"
                alt="Youth violence prevention summit participants collaborating on community safety initiatives"
                class="hero-image"
                loading="lazy"
              />
            </v-card>
            <div class="hero-image-caption">Click to Download</div>
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
 * - Proportional hero image that scales with content and viewport
 * - Centered image positioning (both horizontal and vertical)
 * - Responsive height matching between image and text content
 * - Animated content with fade-in and subtle movement effects
 * - Decorative background elements for visual interest
 * - Accessible image loading with spinner during load
 * - Cursor pointer indication for visual feedback (hover effects removed)
 * - Clickable hero image that navigates to download page
 * - Centered caption beneath image indicating interactive nature
 * - WCAG 2.1 AA compliant contrast ratios in both themes
 * - Keyboard accessible with Enter and Space key support
 * - Proper ARIA labeling for screen readers
 * - Respects user preferences for reduced motion
 * - WCAG 2.1 AA accessibility compliance
 *
 * @component
 */
// Removed ImageWithSpinner import - using simple v-card with img tag instead

/**
 * Handle Download the Plan button activation
 * Navigates to the download page where users can choose from multiple formats
 */
const handleDownloadPlan = () => {
  // Navigate to the download page
  navigateTo("/download");
};

/**
 * Handle Learn More button activation
 * Scrolls to the letters section for more information
 */
const handleLearnMore = () => {
  // Scroll to letters section
  const lettersSection = document.querySelector(".letters-section");
  if (lettersSection) {
    lettersSection.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<style scoped>
/* ===== HERO SECTION - COMPLETE REFACTOR ===== */

/* Base hero section */
.hero-section {
  position: relative;
  /* overflow: hidden; - Removed to allow box shadow on hero image */
  color: rgb(var(--v-theme-on-surface));
}

/* Dark mode: match hero section background to image background */
.v-theme--dark .hero-section {
  background-color: #2c3e50;
}

/* Typography */
.hero-title {
  font-size: 36px;
  font-weight: 600;
  line-height: 1.2;
  color: inherit;
  font-family: "Roboto", sans-serif;
  letter-spacing: -0.02em;
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.hero-title-highlight {
  color: rgb(var(--v-theme-primary));
}

.hero-description {
  font-size: 1rem;
  line-height: 1.6;
  color: inherit;
  font-family: "Roboto", sans-serif;
  max-width: 100%;
  opacity: 0;
  animation: fadeSlideUpDescription 0.8s forwards;
  animation-delay: 0.4s;
}

.hero-buttons {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.6s;
}

.hero-button {
  transition: all 0.3s ease;
}

.hero-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* ===== IMAGE SECTION - MOBILE FIRST ===== */

/* Base image wrapper - mobile */
.hero-image-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  padding: 2rem;
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.8s;
}

/* Hero image card */
.hero-image-card {
  display: block !important;
  cursor: pointer !important;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  background: rgb(var(--v-theme-surface)) !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 0 !important;
}

/* Override any default Vuetify card padding and spacing */
.hero-image-card :deep(.v-card__content),
.hero-image-card :deep(.v-card-text),
.hero-image-card :deep(.v-card-item),
.hero-image-card :deep(.v-card-actions) {
  padding: 0 !important;
  margin: 0 !important;
}

/* Ensure the card itself has no internal spacing */
.hero-image-card.v-card {
  padding: 0 !important;
  margin: 0 !important;
}

/* Custom elevation hover effect for smoother transition */
.hero-image-card:hover {
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12) !important;
}

/* Base image styling - fills card completely with no spacing */
.hero-image {
  width: 100%;
  max-width: 100vw;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: perspective(800px) rotateY(-3deg) rotateX(2deg);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: subtlePulseImage 8s ease-in-out infinite alternate;
  animation-delay: 1.5s;
  will-change: transform, box-shadow;
  display: block;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 0 !important;
  border: none !important;
  outline: none !important;
}

/* Removed hover effects - keeping cursor pointer only */

/* Hero image caption styling */
.hero-image-caption {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  transition: color 0.3s ease;
  pointer-events: none;
  user-select: none;
  width: 100%;
  order: 2;
}

/* Image sizing is now handled directly by .hero-image class */

/* ===== RESPONSIVE BREAKPOINTS ===== */

/* Medium screens (tablets/small laptops) - match x-small size */
@media (min-width: 650px) and (max-width: 1000px) {
  .hero-image {
    width: 100vw !important;
    max-width: 100vw !important;
    height: auto !important;
    max-height: 90vh !important;
    object-fit: contain !important;
  }
}

/* Extra small phones - maximum possible size */
@media (max-width: 480px) {
  .hero-image {
    max-width: 100vw !important;
    max-height: 90vh !important;
  }

  /* Hide decorative elements on mobile */
  .hero-image-decoration-1,
  .hero-image-decoration-2 {
    display: none;
  }
}

/* Small tablets - but override for our target range */
@media (min-width: 600px) and (max-width: 649px) {
  .hero-title {
    font-size: 42px;
  }

  .hero-image {
    max-width: 480px;
    max-height: 360px;
  }

  .hero-image-container :deep(.image-container),
  .hero-image-container :deep(.v-img),
  .hero-image-container :deep(.v-img__img) {
    max-width: 480px !important;
    max-height: 360px !important;
    object-fit: contain !important;
  }
}

/* Tablets - but override for our target range */
@media (min-width: 768px) and (max-width: 1000px) {
  .hero-title {
    font-size: 48px;
  }

  /* Force large size in our target range */
  .hero-image {
    width: 100vw !important;
    max-width: 100vw !important;
    height: auto !important;
    max-height: 90vh !important;
    object-fit: contain !important;
  }

  .hero-image-container :deep(.image-container),
  .hero-image-container :deep(.v-img),
  .hero-image-container :deep(.v-img__img) {
    width: 100vw !important;
    max-width: 100vw !important;
    height: auto !important;
    max-height: 90vh !important;
    object-fit: contain !important;
  }

  /* Hide decorative elements on tablets */
  .hero-image-decoration-1,
  .hero-image-decoration-2 {
    display: none;
  }
}

/* Desktop */
@media (min-width: 960px) {
  .hero-title {
    font-size: 54px;
  }

  .hero-image-container {
    margin-top: 0;
  }

  .hero-image {
    max-width: 580px;
    max-height: 440px;
    transform: perspective(1000px) rotateY(-5deg) rotateX(3deg);
  }

  /* Removed hover effects for desktop - keeping cursor pointer only */

  /* Update the pulse animation for desktop */
  @keyframes subtlePulseImage {
    0% {
      transform: perspective(1000px) rotateY(-5deg) rotateX(3deg) scale(1);
    }
    100% {
      transform: perspective(1000px) rotateY(-5deg) rotateX(3deg) scale(1.01);
    }
  }

  .hero-image-container :deep(.image-container),
  .hero-image-container :deep(.v-img),
  .hero-image-container :deep(.v-img__img) {
    max-width: 580px !important;
    max-height: 440px !important;
    object-fit: contain !important;
  }
}

/* Large desktop */
@media (min-width: 1200px) {
  .hero-title {
    font-size: 60px;
  }

  .hero-image {
    max-width: 620px;
    max-height: 480px;
  }

  .hero-image-container :deep(.image-container),
  .hero-image-container :deep(.v-img),
  .hero-image-container :deep(.v-img__img) {
    max-width: 620px !important;
    max-height: 480px !important;
    object-fit: contain !important;
  }
}

/* ===== LARGE SCREENS - SMALLER IMAGES ===== */

/* Extra large desktop - much larger for impact */
@media (min-width: 1400px) {
  .hero-image {
    max-width: 750px !important;
    max-height: 500px !important;
  }

  .hero-image-container :deep(.image-container),
  .hero-image-container :deep(.v-img),
  .hero-image-container :deep(.v-img__img) {
    max-width: 750px !important;
    max-height: 500px !important;
    object-fit: contain !important;
  }
}

/* Ultra wide screens - maximum impact */
@media (min-width: 1600px) {
  .hero-image {
    max-width: 800px !important;
    max-height: 550px !important;
  }

  .hero-image-container :deep(.image-container),
  .hero-image-container :deep(.v-img),
  .hero-image-container :deep(.v-img__img) {
    max-width: 800px !important;
    max-height: 550px !important;
    object-fit: contain !important;
  }
}

/* ===== DECORATIVE ELEMENTS ===== */

/* Decorative floating elements */
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
  background: linear-gradient(
    135deg,
    var(--v-primary-base),
    var(--v-accent-base)
  );
  top: -50px;
  right: -50px;
  animation: float 6s ease-in-out infinite;
}

.hero-image-decoration-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(
    135deg,
    var(--v-secondary-base),
    var(--v-primary-base)
  );
  bottom: -30px;
  left: -30px;
  animation: float 8s ease-in-out infinite reverse;
}

/* ===== ANIMATIONS ===== */

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
    transform: perspective(800px) rotateY(-3deg) rotateX(2deg) scale(1);
  }
  100% {
    transform: perspective(800px) rotateY(-3deg) rotateX(2deg) scale(1.01);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* ===== DARK THEME ===== */

:root[data-theme="dark"] .hero-image {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

/* Removed dark theme hover effects - keeping cursor pointer only */

/* Dark theme caption styling */
:root[data-theme="dark"] .hero-image-caption {
  color: rgba(255, 255, 255, 0.8);
}

/* Reduced motion support - disable hover transforms for accessibility */
@media (prefers-reduced-motion: reduce) {
  .hero-image-container :deep(img) {
    transition: none !important;
  }

  .hero-image-container :deep(img):hover {
    transform: perspective(800px) rotateY(-3deg) rotateX(2deg) !important;
  }
}
</style>
