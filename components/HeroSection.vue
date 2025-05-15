<template>
  <section class="hero-section">
    <v-container class="py-16">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6" class="pr-md-12">
          <h1 class="text-h2 font-weight-bold mb-6 hero-title">
            Beautiful Design Meets <span class="text-primary">Powerful Functionality</span>
          </h1>
          
          <p class="text-body-1 mb-8 hero-description">
            Experience a perfect blend of aesthetics and performance in this elegantly crafted application.
            Built with Vue 3, Nuxt 3, and Vuetify 3 for a seamless user experience.
          </p>
          
          <div class="d-flex flex-wrap">
            <v-btn
              color="primary"
              size="large"
              class="text-none rounded-pill px-8 py-6 elevation-2 mr-4 mb-4 hero-button"
            >
              Get Started
              <v-icon end icon="mdi-arrow-right" />
            </v-btn>
            
            <v-btn
              variant="outlined"
              color="primary"
              size="large"
              class="text-none rounded-pill px-8 py-6 elevation-0 mb-4 hero-button"
            >
              Learn More
            </v-btn>
          </div>
        </v-col>
        
        <v-col cols="12" md="6" class="mt-8 mt-md-0">
          <div class="hero-image-container">
            <v-img
              src="https://images.pexels.com/photos/4339853/pexels-photo-4339853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
              alt="Hero Image"
              class="hero-image rounded-xl"
              cover
              aspect-ratio="4/3"
            />
            <div class="hero-image-decoration-1"></div>
            <div class="hero-image-decoration-2"></div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
}

.hero-title {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.hero-description {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
}

.hero-button {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.6s;
  transition: transform 0.3s ease;
}

.hero-button:hover {
  transform: translateY(-4px);
}

.hero-image-container {
  position: relative;
  opacity: 0;
  animation: fadeIn 1s forwards;
  animation-delay: 0.8s;
}

.hero-image {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transform: perspective(1000px) rotateY(-5deg) rotateX(3deg);
  transition: all 0.5s ease;
}

.hero-image:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.hero-image-decoration-1,
.hero-image-decoration-2 {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  z-index: -1;
}

.hero-image-decoration-1 {
  background: rgba(9, 98, 232, 0.2);
  width: 200px;
  height: 200px;
  top: -40px;
  right: -20px;
}

.hero-image-decoration-2 {
  background: rgba(124, 58, 237, 0.15);
  width: 250px;
  height: 250px;
  bottom: -60px;
  left: -40px;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>