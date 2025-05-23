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

export default defineNuxtPlugin((nuxtApp) => {
  // Register components for use in markdown
  nuxtApp.vueApp.component('TextWrapImage', TextWrapImage)
  nuxtApp.vueApp.component('ImageWithSpinner', ImageWithSpinner)
  nuxtApp.vueApp.component('CenteredImage', CenteredImage)

  // Log registration in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('📝 Registered markdown components: TextWrapImage, ImageWithSpinner, CenteredImage')
  }
})
