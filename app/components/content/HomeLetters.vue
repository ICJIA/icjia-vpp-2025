<template>
  <section class="letters-section section section-secondary py-16">
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
                    alt="A photo of ICJIA Executive Director Delrice Adams"
                    class="director-photo"
                  />
                  <p>
                    At the heart of our mission is a commitment to fairness and
                    opportunity. As we forge ahead in building more resilient,
                    safe, and thriving communities across Illinois, we must
                    strategically deploy every resource to realize
                    equity-centered violence prevention. The 2025-2029 Statewide
                    Violence Prevention Plan focuses on promoting health and
                    safety through trauma-informed violence prevention efforts
                    while advancing increased grant access and continued
                    collaboration across state, municipal, and community-based
                    agencies. We are incredibly proud of this comprehensive plan
                    and look forward to continued collaboration with
                    stakeholders across the state. This plan marks another
                    pivotal step on our journey to elevate the quality of life
                    in Illinois. Together, we will cultivate community
                    infrastructure that is essential for supporting truly
                    healthy communities.
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
