<script setup>
/**
 * Structured Data Component for Enhanced SEO
 *
 * This component generates JSON-LD structured data markup to help search engines
 * better understand the content and context of pages. It supports multiple schema
 * types including Organization, WebSite, Article, and Government Organization.
 *
 * Features:
 * - Automatic schema type detection based on content
 * - Organization and website markup for homepage
 * - Article markup for content pages
 * - Government organization schema for official content
 * - Breadcrumb navigation markup
 * - Search action markup for enhanced search results
 *
 * @component
 * @seo Structured data for search engines
 * @accessibility Enhanced semantic markup
 */

const props = defineProps({
  /**
   * Content object from Nuxt Content
   * @type {Object}
   */
  content: {
    type: Object,
    default: () => ({})
  },
  
  /**
   * Page type for schema selection
   * @type {String}
   */
  pageType: {
    type: String,
    default: 'article',
    validator: (value) => ['homepage', 'article', 'organization', 'government'].includes(value)
  },
  
  /**
   * Current route path
   * @type {String}
   */
  path: {
    type: String,
    default: '/'
  }
});

const route = useRoute();
const baseUrl = 'https://vpp-2025.netlify.app';

/**
 * Generate organization schema markup
 * Used for homepage and organizational pages
 */
const organizationSchema = computed(() => ({
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  "name": "Illinois Criminal Justice Information Authority",
  "alternateName": "ICJIA",
  "url": "https://icjia.illinois.gov",
  "logo": {
    "@type": "ImageObject",
    "url": `${baseUrl}/images/illinois-seal.png`,
    "width": 1200,
    "height": 1198
  },
  "description": "The Illinois Criminal Justice Information Authority (ICJIA) aims to continue funding and supporting violence prevention efforts across Illinois.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Chicago",
    "addressRegion": "IL",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "cja.irc@illinois.gov"
  },
  "sameAs": [
    "https://twitter.com/ICJIA_Illinois",
    "https://www.facebook.com/ICJIA",
    "https://www.linkedin.com/company/illinois-criminal-justice-information-authority"
  ]
}));

/**
 * Generate website schema markup
 * Used for homepage to define site-wide properties
 */
const websiteSchema = computed(() => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Statewide Violence Prevention Plan for Illinois: 2025-2029",
  "alternateName": "Illinois Violence Prevention Plan",
  "url": baseUrl,
  "description": "The official web presence for the Statewide Violence Prevention Plan for Illinois: 2025-2029, featuring comprehensive violence prevention strategies and community resources.",
  "publisher": {
    "@type": "GovernmentOrganization",
    "name": "Illinois Criminal Justice Information Authority",
    "url": "https://icjia.illinois.gov"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
}));

/**
 * Generate article schema markup
 * Used for content pages like news, plan sections, etc.
 */
const articleSchema = computed(() => {
  if (!props.content || props.pageType === 'homepage') return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": props.content.title || "Violence Prevention Content",
    "description": props.content.description || props.content.summary || "",
    "author": {
      "@type": "Organization",
      "name": props.content.author || "Illinois Criminal Justice Information Authority",
      "url": "https://icjia.illinois.gov"
    },
    "publisher": {
      "@type": "GovernmentOrganization",
      "name": "Illinois Criminal Justice Information Authority",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/illinois-seal.png`,
        "width": 1200,
        "height": 1198
      }
    },
    "datePublished": props.content.date || props.content.publishedTime || new Date().toISOString(),
    "dateModified": props.content.lastModified || props.content.modifiedTime || props.content.date || new Date().toISOString(),
    "url": `${baseUrl}${props.path}`,
    "image": props.content.image ? 
      (props.content.image.startsWith('/') ? `${baseUrl}${props.content.image}` : props.content.image) :
      `${baseUrl}/images/og-image-default.jpg`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}${props.path}`
    },
    "keywords": props.content.keywords || "violence prevention, Illinois, public health, community safety",
    "articleSection": props.content.category || "Violence Prevention",
    "inLanguage": "en-US"
  };
});

/**
 * Generate breadcrumb schema markup
 * Helps search engines understand page hierarchy
 */
const breadcrumbSchema = computed(() => {
  if (props.path === '/') return null;
  
  const pathSegments = props.path.split('/').filter(Boolean);
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    }
  ];
  
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      "item": `${baseUrl}${currentPath}`
    });
  });
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };
});

/**
 * Combine all applicable schemas
 */
const structuredData = computed(() => {
  const schemas = [];
  
  if (props.pageType === 'homepage') {
    schemas.push(organizationSchema.value);
    schemas.push(websiteSchema.value);
  }
  
  if (articleSchema.value) {
    schemas.push(articleSchema.value);
  }
  
  if (breadcrumbSchema.value) {
    schemas.push(breadcrumbSchema.value);
  }
  
  return schemas;
});

/**
 * Set up structured data in the document head
 */
useHead({
  script: structuredData.value.map(schema => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema)
  }))
});
</script>

<template>
  <!-- This component only adds structured data to the head, no visual output -->
</template>
