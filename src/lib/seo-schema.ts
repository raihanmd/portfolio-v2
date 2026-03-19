import { SITE_CONFIG } from "~/constant/seo";

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      email: SITE_CONFIG.author.email,
      url: SITE_CONFIG.author.github,
      sameAs: [SITE_CONFIG.author.github, SITE_CONFIG.author.linkedin],
    },
    keywords: SITE_CONFIG.keywords.join(", "),
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.author.name,
    email: SITE_CONFIG.author.email,
    url: SITE_CONFIG.url,
    image: SITE_CONFIG.image.url,
    jobTitle: "Software Engineer",
    description: SITE_CONFIG.description,
    nationality: {
      "@type": "Country",
      name: "Indonesia",
    },
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    sameAs: [SITE_CONFIG.author.github, SITE_CONFIG.author.linkedin],
    knowsAbout: [
      "Software Engineering",
      "Web Development",
      "Blockchain",
      "Smart Contracts",
      "Solidity",
      "TypeScript",
      "React",
      "Next.js",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Super Bootcamp Jawa Barat",
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
    },
  };
}

export function generateCreativeWorkSchema(
  projects: { title: string; description: string; dateCreated: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Portfolio Projects",
    description: "Software projects by Raihanmd",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        dateCreated: project.dateCreated,
        author: {
          "@type": "Person",
          name: SITE_CONFIG.author.name,
        },
      },
    })),
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Raihanmd Portfolio",
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    applicationCategory: "PortfolioApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.image.url,
    sameAs: [SITE_CONFIG.author.github, SITE_CONFIG.author.linkedin],
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE_CONFIG.author.email,
      contactType: "Developer",
    },
  };
}
