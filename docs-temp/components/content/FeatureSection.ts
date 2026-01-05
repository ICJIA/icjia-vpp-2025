/**
 * @module FeatureSection
 * @fileoverview Vue component: FeatureSection
 */

/**
 * Feature Section Component
 *
 * Displays the main features section with a title, description, and feature cards.
 * This component now uses slots for content management, allowing all text content
 * to be defined in markdown files for better searchability and content management.
 *
 * Features:
 * - Responsive grid layout for feature cards
 * - Slot-based content management for title, description, and individual features
 * - Staggered animations for visual appeal
 * - Accessible card components with proper ARIA attributes
 *
 * @component
 */
import FeatureCard from "~/components/content/FeatureCard.vue";
