<script setup>
/**
 * Hero Section Component
 *
 * A prominent banner section typically used at the top of landing pages.
 * Features a heading, description, call-to-action buttons, and hero image
 * with subtle animations and decorative elements.
 *
 * Features:
 * - Responsive layout that adapts to different screen sizes
 * - Animated content with fade-in and subtle movement effects
 * - Decorative background elements for visual interest
 * - Accessible image loading with spinner during load
 * - Respects user preferences for reduced motion
 * - Keyboard navigation support for interactive elements
 *
 * Accessibility Features:
 * - Proper heading hierarchy with semantic HTML
 * - ARIA labels for interactive elements
 * - Keyboard navigation support
 * - Decorative elements marked with aria-hidden
 * - Reduced motion support via media query
 *
 * @component
 * @requires ~/components/content/ImageWithSpinner
 */
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";

/**
 * Import the console logger
 *
 * NOTE: Console logging is intentionally enabled in all environments (including production)
 * during the pre-launch phase for monitoring and debugging purposes.
 */
import { useConsoleLogger } from "~/composables/useConsoleLogger";
const { logUI } = useConsoleLogger();

/**
 * Handle Get Started button activation
 *
 * This function is triggered when the user activates the primary CTA button
 * either by clicking or using keyboard navigation (Enter/Space).
 * In a real implementation, this would navigate to a sign-up or onboarding page.
 *
 * @returns {void}
 */
const handleGetStarted = () => {
  // This would typically navigate to a sign-up or onboarding page
  logUI("Get Started button activated", {
    component: "HeroSection",
    action: "primary-cta",
  });
};

/**
 * Handle Learn More button activation
 *
 * This function is triggered when the user activates the secondary CTA button
 * either by clicking or using keyboard navigation (Enter/Space).
 * In a real implementation, this would navigate to an about or features page.
 *
 * @returns {void}
 */
const handleLearnMore = () => {
  // This would typically navigate to an about or features page
  console.log("Learn More button activated");
};
</script>

<template>
  <section class="hero-section">
    <v-container class="py-12 py-md-16">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6" class="pr-md-12">
          <div class="hero-content mb-8">
            <slot mdc-unwrap="p" />
          </div>

          <div
            class="d-flex flex-wrap hero-buttons-container"
            role="group"
            aria-label="Main actions"
          >
            <v-btn
              color="primary"
              size="large"
              class="text-none rounded-pill px-8 py-3 elevation-2 hero-button"
              aria-label="Get Started with our application"
              @keydown.enter="handleGetStarted"
              @keydown.space.prevent="handleGetStarted"
              tabindex="0"
            >
              <span class="d-flex align-center justify-center">
                Get Started
                <v-icon
                  end
                  icon="mdi-arrow-right"
                  class="ml-2"
                  aria-hidden="true"
                />
              </span>
            </v-btn>

            <v-btn
              variant="outlined"
              color="primary"
              size="large"
              class="text-none rounded-pill px-8 py-3 elevation-0 hero-button"
              aria-label="Learn more about our application"
              @keydown.enter="handleLearnMore"
              @keydown.space.prevent="handleLearnMore"
              tabindex="0"
            >
              <span class="d-flex align-center justify-center">
                Learn More
              </span>
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="mt-8 mt-md-0">
          <div class="hero-image-container">
            <ImageWithSpinner
              src="https://placehold.co/1200x800?text=VPP+Image+Here"
              alt="Hero Image"
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

<style scoped>
/**
 * Hero Section Styles
 *
 * This stylesheet defines the visual appearance and animations for the hero section.
 * It includes:
 * - Staggered fade-in animations for text and buttons
 * - Hover and focus states for interactive elements
 * - Decorative background elements
 * - Subtle animations for visual interest
 * - Accessibility considerations for motion preferences
 */

/* Main container with theme-aware background */
.hero-section {
  position: relative;
  overflow: hidden; /* Prevent decorative elements from causing scrollbars */
  /* Theme-aware background colors */
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}

/* Dark theme specific styling */
.v-theme--dark .hero-section {
  background: #1a2234; /* Dark navy background for dark theme */
  color: white; /* White text for dark theme */
}

/* Light theme specific styling - softer background for reduced eye strain */
.v-theme--light .hero-section {
  background: #f6f7f8; /* Softer light background for light theme (was #f8f9fa) */
  color: #2c3e50; /* Dark text for light theme */
}

