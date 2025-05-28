/**
 * Markdown Components Plugin
 *
 * This plugin registers Vue components that can be used directly in markdown files.
 * Components registered here will be available for use in Nuxt Content markdown files.
 *
 * @see https://content.nuxt.com/docs/files/markdown#vue-components
 */
import { defineNuxtPlugin } from '#app'
import TextWrapImage from '~/components/content/TextWrapImage.vue'
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue'
import CenteredImage from '~/components/content/CenteredImage.vue'
import HeroSection from '~/components/content/HeroSection.vue'
import FeatureSection from '~/components/content/FeatureSection.vue'
import HomeHighlights from '~/components/content/HomeHighlights.vue'
import HomeAction from '~/components/content/HomeAction.vue'
import AboutHero from '~/components/content/AboutHero.vue'
import AboutStory from '~/components/content/AboutStory.vue'
import AboutValues from '~/components/content/AboutValues.vue'
import AboutApproach from '~/components/content/AboutApproach.vue'
import AboutContact from '~/components/content/AboutContact.vue'

// Import home components for production use
import HomeHero from '~/components/content/HomeHero.vue'
import HomeStatistics from '~/components/content/HomeStatistics.vue'
import HomeGoals from '~/components/content/HomeGoals.vue'
import HomeStakeholders from '~/components/content/HomeStakeholders.vue'
import HomePrinciples from '~/components/content/HomePrinciples.vue'
import HomeApproach from '~/components/content/HomeApproach.vue'


export default defineNuxtPlugin((nuxtApp) => {
  // Register components for use in markdown
  nuxtApp.vueApp.component('TextWrapImage', TextWrapImage)
  nuxtApp.vueApp.component('ImageWithSpinner', ImageWithSpinner)
  nuxtApp.vueApp.component('CenteredImage', CenteredImage)
  nuxtApp.vueApp.component('HeroSection', HeroSection)
  nuxtApp.vueApp.component('FeatureSection', FeatureSection)
  nuxtApp.vueApp.component('HomeHighlights', HomeHighlights)
  nuxtApp.vueApp.component('HomeAction', HomeAction)
  nuxtApp.vueApp.component('AboutHero', AboutHero)
  nuxtApp.vueApp.component('AboutStory', AboutStory)
  nuxtApp.vueApp.component('AboutValues', AboutValues)
  nuxtApp.vueApp.component('AboutApproach', AboutApproach)
  nuxtApp.vueApp.component('AboutContact', AboutContact)

  // Register home components for production use
  nuxtApp.vueApp.component('HomeHero', HomeHero)
  nuxtApp.vueApp.component('HomeStatistics', HomeStatistics)
  nuxtApp.vueApp.component('HomeGoals', HomeGoals)
  nuxtApp.vueApp.component('HomeStakeholders', HomeStakeholders)
  nuxtApp.vueApp.component('HomePrinciples', HomePrinciples)
  nuxtApp.vueApp.component('HomeApproach', HomeApproach)


  // Log registration in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('📝 Registered markdown components: TextWrapImage, ImageWithSpinner, CenteredImage, HeroSection, FeatureSection, HomeHighlights, HomeAction, AboutHero, AboutStory, AboutValues, AboutApproach, AboutContact, HomeHero, HomeStatistics, HomeGoals, HomeStakeholders, HomePrinciples, HomeApproach')
  }
})
