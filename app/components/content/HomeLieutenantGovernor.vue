<template>
  <section class="letters-section section section-primary py-16">
    <v-container>
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
          A message from Lieutenant Governor Juliana Stratton
        </h2>
      </div>

      <div class="message-wrapper">
        <div class="message-card">
          <v-card variant="elevated" class="rounded-xl message-card-inner">
            <v-card-text class="pa-8 pa-md-12">
              <div class="message-content">
                <div class="message-text">
                  <img
                    src="/images/stratton-lg-cropped.jpg"
                    alt="Lieutenant Governor Juliana Stratton"
                    class="director-photo"
                   
                  />
                  <p>
                    Since we first stepped into office, the Pritzker-Stratton
                    administration has been committed to healing communities in
                    partnership with the people we serve. For decades, too many
                    voices have gone unheard, and too much pain has gone without
                    relief. We are proud to uplift this statewide plan in
                    service of those who need it most; by continuing to focus on
                    equity, restoration, and effective violence prevention,
                    Illinois is illuminating a path toward safer communities and
                    healthier residents. Thank you to the members of the
                    Violence Prevention Committee for dedicating your time and
                    insight to empower change. Governor Pritzker and I look
                    forward to working with Illinoisans across the state to
                    implement this powerful plan of action.
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
// Simple hardcoded component for Lieutenant Governor message
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
