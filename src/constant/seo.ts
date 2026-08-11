export const SITE_CONFIG = {
  name: "Raihanmd",
  title: "Raihanmd | Software Engineer & Web3 Developer",
  description:
    "Software Engineer specializing in full-stack web development, blockchain technology, and smart contract security. Based in Indonesia.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://raihanmd.xyz",
  author: {
    name: "Raihanmd",
    email: "me@raihanmd.xyz",
    github: "https://github.com/raihanmd",
    linkedin: "https://linkedin.com/in/raihanmddd",
  },
  keywords: [
    "Software Engineer",
    "Web Developer",
    "Full Stack Developer",
    "Blockchain Developer",
    "Smart Contract Developer",
    "Solidity Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Web3 Developer",
    "DeFi",
    "Indonesia Developer",
  ] as string[],
  image: {
    url: "https://avatars.githubusercontent.com/u/100277303?v=4",
    width: 1200,
    height: 630,
    alt: "Raihanmd - Software Engineer & Web3 Developer",
  },
  twitter: {
    handle: "@raihanmd",
    cardType: "summary_large_image",
  },
  locale: "en_US",
  countryName: "Indonesia",
  favicon: {
    emoji: "👨‍💻",
    themeColor: "#09090b",
  },
} as const;

export const PAGE_SEO = {
  home: {
    title: "Software Engineer & Web3 Developer",
    description:
      "Software Engineer specializing in full-stack web development, blockchain technology, and smart contract security. Building systems that work reliably at scale.",
  },
  "about-me": {
    title: "About Me",
    description:
      "Learn about Raihanmd's journey from shipping code to understanding systems deeply. Specializing in full-stack development, blockchain, and smart contract security.",
  },
  projects: {
    title: "Projects",
    description:
      "Explore Raihanmd's portfolio of projects including Web3 protocols, DeFi applications, full-stack web applications, and smart contract security audits.",
  },
  til: {
    title: "TIL - Today I Learned",
    description:
      "Short notes on things Raihanmd learns while building — web development, blockchain, and systems engineering.",
  },
} as const;

export const ROBOTS_RULES = {
  UserAgent: "*",
  Allow: "/",
  Disallow: ["/api/", "/admin/", "/graphql", "/graphql-playground", "/_next/"],
};

export const SITE_PAGES = [
  {
    path: "/",
    lastmod: new Date().toISOString(),
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    path: "/about-me",
    lastmod: new Date().toISOString(),
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/projects",
    lastmod: new Date().toISOString(),
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/til",
    lastmod: new Date().toISOString(),
    priority: "0.7",
    changefreq: "weekly",
  },
] as const;
