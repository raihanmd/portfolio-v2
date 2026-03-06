# Portfolio V2 - Systems Engineer & Curious Builder

A modern, full-stack portfolio showcasing engineering work across Web2, Web3, and systems architecture. Built with cutting-edge technologies and designed to demonstrate depth of engineering understanding over breadth of frameworks.

## Philosophy

This portfolio reflects a commitment to understanding **how systems work**—not just using tools, but building infrastructure that scales reliably. Projects span from DeFi protocols and real-time streaming systems to e-commerce platforms and open-source contributions.

## Projects

### Featured Work

- **GainJar** — Decentralized payroll protocol (Solidity/Arbitrum/DeFi)
- **Umroh Booking Platform** — Enterprise SaaS for pilgrimage packages (Next.js/Fullstack)
- **Portfolio V2** — Interactive portfolio with 3D elements (Next.js/Three.js)

### Additional Projects

- GoWesmart — E-commerce platform with backend architecture
- Real-Time WebSocket Feed Dashboard — High-throughput event streaming
- Notion-like Real-Time Collaboration — Backend architecture & concurrency
- Motion IME — Framework modernization (CRA → Next.js migration)
- Laughify — Community content platform with state management
- Bumi Pakarangan — Property showcase landing page
- Roblox Game Development — Game mechanics & performance
- TypeScript Utilities — Open-source library
- 3D Model Interactive Viewer — Three.js visualization

**View all projects**: [/projects](/projects)

## Tech Stack

### Frontend

- **Next.js 14** — React framework with server components
- **TypeScript 5.9** — Strict type safety
- **TailwindCSS 3.4** — Utility-first styling
- **Motion** — Animation primitives
- **Three.js** — 3D graphics
- **Radix UI** — Accessible component primitives

### Tools & Infrastructure

- **Shadcn/UI** — Pre-built component system
- **Prisma** — Type-safe ORM
- **Zod** — Runtime validation
- **ESLint & Prettier** — Code quality

### Development

- **Bun** — Fast package manager
- **VS Code** — Editor

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun 1.3+)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/raihanmd/portfolio-v2.git
cd portfolio-v2

# Install dependencies
bun install
# or
npm install
```

### Development

```bash
# Start development server
bun run dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the portfolio.

### Build for Production

```bash
# Build optimized bundle
bun run build

# Start production server
bun run start
```

## Structure

```
src/
├── app/              # Next.js app router pages
├── features/         # Feature-based components
│   ├── home/        # Home page sections
│   ├── projects/    # Projects page & components
│   └── about-me/    # About page content
├── components/      # Reusable UI components
├── lib/             # Utilities & helpers
├── types/           # TypeScript definitions
├── constant/        # Data & constants
└── styles/          # Global styles
```

## Design System

- **Color System**: HSL-based CSS variables with dark-mode first approach
- **Typography**: Geist font family
- **Animation**: Spring physics with Motion library (damping: 12, stiffness: 100)
- **Responsive**: Mobile-first with TailwindCSS breakpoints
- **Accessibility**: Radix UI primitives with WCAG compliance

## Key Features

✅ **Type-Safe** — Full TypeScript with strict mode  
✅ **Performant** — Server components, optimized bundles  
✅ **Accessible** — WCAG compliance with Radix UI  
✅ **Animated** — Smooth transitions with Motion library  
✅ **Real-time** — 3D elements with Three.js  
✅ **Responsive** — Mobile-first design  
✅ **Dark Mode** — Full theme support with next-themes

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended), [Netlify](https://netlify.com), or any Node.js hosting:

```bash
# Vercel CLI
vercel deploy

# Docker (included in repo)
docker build -t portfolio-v2 .
docker run -p 3000:3000 portfolio-v2
```

## Contact & Links

- **Website**: [raihanmd.dev](https://raihanmd.dev)
- **Email**: me@raihanmd.xyz
- **GitHub**: [@raihanmd](https://github.com/raihanmd)

## License

This project is open source under the MIT License. See [LICENSE](LICENSE) for details.

---

**Last Updated**: March 2026  
**Built with**: Next.js, TypeScript, TailwindCSS, Three.js
