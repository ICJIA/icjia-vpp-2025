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
    default: () => ({}),
  },

  /**
   * Page type for schema selection
   * @type {String}
   */
  pageType: {
    type: String,
    default: "article",
    validator: (value) =>
      [
        "homepage",
        "article",
        "organization",
        "government",
        "collection",
        "search",
      ].includes(value),
  },

  /**
   * Current route path
   * @type {String}
   */
  path: {
    type: String,
    default: "/",
  },

  /**
   * Collection items for listing pages
   * @type {Array}
   */
  collectionItems: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();
const baseUrl = "https://vpp-2025.netlify.app";

/**
 * Generate organization schema markup
 * Used for homepage and organizational pages
 */
const organizationSchema = computed(() => ({
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  name: "Illinois Criminal Justice Information Authority",
  alternateName: "ICJIA",
  url: "https://icjia.illinois.gov",
  logo: {
    "@type": "ImageObject",
    url: `${baseUrl}/images/illinois-seal.png`,
    width: 1200,
    height: 1198,
  },
  description:
    "The Illinois Criminal Justice Information Authority (ICJIA) aims to continue funding and supporting violence prevention efforts across Illinois.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "60 E Van Buren St",
    addressLocality: "Chicago",
    addressRegion: "IL",
    postalCode: "60605",
    addressCountry: {
      "@type": "Country",
      name: "US",
    },
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "cja.irc@illinois.gov",
  },
  sameAs: [
    "https://twitter.com/ICJIA_Illinois",
    "https://www.facebook.com/ICJIA",
    "https://www.linkedin.com/company/illinois-criminal-justice-information-authority",
  ],
}));

/**
 * Generate website schema markup
 * Used for homepage to define site-wide properties
 */
const websiteSchema = computed(() => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Statewide Violence Prevention Plan for Illinois: 2025-2029",
  alternateName: "Illinois Violence Prevention Plan",
  url: baseUrl,
  description:
    "The official web presence for the Statewide Violence Prevention Plan for Illinois: 2025-2029, featuring comprehensive violence prevention strategies and community resources.",
  publisher: {
    "@type": "GovernmentOrganization",
    name: "Illinois Criminal Justice Information Authority",
    url: "https://icjia.illinois.gov",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}));

/**
 * Generate article schema markup
 * Used for content pages like news, plan sections, etc.
 */
const articleSchema = computed(() => {
  if (
    !props.content ||
    props.pageType === "homepage" ||
    props.pageType === "search" ||
    props.pageType === "collection"
  )
    return null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: props.content.title || "Violence Prevention Content",
    description: props.content.description || props.content.summary || "",
    author: {
      "@type": "Organization",
      name:
        props.content.author ||
        "Illinois Criminal Justice Information Authority",
      url: "https://icjia.illinois.gov",
    },
    publisher: {
      "@type": "GovernmentOrganization",
      name: "Illinois Criminal Justice Information Authority",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/illinois-seal.png`,
        width: 1200,
        height: 1198,
      },
    },
    datePublished:
      props.content.date ||
      props.content.publishedTime ||
      new Date().toISOString(),
    dateModified:
      props.content.lastModified ||
      props.content.modifiedTime ||
      props.content.date ||
      new Date().toISOString(),
    url: `${baseUrl}${props.path}`,
    image: props.content.image
      ? props.content.image.startsWith("/")
        ? `${baseUrl}${props.content.image}`
        : props.content.image
      : `${baseUrl}/images/og-image-default.jpg`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${props.path}`,
    },
    keywords:
      props.content.keywords ||
      "violence prevention, Illinois, public health, community safety",
    articleSection: props.content.category || "Violence Prevention",
    inLanguage: "en-US",
  };
});

/**
 * Generate collection page schema markup
 * Used for listing pages like news, blog, etc.
 */
const collectionSchema = computed(() => {
  if (props.pageType !== "collection" || !props.collectionItems.length)
    return null;

  const itemListElements = props.collectionItems.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Article",
      headline: item.title || "Untitled",
      description: item.summary || item.description || "",
      url: `${baseUrl}${item._path || item.path}`,
      datePublished: item.date || new Date().toISOString(),
      image: item.image
        ? item.image.startsWith("/")
          ? `${baseUrl}${item.image}`
          : item.image
        : `${baseUrl}/images/og-image-default.jpg`,
      author: {
        "@type": "Organization",
        name: "Illinois Criminal Justice Information Authority",
        url: "https://icjia.illinois.gov",
      },
    },
  }));

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: props.content.title || "News & Updates",
      description: props.content.description || "Latest news and updates",
      url: `${baseUrl}${props.path}`,
      publisher: {
        "@type": "GovernmentOrganization",
        name: "Illinois Criminal Justice Information Authority",
        url: "https://icjia.illinois.gov",
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: props.collectionItems.length,
        itemListElement: itemListElements,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      numberOfItems: props.collectionItems.length,
      itemListElement: itemListElements,
    },
  ];
});

/**
 * Generate search page schema markup
 * Used for search functionality pages
 */
const searchPageSchema = computed(() => {
  if (props.pageType !== "search") return null;

  // Return single WebPage schema (not array) for maximum prominence
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${props.path}`,
    name: props.content.title || "Search",
    headline: props.content.title || "Search",
    description: props.content.description || "Search through all content",
    url: `${baseUrl}${props.path}`,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "Violence Prevention Plan for Illinois: 2025-2029",
      url: baseUrl,
    },
    about: {
      "@type": "Thing",
      name: "Violence Prevention Plan Search",
      description:
        "Search functionality for the Illinois Violence Prevention Plan",
    },
    publisher: {
      "@type": "GovernmentOrganization",
      name: "Illinois Criminal Justice Information Authority",
      url: "https://icjia.illinois.gov",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/illinois-seal.png`,
        width: 1200,
        height: 1198,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/og-image-default.jpg`,
      width: 1200,
      height: 630,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Search",
          item: `${baseUrl}${props.path}`,
        },
      ],
    },
  };
});

/**
 * Generate breadcrumb schema markup
 * Helps search engines understand page hierarchy
 * Note: Excluded from search pages to prevent schema competition
 */
const breadcrumbSchema = computed(() => {
  if (props.path === "/" || props.pageType === "search") return null;

  const pathSegments = props.path.split("/").filter(Boolean);
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ];

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    breadcrumbItems.push({
      "@type": "ListItem",
      position: index + 2,
      name: segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      item: `${baseUrl}${currentPath}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };
});

/**
 * Combine all applicable schemas
 * Order matters: more specific schemas should come last for Google Rich Results priority
 */
const structuredData = computed(() => {
  const schemas = [];

  // Add breadcrumb schema first (supporting schema)
  if (breadcrumbSchema.value) {
    schemas.push(breadcrumbSchema.value);
  }

  // Add page-type specific schemas (primary schemas)
  if (props.pageType === "homepage") {
    schemas.push(organizationSchema.value);
    schemas.push(websiteSchema.value);
  }

  if (props.pageType === "collection" && collectionSchema.value) {
    schemas.push(...collectionSchema.value);
  }

  if (articleSchema.value) {
    schemas.push(articleSchema.value);
  }

  // Add search schema last for highest priority in Google Rich Results
  if (props.pageType === "search" && searchPageSchema.value) {
    schemas.push(searchPageSchema.value);
  }

  return schemas;
});

/**
 * Set up structured data in the document head
 */
useHead({
  script: structuredData.value.map((schema) => ({
    type: "application/ld+json",
    innerHTML: JSON.stringify(schema),
  })),
});
</script>

<template>
  <!-- This component only adds structured data to the head, no visual output -->
</template>