/* Hero content container with staggered animation */
.hero-content {
  opacity: 0; /* Start invisible */
  animation: fadeSlideUp 0.8s forwards; /* Fade in and slide up */
  animation-delay: 0.2s; /* Start first in the sequence */
}

/* Style the H1 heading from the slot content - theme aware */
.hero-content :deep(h1) {
  font-size: 60px; /* Exact size to match screenshot */
  font-weight: 600; /* Medium-bold weight matching screenshot */
  line-height: 1.2; /* Line height to match screenshot spacing */
  margin-bottom: 2rem; /* Space below heading to match screenshot */
  color: inherit; /* Inherit from parent theme color */
  font-family: "Roboto", sans-serif; /* Ensure consistent font family */
  letter-spacing: -0.02em; /* Slight negative letter spacing for modern look */
}

/* Dark theme H1 styling */
.v-theme--dark .hero-content :deep(h1) {
  color: white; /* Pure white text for dark theme */
}

/* Light theme H1 styling */
.v-theme--light .hero-content :deep(h1) {
  color: #2c3e50; /* Dark text for light theme */
}

/* Style bold text within H1 to have blue accent color - consistent across themes */
.hero-content :deep(h1 strong) {
  color: #1976d2; /* Blue accent color for both themes */
  font-weight: 600; /* Maintain consistent weight */
}

/* Style the paragraph content from the slot - theme aware */
.hero-content :deep(p) {
  font-size: 1rem; /* Standard body text size */
  line-height: 1.6; /* Good readability */
  margin-bottom: 2rem; /* More space below paragraph to match screenshot */
  color: inherit; /* Inherit from parent theme color */
  font-family: "Roboto", sans-serif; /* Consistent font family */
  max-width: 90%; /* Limit width for better readability */
  opacity: 0.9; /* Slightly muted for both themes */
}

/* Responsive heading sizes maintaining proportions */
@media (max-width: 960px) {
  .hero-content :deep(h1) {
    font-size: 48px; /* Proportionally smaller on tablets (80% of 60px) */
    line-height: 1.15; /* Slightly tighter line height for smaller screens */
  }

  .hero-content :deep(p) {
    max-width: 95%; /* Slightly wider on tablets */
  }
}

@media (max-width: 600px) {
  .hero-content :deep(h1) {
    font-size: 36px; /* Mobile size (60% of 60px) while maintaining impact */
    line-height: 1.1; /* Tighter line height for mobile */
    margin-bottom: 1.5rem; /* Reduced margin on mobile */
  }

  .hero-content :deep(p) {
    max-width: 100%; /* Full width on mobile */
    font-size: 0.95rem; /* Slightly smaller text on mobile */
  }
}

/* Button container with proper spacing */
.hero-buttons-container {
  gap: 20px; /* 20px gap between buttons to match screenshot */
}

/* Responsive button spacing */
@media (max-width: 600px) {
  .hero-buttons-container {
    gap: 16px; /* Slightly smaller gap on mobile */
  }
}

/* Description paragraph with staggered animation */
.hero-description {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s; /* Start after the title */
}

/* Call-to-action buttons with staggered animation and hover effects */
.hero-button {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.6s; /* Start after the description */
  transition: transform 0.3s ease; /* Smooth hover transition */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Button hover and keyboard focus effects */
.hero-button:hover,
.hero-button:focus-visible {
  transform: translateY(-4px); /* Subtle lift effect */
}

/* Enhanced focus indicator for accessibility */
.hero-button:focus-visible {
  outline: 3px solid var(--v-primary-base); /* High contrast outline */
  outline-offset: 2px; /* Space between button and outline */
}

/* Ensure button text is properly centered */
.hero-button span {
  width: 100%;
  text-align: center;
}

/* Primary button styling - consistent across themes */
.hero-content :deep(.v-btn--variant-elevated) {
  background: #1976d2 !important; /* Blue background for both themes */
  color: white !important; /* White text for both themes */
  font-weight: 500; /* Medium weight */
  text-transform: none; /* Preserve original case */
  letter-spacing: 0.02em; /* Slight letter spacing */
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3); /* Blue glow shadow */
  border-radius: 8px; /* Rounded corners */
  padding: 12px 24px; /* Comfortable padding */
  font-size: 0.95rem; /* Slightly smaller than default */
  transition: all 0.3s ease; /* Smooth transitions */
}

