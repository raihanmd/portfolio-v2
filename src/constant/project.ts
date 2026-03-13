import type { IProject, TProjectCategory } from "~/types";

/**
 * Project categories with metadata
 * Provides filtering options and display labels
 */
export const PROJECT_CATEGORIES: Record<
  TProjectCategory,
  { label: string; color: string }
> = {
  web: {
    label: "Web Development",
    color: "bg-blue-500/20 text-blue-400",
  },
  web3: {
    label: "Web3 & Blockchain",
    color: "bg-amber-500/20 text-amber-400",
  },
  // game: {
  //   label: "Game Dev",
  //   color: "bg-pink-500/20 text-pink-400",
  // },
  // tool: {
  //   label: "Tools",
  //   color: "bg-green-500/20 text-green-400",
  // },
  // design: {
  //   label: "Design",
  //   color: "bg-indigo-500/20 text-indigo-400",
  // },
  security: {
    label: "Security",
    color: "bg-gray-500/20 text-gray-400",
  },
};

export const CATEGORY_OPTIONS = Object.entries(PROJECT_CATEGORIES).map(
  ([key, value]) => ({
    value: key as TProjectCategory,
    label: value.label,
  }),
);

/**
 * Sample projects data
 * Organized with featured items first, then by year descending
 * All projects follow IProject interface
 */
