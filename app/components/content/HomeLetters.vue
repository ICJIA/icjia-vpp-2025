<template>
  <section class="letters-section section section-primary py-16">
    <v-container>
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
          A message from ICJIA Executive Director Delrice Adams
        </h2>
      </div>

      <div class="message-wrapper">
        <div class="message-card">
          <v-card variant="elevated" class="rounded-xl message-card-inner">
            <v-card-text class="pa-8 pa-md-12">
              <div class="message-content">
                <div class="message-text">
                  <!--  -->
                  <!-- <p class="mb-10" style="font-weight: 900">
                    <em>A message from ICJIA Executive Director Delrice Adams</em>
                  </p> -->
                  <img
                    src="/images/DirectorAdamsResized.jpg"
                    alt="ICJIA Executive Director Delrice Adams"
                    class="director-photo"
                  />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Sed ut
                    perspiciatis unde omnis iste natus error sit voluptatem
                    accusantium doloremque laudantium, totam rem aperiam, eaque
                    ipsa quae ab illo inventore veritatis et quasi architecto
                    beatae vitae dicta sunt explicabo.
                  </p>
                  <p>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                    odit aut fugit. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat. Duis aute irure dolor in reprehenderit in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                  <p>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                    odit aut fugit. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat. Duis aute irure dolor in reprehenderit in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
// Simple hardcoded component
</script>

<style scoped>
.message-card {
  width: 100%;
}

.message-card-inner {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background: rgb(var(--v-theme-surface)) !important;
  transition: all 0.3s ease;
}

.message-card-inner:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-2px);
}

.message-content {
  line-height: 1.7;
  font-size: 1.1rem;
}

.message-text {
  line-height: 1.7;
  font-size: 1.1rem;
  text-align: left;
  overflow: hidden; /* Ensures proper text wrapping around floated image */
}

.director-message-intro {
  font-style: italic;
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.director-photo {
  float: left;
  width: 150px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-top: 5px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  shape-outside: margin-box;
}

.message-paragraph {
  margin-bottom: 1rem;
  text-align: left;
}

/* Dark theme card styling */
:root[data-theme="dark"] .message-card-inner {
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
}

:root[data-theme="dark"] .message-card-inner:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
}

@media (max-width: 768px) {
  .director-photo {
    width: 120px !important;
    margin-right: 15px !important;
  }

  .message-content {
    font-size: 1rem;
  }
}
</style>