/* Primary button hover state */
.hero-content :deep(.v-btn--variant-elevated:hover) {
  background: #1565c0 !important; /* Darker blue on hover */
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4); /* Enhanced shadow */
  transform: translateY(-2px); /* Subtle lift effect */
}

/* Secondary button styling - theme aware */
.hero-content :deep(.v-btn--variant-outlined) {
  font-weight: 500; /* Medium weight */
  text-transform: none; /* Preserve original case */
  letter-spacing: 0.02em; /* Slight letter spacing */
  border-radius: 8px; /* Rounded corners */
  padding: 12px 24px; /* Comfortable padding */
  font-size: 0.95rem; /* Slightly smaller than default */
  transition: all 0.3s ease; /* Smooth transitions */
  background: transparent !important; /* Transparent background */
}

/* Dark theme secondary button */
.v-theme--dark .hero-content :deep(.v-btn--variant-outlined) {
  border: 2px solid rgba(255, 255, 255, 0.7) !important; /* White border */
  color: rgba(255, 255, 255, 0.9) !important; /* White text */
}

/* Light theme secondary button */
.v-theme--light .hero-content :deep(.v-btn--variant-outlined) {
  border: 2px solid rgba(44, 62, 80, 0.7) !important; /* Dark border */
  color: rgba(44, 62, 80, 0.9) !important; /* Dark text */
}

/* Dark theme secondary button hover */
.v-theme--dark .hero-content :deep(.v-btn--variant-outlined:hover) {
  background: rgba(255, 255, 255, 0.1) !important; /* Subtle white background */
  border-color: white !important; /* Solid white border */
  color: white !important; /* Pure white text */
  transform: translateY(-2px); /* Subtle lift effect */
}

/* Light theme secondary button hover */
.v-theme--light .hero-content :deep(.v-btn--variant-outlined:hover) {
  background: rgba(44, 62, 80, 0.1) !important; /* Subtle dark background */
  border-color: #2c3e50 !important; /* Solid dark border */
  color: #2c3e50 !important; /* Pure dark text */
  transform: translateY(-2px); /* Subtle lift effect */
}

/* Hero image container with floating animation */
.hero-image-container {
  position: relative;
  opacity: 0; /* Start invisible */
  /* Combined animations: fade in, then start floating */
  animation:
    fadeIn 1s forwards,
    subtleFloat 6s cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
  animation-delay: 0.8s, 1.2s; /* Fade in first, then start floating */
  will-change: opacity, transform; /* Optimize for animation performance */
  transform-style: preserve-3d; /* Enable 3D transformations */
}

/* Hero image with 3D perspective and subtle animation */
.hero-image {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  transform: perspective(1000px) rotateY(-5deg) rotateX(3deg); /* Slight 3D rotation */
  transition: all 0.5s ease; /* Smooth transition for hover effects */
  /* Subtle pulsing animation for the image itself */
  animation: subtlePulseImage 8s ease-in-out infinite alternate;
  animation-delay: 1.5s; /* Start after container animation begins */
  will-change: transform, box-shadow; /* Performance optimization */
}

/* Hero image hover effect */
.hero-image:hover {
  /* Flatten the perspective and add slight scale on hover */
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
}

/* Common styles for decorative background elements */
.hero-image-decoration-1,
.hero-image-decoration-2 {
  position: absolute;
  border-radius: 50%; /* Circular shape */
  filter: blur(60px); /* Heavy blur for soft glow effect */
  z-index: -1; /* Position behind the image */
}

/* Top-right decorative element (blue) */
.hero-image-decoration-1 {
  background: rgba(9, 98, 232, 0.25); /* Semi-transparent blue */
  width: 200px;
  height: 200px;
  top: -40px;
  right: -20px;
  /* Combined animations: pulsing size/opacity and subtle position movement */
  animation:
    subtlePulse 8s ease-in-out infinite alternate,
    subtleMove 15s ease-in-out infinite alternate;
  transform-origin: center center; /* Animation pivot point */
}

/* Bottom-left decorative element (purple) */
.hero-image-decoration-2 {
  background: rgba(124, 58, 237, 0.2); /* Semi-transparent purple */
  width: 250px;
  height: 250px;
  bottom: -60px;
  left: -40px;
  /* Combined animations with reverse direction from the first element */
  animation:
    subtlePulse 8s ease-in-out infinite alternate-reverse,
    subtleMove 12s ease-in-out infinite alternate-reverse;
  transform-origin: center center; /* Animation pivot point */
}

/* Animation Keyframes
 * -------------------------------------------------- */

