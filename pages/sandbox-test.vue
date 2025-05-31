<template>
  <div class="flexbox-wrapper">
    <div class="regular">This is the regular box</div>
    <div class="sticky">This is the sticky box</div>
  </div>
</template>
<script setup>
import { ref } from "vue";
</script>

<style>
.flexbox-wrapper {
  display: flex;
  overflow: auto;
  height: 400px; /* Not necessary -- for example only */
}
.regular {
  background-color: blue; /* Not necessary -- for example only */
  height: 1600px; /* Not necessary -- for example only */
}
.sticky {
  position: -webkit-sticky; /* for Safari */
  position: sticky;
  top: 0;
  align-self: flex-start; /* <-- this is the fix */
  background-color: red; /* Not necessary -- for example only */
}
</style>
