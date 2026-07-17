/**
 * Home page data — VERBATIM from Nuxt source components.
 *
 * Sources:
 *   app/components/content/HomeHero.vue
 *   app/components/content/HomeLetters.vue
 *   app/components/content/HomeLieutenantGovernor.vue
 *   app/components/content/HomeGoals.vue  (+ HomeGoalCard.vue)
 *   app/components/content/HomeAction.vue
 *
 * Icons use mdi: colon form (Astro/unplugin-icons convention).
 * All URLs end with trailing slash per project convention.
 */

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export const hero = {
  titleHighlight: "Statewide Violence Prevention Plan",
  titleSuffix: " for Illinois: 2025-2029",
  paragraphs: [
    "Violence is a global public health crisis. Violence is prevalent for many individuals and communities in Illinois, and a leading cause of death. Experiencing or perpetrating violence can result in an array of negative health, mental health, economic, and relational impacts. Thus, the prevention of violence is paramount.",
    "The Illinois Criminal Justice Information Authority (ICJIA) aims to continue funding and supporting violence prevention efforts across Illinois. This report was written to inform ICJIA’s violence prevention planning for 2025-2029, but also with the intent to be utilized by any state or community group interested in violence prevention efforts or in developing their own localized plan. This plan presents three violence prevention goals and recommendations within each goal.",
  ],
  buttons: [
    {
      label: "Download",
      url: "/download/",
      variant: "filled",
      ariaLabel: "Go to download page for the Violence Prevention Plan",
    },
    {
      label: "Learn More",
      scrollTarget: "#letters-section",
      variant: "outlined",
      ariaLabel: "Learn more about violence prevention in Illinois",
    },
  ],
  image: {
    src: "/images/vpp-cover.webp",
    alt: "Youth violence prevention summit participants collaborating on community safety initiatives",
    caption: "Click image to download",
    linkUrl: "/download/",
  },
};

// ---------------------------------------------------------------------------
// Letters (Adams + Stratton)
// ---------------------------------------------------------------------------
export const letters = {
  adams: {
    heading: "A message from ICJIA Executive Director Delrice Adams",
    photo: {
      src: "/images/DirectorAdamsResized.jpg",
      alt: "A photo of ICJIA Executive Director Delrice Adams",
      width: 150,
      height: 150,
    },
    body: "At the heart of our mission is a commitment to fairness and opportunity. As we forge ahead in building more resilient, safe, and thriving communities across Illinois, we must strategically deploy every resource to realize equity-centered violence prevention. The 2025-2029 Statewide Violence Prevention Plan focuses on promoting health and safety through trauma-informed violence prevention efforts while advancing increased grant access and continued collaboration across state, municipal, and community-based agencies. We are incredibly proud of this comprehensive plan and look forward to continued collaboration with stakeholders across the state. This plan marks another pivotal step on our journey to elevate the quality of life in Illinois. Together, we will cultivate community infrastructure that is essential for supporting truly healthy communities.",
    signature: ["Delrice Adams", "ICJIA Executive Director"],
  },
  stratton: {
    heading: "A message from Lieutenant Governor Juliana Stratton",
    photo: {
      src: "/images/stratton-lg-cropped.jpg",
      alt: "A photo of Lieutenant Governor Juliana Stratton",
      width: 150,
      height: 182, // natural 600×728 → 150w preserves aspect at 182h (prevents CLS)
    },
    body: "Since we first stepped into office, the Pritzker-Stratton administration has been committed to healing communities in partnership with the people we serve. For decades, too many voices have gone unheard, and too much pain has gone without relief. We are proud to uplift this statewide plan in service of those who need it most; by continuing to focus on equity, restoration, and effective violence prevention, Illinois is illuminating a path toward safer communities and healthier residents. Thank you to the members of the Violence Prevention Committee for dedicating your time and insight to empower change. Governor Pritzker and I look forward to working with Illinoisans across the state to implement this powerful plan of action.",
    signature: ["Juliana Stratton", "Illinois Lieutenant Governor"],
  },
};

// ---------------------------------------------------------------------------
// Goals (HomeGoals.vue + HomeGoalCard.vue)
// ---------------------------------------------------------------------------
export const goals = [
  {
    title: "Goals and Recommendations",
    description:
      "Explore comprehensive violence prevention strategies with actionable goals, evidence-based practices, and measurable outcomes designed to create lasting change in Illinois communities.",
    icon: "mdi:clipboard-list",
    url: "/plan/goals-and-recommendations/",
  },
  {
    title: "Resources",
    description:
      "Access a comprehensive collection of tools, research, training materials, and best practices to support violence prevention initiatives across communities and organizations.",
    icon: "mdi:book-open-variant",
    url: "/resources/",
  },
  {
    title: "Organizational and Agency Highlights",
    description:
      "Discover achievements, success stories, and innovative programs from organizations and agencies leading violence prevention efforts throughout Illinois.",
    icon: "mdi:trophy",
    url: "/organizational-and-agency-highlights/",
  },
];

// ---------------------------------------------------------------------------
// Action (HomeAction.vue)
// ---------------------------------------------------------------------------
export const action = {
  heading: "For More Information",
  subtitle:
    "Explore the full plan, find local resources, or learn how your organization can contribute to violence prevention efforts across Illinois.",
  cards: [
    {
      title: "Download the Plan",
      description:
        "Access the complete Violence Prevention Plan with detailed goals, recommendations, and implementation strategies in multiple formats.",
      icon: "mdi:download",
      buttonText: "Download",
      url: "/download/",
    },
    {
      title: "Read the Plan Online",
      description:
        "Browse the complete Violence Prevention Plan directly in your browser with interactive navigation and searchable content.",
      icon: "mdi:book-open-page-variant",
      buttonText: "Read Online",
      url: "/plan/front-cover/",
    },
    {
      title: "Contact Us",
      description:
        "Have questions about the Violence Prevention Plan? Need assistance with implementation? Get in touch with our team for support and guidance.",
      icon: "mdi:email",
      buttonText: "Contact",
      url: "/contact/",
    },
  ],
};

// ---------------------------------------------------------------------------
// Disabled sections (data preserved for future use — NOT rendered on home page)
// Data stubs retained so future implementers have a reference point.
// ---------------------------------------------------------------------------
// export const statistics = { /* HomeStatistics — disabled */ };
// export const approach   = { /* HomeApproach   — disabled */ };
// export const principles = { /* HomePrinciples — disabled */ };
// export const stakeholders = { /* HomeStakeholders — disabled */ };
// export const news       = { /* HomeNews — Phase 5 (needs news collection) */ };
// export const highlights = { /* HomeHighlights — fully dead */ };