/**
 * Fade and slide up animation
 * Used for text elements to create a staggered entrance effect
 */
@keyframes fadeSlideUp {
  from {
    opacity: 0; /* Start invisible */
    transform: translateY(20px); /* Start slightly below final position */
  }
  to {
    opacity: 1; /* End fully visible */
    transform: translateY(0); /* End at natural position */
  }
}

/**
 * Simple fade in animation
 * Used as a fallback for reduced motion preference
 */
@keyframes fadeIn {
  from {
    opacity: 0;
  } /* Start invisible */
  to {
    opacity: 1;
  } /* End fully visible */
}

/**
 * Floating animation with subtle 3D rotation
 * Creates an organic, floating movement for the hero image container
 */
@keyframes subtleFloat {
  0% {
    transform: translateY(0) rotate3d(1, 1, 0, 0deg);
  } /* Start position */
  50% {
    transform: translateY(-18px) rotate3d(1, 1, 0, 1deg);
  } /* Peak of float with slight rotation */
  100% {
    transform: translateY(-15px) rotate3d(1, 1, 0, -1deg);
  } /* End with different rotation */
}

/**
 * Pulsing animation for decorative elements
 * Changes size, opacity and blur to create a breathing effect
 */
@keyframes subtlePulse {
  0% {
    opacity: 0.8; /* Start semi-transparent */
    transform: scale(1); /* Start at normal size */
    filter: blur(60px); /* Maximum blur */
  }
  50% {
    opacity: 0.9; /* Increase visibility at midpoint */
    transform: scale(1.15); /* Grow slightly */
    filter: blur(55px); /* Slightly reduce blur */
  }
  100% {
    opacity: 1; /* End fully visible */
    transform: scale(1.2); /* End at largest size */
    filter: blur(50px); /* Minimum blur (still quite blurred) */
  }
}

/**
 * Subtle pulsing animation specifically for the hero image
 * Adjusts perspective, rotation, scale and shadow for a gentle breathing effect
 */
@keyframes subtlePulseImage {
  0% {
    /* Start state maintains the initial 3D effect */
    transform: perspective(1000px) rotateY(-5deg) rotateX(3deg) scale(1);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); /* Initial shadow */
  }
  100% {
    /* End state with reduced rotation and slight scale */
    transform: perspective(1000px) rotateY(-3deg) rotateX(2deg) scale(1.03);
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.15); /* Enhanced shadow */
  }
}

/**
 * Subtle movement animation for decorative elements
 * Creates an organic, floating path through 2D space
 */
@keyframes subtleMove {
  0% {
    transform: translate(0, 0);
  } /* Start at origin */
  25% {
    transform: translate(10px, 10px);
  } /* Move down-right */
  50% {
    transform: translate(-5px, 15px);
  } /* Move left and further down */
  75% {
    transform: translate(-10px, 5px);
  } /* Move further left and up */
  100% {
    transform: translate(5px, -10px);
  } /* End right and above start */
}

/**
 * Accessibility: Reduced Motion Support
 *
 * This media query respects the user's preference for reduced motion
 * by simplifying or removing animations that could cause discomfort.
 *
 * When prefers-reduced-motion is set to 'reduce':
 * - Complex animations are replaced with simple fades
 * - Continuous animations are disabled entirely
 * - Hover effects are simplified
 * - Transforms are removed
 *
 * This ensures the content remains accessible to users with vestibular disorders
 * or those who simply prefer less motion in their user interfaces.
 */
@media (prefers-reduced-motion: reduce) {
  /* Text elements get simple fade instead of slide */
  .hero-content,
  .hero-description,
  .hero-button {
    animation: fadeIn 0.5s forwards !important;
  }

  /* Image container gets simple fade and no floating */
  .hero-image-container {
    animation: fadeIn 1s forwards !important;
    animation-delay: 0.8s !important;
    transform: none !important; /* Remove all transforms */
  }

  /* Remove all animations and transforms from the image */
  .hero-image {
    animation: none !important;
    transform: none !important;
    transition: none !important; /* Disable hover transitions */
  }

  /* Simplify hover effect to just the shadow */
  .hero-image:hover {
    transform: none !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
  }

  /* Disable all animations for decorative elements */
  .hero-image-decoration-1,
  .hero-image-decoration-2 {
    animation: none !important;
    transform: none !important;
    filter: blur(60px) !important; /* Maintain blur for visual effect */
  }
}
</style>