export const PROJECTS: IProject[] = [
  {
    id: "gainjar",
    video: "https://www.youtube.com/embed/4R4IYbSCcfc?si=1RxfTfD833KM-Uss",
    title: "GainJar: Payroll Stream Protocol",
    description:
      "Smart contract protocol enabling real-time, per-second salary streaming to employee wallets on Arbitrum.",
    longDescription:
      "GainJar is a decentralized payroll protocol that reimagines wage distribution infrastructure. Built on Arbitrum, it introduces two core streaming primitives: Infinite Streams for employment relationships with dynamic rate updates, and Finite Streams for project-based engagements with deterministic closure. The system implements a permissionless liquidation mechanism that protects workers when employer vaults reach critical solvency thresholds—any participant can trigger wind-down, ensuring immediate wage recovery with incentive alignment. The protocol uses OpenZeppelin's ReentrancyGuard and access control patterns, verified for secure USDC vault management across four solvency states. Deployed on Arbitrum Sepolia with full Foundry-based test coverage.",
    category: ["web3"],
    status: "completed",
    tags: [
      "Solidity",
      "Foundry",
      "Arbitrum",
      "Smart Contracts",
      "DeFi",
      "OpenZeppelin",
      "Web3",
    ],
    featured: true,
    year: 2026,
    order: 0,
    color: "from-green-500 to-emerald-500",
    links: [
      {
        label: "github",
        href: "https://github.com/GainJar-Payroll/gainjar",
      },
    ],
  },
  {
    id: "security-research",
    title: "Smart Contract Audit Portfolio",
    description:
      "A curated collection of smart contract security audits from CodeHawks contests, public audits, and private audits.",
    longDescription:
      "A structured repository of smart contract security audit reports covering various blockchain protocols. Each audit includes a full findings report in both markdown and PDF formats, documenting vulnerabilities, gas optimization opportunities, and code quality improvements. Audits are sourced from CodeHawks competitive contests, public disclosures, and private engagements. Reports are generated with Pandoc using the Eisvogel LaTeX template for professional formatting.",
    category: ["web3", "security"],
    status: "completed",
    tags: [
      "Solidity",
      "Smart Contract Security",
      "Auditing",
      "CodeHawks",
      "Foundry",
      "DeFi",
      "Web3",
    ],
    featured: true,
    year: 2026,
    order: 1,
    color: "from-red-500 to-orange-500",
    links: [
      {
        label: "github",
        href: "https://github.com/raihanmd/security-research",
      },
    ],
  },
  {
    id: "gowesmart",
    title: "GoWesmart: E-commerce Platform",
    description:
      "Full-stack e-commerce platform with user-centric features and robust backend architecture.",
    longDescription:
      "Comprehensive e-commerce solution developed as the Super Bootcamp Jawa Barat capstone project. Architected backend systems for multi-user transaction handling, implemented secure authentication flows with improved UX, and developed transaction history management with real-time status tracking. Platform integrates payment processing, inventory management, and user dashboard features. Delivered a production-ready system that meets operational requirements while maintaining code quality and maintainability.",
    category: ["web"],
    status: "completed",
    tags: [
      "Node.js",
      "Express",
      "React",
      "MongoDB",
      "Authentication",
      "Payment Systems",
    ],
    featured: false,
    year: 2024,
    links: [
      {
        label: "github",
        href: "https://github.com/gowesmart/gowesmart",
      },
    ],
  },
  {
    id: "websocket-feed-dashboard",
    title: "Real-Time Websocket Feed Dashboard",
    description:
      "Scalable real-time activity feed consuming high-frequency events with automatic recovery and deduplication.",
    longDescription:
      "Advanced real-time data visualization dashboard handling continuous WebSocket event streams. Implements robust connection management with exponential backoff reconnection, malformed event filtering, duplicate detection across network partitions, and state synchronization during disconnects. Uses Zustand for predictable state updates under high throughput conditions. Includes client-side filtering, search with debouncing, and categorical organization—optimized for sub-100ms perception of network latency.",
    category: ["web"],
    status: "completed",
    tags: [
      "React",
      "WebSocket",
      "Zustand",
      "Real-time",
      "TypeScript",
      "Performance Optimization",
    ],
    featured: false,
    year: 2025,
    links: [
      {
        label: "github",
        href: "https://github.com/raihanmd/handling-websocket-propperly",
      },
    ],
  },
  {
    id: "notion-realtime",
    title: "Real-Time Collaborative Note Platform",
    description:
      "Backend system for multi-user document collaboration with real-time synchronization and conflict-free updates.",
    longDescription:
      "Built a production-grade collaborative backend using WebSocket-based event streaming. Handles concurrent mutations across multiple clients with eventual consistency guarantees. Implements state reconciliation on reconnect, operational transformation for conflict resolution, and audit trails for document history. Focuses on backend architecture decisions—event ordering, distributed state management, and data consistency under high concurrency.",
    category: ["web"],
    status: "in-progress",
    tags: [
      "Node.js",
      "WebSocket",
      "Real-time Sync",
      "Concurrency",
      "Backend Architecture",
      "TypeScript",
    ],
    featured: false,
    year: 2025,
    links: [
      {
        label: "github",
        href: "https://github.com/raihanmd/notion",
      },
    ],
  },
  {
    id: "motion-ime",
    title: "Motion IME: Windah Basudara Community",
    description: "Open-source Windah Basudara community website.",
    longDescription:
      "Led the technical modernization of Motion IME for the Windah Basudara community. Migrated monolithic CRA application to Next.js, introducing server-side rendering for improved performance and SEO. Converted codebase to TypeScript with strict type checking—reducing runtime errors and improving developer experience. Optimized bundle size and implemented code splitting. Demonstrates understanding of framework paradigms, build tooling, and gradual migration strategies.",
    category: ["web"],
    status: "completed",
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Migration",
      "Performance",
      "Open Source",
    ],
    featured: false,
    year: 2024,
    links: [
      {
        label: "github",
        href: "https://github.com/raihanmd/motionime",
      },
    ],
  },
  {
    id: "laughify",
    title: "Laughify: Community Content Platform",
    description:
      "Social platform for user-generated content with state management and real-time interactions.",
    longDescription:
      "Community platform built with Nuxt.js for content sharing and discovery. Implements user-generated content workflows with Pinia state management for consistent application state across components. Designed responsive UI using PrimeVue and DaisyUI—demonstrating effective use of pre-built component libraries for rapid, maintainable development. Features include content upload, curation, and community engagement mechanics. Architecture emphasizes scalability and separation of concerns through proper state architecture.",
    category: ["web"],
    status: "completed",
    tags: ["Nuxt.js", "Vue", "Pinia", "PrimeVue", "DaisyUI", "Tailwind CSS"],
    featured: false,
    year: 2023,
    links: [
      {
        label: "github",
        href: "https://github.com/raihanmd/laughify",
      },
    ],
  },
];

/**
 * Helper function to get unique categories from projects
 * Used for filter UI initialization
 */
export function getUniqueCategories(): TProjectCategory[] {
  const categories = new Set<TProjectCategory>();
  PROJECTS.forEach((project) => {
    project.category.forEach((cat) => categories.add(cat));
  });
  return Array.from(categories).sort();
}

/**
 * Helper function to filter projects by category
 * Returns all projects if categories array is empty
 */
export function filterProjectsByCategory(
  projects: IProject[],
  categories: TProjectCategory[],
): IProject[] {
  if (categories.length === 0) return projects;
  return projects.filter((project) =>
    categories.some((category) => project.category.includes(category)),
  );
}

/**
 * Helper function to sort projects
 * Featured first, then by year descending
 */
export function sortProjects(projects: IProject[]): IProject[] {
  return [...projects].sort((a, b) => {
    // Featured items first
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    // Then by order within featured/non-featured
    if (a.order && b.order && a.order !== b.order) {
      return a.order - b.order;
    }
    // Then by year descending
    return b.year - a.year;
  });
}
