<template>
  <div class="about-page">
    <section class="hero-section py-16">
      <v-container>
        <v-row>
          <v-col cols="12" md="8" class="mx-auto text-center">
            <h1 class="text-h2 font-weight-bold mb-6 animate-title">About Us</h1>
            <p class="text-body-1 mb-8 animate-text">
              Learn more about our mission, values, and the team behind this elegant application.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <v-divider></v-divider>

    <section class="section py-16">
      <v-container>
        <v-row>
          <v-col cols="12" lg="6" class="pr-lg-12">
            <h2 class="text-h3 font-weight-bold mb-6">Our Story</h2>
            <p class="text-body-1 mb-4">
              Founded in 2025, we set out with a simple mission: to create digital experiences that are both beautiful and functional.
              Our team consists of passionate designers and developers who believe that great design and powerful technology should go hand in hand.
            </p>
            <p class="text-body-1 mb-4">
              We draw inspiration from companies like Apple that have mastered the art of combining aesthetics with usability.
              Every product we create reflects our commitment to quality, attention to detail, and user-centered design.
            </p>
            <p class="text-body-1">
              Our approach is grounded in the belief that technology should enhance human experiences, not complicate them.
              We strive to create interfaces that feel intuitive and delightful to use, making complex tasks simple and elegant.
            </p>
          </v-col>

          <v-col cols="12" lg="6" class="mt-8 mt-lg-0">
            <ImageWithSpinner
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
              alt="Our Team"
              image-class="rounded-xl about-image"
              height="400"
              cover
              spinner-color="primary"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="section py-16 bg-primary-lighten-5">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold mb-4">Our Values</h2>
          <p class="text-body-1 mx-auto" style="max-width: 600px;">
            The principles that guide everything we do.
          </p>
        </div>

        <v-row>
          <v-col v-for="(value, index) in values" :key="index" cols="12" md="4" class="mb-8">
            <v-card class="h-100 rounded-xl value-card pa-6" variant="elevated">
              <v-icon
                :icon="value.icon"
                size="x-large"
                color="primary"
                class="mb-4"
              ></v-icon>
              <h3 class="text-h5 font-weight-bold mb-2">{{ value.title }}</h3>
              <p class="text-body-2 text-medium-emphasis">{{ value.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="section py-16">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6" order="2" order-md="1" class="pr-md-12">
            <h2 class="text-h3 font-weight-bold mb-6">
              Our Approach
            </h2>

            <div v-for="(item, i) in approach" :key="i" class="mb-8 approach-item">
              <div class="d-flex align-start">
                <div class="approach-number mr-4">{{ i + 1 }}</div>
                <div>
                  <h3 class="text-h5 font-weight-bold mb-2">{{ item.title }}</h3>
                  <p class="text-body-2 text-medium-emphasis">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6" order="1" order-md="2" class="mb-8 mb-md-0">
            <ImageWithSpinner
              src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
              alt="Our Approach"
              image-class="rounded-xl about-image"
              aspect-ratio="4/3"
              cover
              spinner-color="primary"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="section py-16 bg-primary-lighten-5">
      <v-container>
        <div class="text-center">
          <h2 class="text-h3 font-weight-bold mb-6">Get In Touch</h2>
          <p class="text-body-1 mx-auto mb-8" style="max-width: 600px;">
            Have questions or want to learn more? We'd love to hear from you.
          </p>

          <v-btn
            color="primary"
            size="large"
            class="rounded-pill px-8 py-3 elevation-2 contact-button"
          >
            Contact Us
            <v-icon end icon="mdi-email-outline" />
          </v-btn>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';

const values = [
  {
    icon: 'mdi-heart-outline',
    title: 'User-Centered',
    description: 'We design for people first, putting their needs and experiences at the center of everything we create.'
  },
  {
    icon: 'mdi-lightbulb-outline',
    title: 'Innovation',
    description: 'We constantly explore new ideas and technologies to push the boundaries of what\'s possible.'
  },
  {
    icon: 'mdi-shield-check-outline',
    title: 'Quality',
    description: 'We maintain the highest standards in our work, paying attention to every detail no matter how small.'
  }
];

const approach = [
  {
    title: 'Understand',
    description: 'We begin by deeply understanding the problem and the people who will use our solution.'
  },
  {
    title: 'Design',
    description: 'We create intuitive, beautiful interfaces that make complex tasks feel simple and delightful.'
  },
  {
    title: 'Develop',
    description: 'We build with modern technologies and best practices to ensure performance and reliability.'
  },
  {
    title: 'Refine',
    description: 'We continuously test and improve our work based on real user feedback and data.'
  }
];
</script>

<style scoped>
.about-page {
  overflow-x: hidden;
}

.animate-title {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
}

.animate-text {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.about-image {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.5s ease;
}

.about-image:hover {
  transform: scale(1.02);
}

.value-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.approach-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--v-primary-base);
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.approach-item {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
}

.approach-item:nth-child(1) { animation-delay: 0.1s; }
.approach-item:nth-child(2) { animation-delay: 0.3s; }
.approach-item:nth-child(3) { animation-delay: 0.5s; }
.approach-item:nth-child(4) { animation-delay: 0.7s; }

.contact-button {
  transition: transform 0.3s ease;
}

.contact-button:hover {
  transform: translateY(-4px);
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
</style>