<script>
/**
 * Force scroll to top on page load
 *
 * This ensures the page always starts at the top when loaded.
 * Multiple methods are used for maximum browser compatibility.
 */
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage style="min-height: 70vh !important" />
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
