<script setup>
/**
 * Force scroll to top on page load
 *
 * This ensures the page always starts at the top when loaded.
 * Multiple methods are used for maximum browser compatibility.
 */
onMounted(() => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
</script>

<template>
  <NuxtLayout>
    <NuxtErrorBoundary>
      <NuxtPage style="min-height: 70vh !important" />
      <template #error="{ error, clearError }">
        <div
          role="alert"
          style="
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          "
        >
          <div style="text-align: center; max-width: 500px">
            <h1 style="font-size: 1.5rem; margin-bottom: 1rem">
              Something went wrong
            </h1>
            <p style="margin-bottom: 1.5rem; opacity: 0.8">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              style="
                padding: 12px 24px;
                border: 1px solid currentColor;
                border-radius: 8px;
                background: transparent;
                color: inherit;
                cursor: pointer;
                font-size: 1rem;
                min-height: 44px;
              "
              @click="clearError({ redirect: '/' })"
            >
              Return to Home
            </button>
          </div>
        </div>
      </template>
    </NuxtErrorBoundary>
  </NuxtLayout>
</template>

<style>
html {
  scroll-behavior: smooth;
}

body {
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
