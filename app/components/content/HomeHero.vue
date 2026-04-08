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
          <div class="">
            <img
              src="/images/vpp-cover.png"
              alt="Youth violence prevention summit participants collaborating on community safety initiatives"
              class="hero-image"
              width="612"
              height="792"
              loading="lazy"
              @click="handleDownloadPlan"
              @keydown.enter="handleDownloadPlan"
              @keydown.space.prevent="handleDownloadPlan"
              tabindex="0"
              role="button"
              aria-label="Download the Violence Prevention Plan PDF"
            />

            <div
              class="hero-image-caption"
              @click="handleDownloadPlan"
              @keydown.enter="handleDownloadPlan"
              @keydown.space.prevent="handleDownloadPlan"
              tabindex="0"
              role="button"
              aria-label="Click image to download the Violence Prevention Plan PDF"
            >
              Click image to download
            </div>
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
 * Hero section for the Violence Prevention Plan homepage featuring mission-driven
 * content with compelling opening statements about violence prevention being paramount.
 * Includes an interactive hero image with professional hover effects and coordinated
 * animations that match the homepage design patterns.
 *
 * @component
 *
 * @features
 * **Content & Layout:**
 * - Mission-driven opening statements from VPP analysis
 * - Responsive two-column layout (text left, image right)
 * - Proportional hero image that scales with viewport
 * - Centered image positioning with proper aspect ratio maintenance
 * - Decorative background elements for visual interest
 *
 * **Interactive Elements:**
 * - Clickable hero image and caption that navigate to /download page
 * - Professional hover effects matching homepage card patterns
 * - Subtle upward transform (translateY(-4px)) on image hover
 * - Soft box-shadow effects that appear on hover for depth
 * - Smooth 0.3s ease transitions for professional animation
 * - Caption color change on hover for additional visual feedback
 *
 * **Animation System:**
 * - Coordinated fadeSlideUp animation sequence across all elements
 * - Staggered timing: title (0.2s) → description (0.4s) → buttons (0.6s) → image (0.8s) → caption (1.0s)
 * - Elements start with opacity: 0 and animate to full visibility
 * - Consistent 0.8s animation duration with cubic-bezier easing
 *
 * **Visual Design:**
 * - Flat, non-tilted image appearance (no 3D perspective transforms)
 * - No box-shadow in default state for clean, flush appearance
 * - Subtle border-radius (0.5rem) for visual polish
 * - Hover effects constrained to actual image dimensions (not container)
 * - Theme-aware styling with enhanced shadows in dark mode
 *
 * **Accessibility & Compliance:**
 * - WCAG 2.1 AA compliant contrast ratios in both light and dark themes
 * - Full keyboard accessibility with Enter and Space key support
 * - Proper ARIA attributes (role="button", aria-label) for screen readers
 * - Focusable elements with tabindex="0" for keyboard navigation
 * - Respects prefers-reduced-motion for users with motion sensitivity
 * - Maintains minimum 44px touch targets for mobile accessibility
 * - Comprehensive screen reader support with descriptive labels
 *
 * @example
 * ```vue
 * <HomeHero />
 * ```
 *
 * @since 2025-07-31 Enhanced with interactive hover effects and coordinated animations
 */
/**
 * Handle Download the Plan button and hero image/caption activation
 *
 * Navigates to the download page where users can choose from multiple formats
 * including PDF, accessible formats, and other document types. This function
 * is triggered by:
 * - Download button click
 * - Hero image click
 * - Hero caption click
 * - Keyboard activation (Enter/Space) on any of the above elements
 *
 * @function
 * @returns {void}
 * @example
 * // Triggered automatically by user interaction
 * handleDownloadPlan();
 */
const handleDownloadPlan = () => {
  // Navigate to the download page
  navigateTo("/download");
};

/**
 * Handle Learn More button activation
 *
 * Smoothly scrolls to the Letter from Delrice Adams section to provide users
 * with immediate context about the Violence Prevention Plan from ICJIA's
 * Executive Director. Uses native smooth scrolling behavior with proper offset
 * for fixed navigation header.
 *
 * @function
 * @returns {void}
 * @example
 * // Triggered by Learn More button click or keyboard activation
 * handleLearnMore();
 */
const handleLearnMore = () => {
  // Scroll to the Letter from Delrice Adams section (letters-section)
  const lettersSection = document.querySelector(".letters-section");
  if (lettersSection) {
    // Calculate offset for fixed navigation (80px as per project guidelines)
    const offset = 80;
    const elementPosition = lettersSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
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
/* .hero-image-wrapper {
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
} */

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

/* Custom elevation hover effect removed for flat appearance */

/* Base image styling - constrained to actual image dimensions */
.hero-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: 0.5rem;
  display: block;
  margin: 0 auto;
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.8s;
}

.hero-image:hover {
  transform: translateY(-4px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.2),
    0 4px 6px -2px rgba(0, 0, 0, 0.15);
}

/* WCAG 2.4.7: Visible focus indicator for hero image */
.hero-image:focus {
  outline: 3px solid #1976d2;
  outline-offset: 4px;
  transform: translateY(-4px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.2),
    0 4px 6px -2px rgba(0, 0, 0, 0.15);
}

.hero-image:focus-visible {
  outline: 3px solid #1976d2;
  outline-offset: 4px;
  transform: translateY(-4px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.2),
    0 4px 6px -2px rgba(0, 0, 0, 0.15);
}

/* Removed hover effects - keeping cursor pointer only */

/* Hero image caption styling */
.hero-image-caption {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  /* Use full on-surface text color to ensure >= 4.5:1 contrast in both themes */
  color: rgb(var(--v-theme-on-surface));
  transition: color 0.3s ease;
  cursor: pointer;
  user-select: none;
  width: 100%;
  order: 2;
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 1s;
}

.hero-image-caption:hover {
  color: rgb(var(--v-theme-primary));
}

/* WCAG 2.4.7: Visible focus indicator for hero image caption */
.hero-image-caption:focus {
  outline: 3px solid #1976d2;
  outline-offset: 2px;
  color: rgb(var(--v-theme-primary));
}

.hero-image-caption:focus-visible {
  outline: 3px solid #1976d2;
  outline-offset: 2px;
  color: rgb(var(--v-theme-primary));
}

/* Light theme: force black text for caption on light backgrounds */
:root:not([data-theme="dark"]) .hero-image-caption {
  color: #000000 !important;
}
:root:not([data-theme="dark"]) .hero-image-caption:hover,
:root:not([data-theme="dark"]) .hero-image-caption:focus {
  color: #0b3d91 !important;
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
    /* transform removed to achieve flat, non-tilted appearance */
  }

  /* Removed hover effects for desktop - keeping cursor pointer only */

  /* Update the pulse animation for desktop - transforms removed for flat appearance */
  @keyframes subtlePulseImage {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.01);
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
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-accent))
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
    rgb(var(--v-theme-secondary)),
    rgb(var(--v-theme-primary))
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
    transform: scale(1);
  }
  100% {
    transform: scale(1.01);
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

/* Dark theme hover effects - matching homepage card patterns */
:root[data-theme="dark"] .hero-image:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.6),
    0 4px 6px -2px rgba(0, 0, 0, 0.5);
}

/* Reduced motion support - disable hover transforms for accessibility */
@media (prefers-reduced-motion: reduce) {
  .hero-image {
    transition: none !important;
  }

  .hero-image:hover {
    transform: none !important;
  }
}
</style>
