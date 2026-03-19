import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata, Viewport } from "next";

import Navbar from "../_components/navbar";
import RootProvider from "~/providers/root-provider";
import { SITE_CONFIG } from "~/constant/seo";
import {
  generateWebSiteSchema,
  generatePersonSchema,
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
} from "~/lib/seo-schema";

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
    absolute: SITE_CONFIG.title,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.github }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.author.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.image.url,
        width: SITE_CONFIG.image.width,
        height: SITE_CONFIG.image.height,
        alt: SITE_CONFIG.image.alt,
      },
    ],
    countryName: SITE_CONFIG.countryName,
    emails: SITE_CONFIG.author.email,
  },
  twitter: {
    card: SITE_CONFIG.twitter.cardType,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitter.handle,
    images: [SITE_CONFIG.image.url],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      "en-US": SITE_CONFIG.url,
    },
  },
  verification: {
    // google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  category: "Technology",
  classification: "Personal Portfolio",
};

export const metadata: Metadata = {
  ...baseMetadata,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: SITE_CONFIG.favicon.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLdSchemas = [
  generateWebSiteSchema(),
  generatePersonSchema(),
  generateOrganizationSchema(),
  generateSoftwareApplicationSchema(),
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        {jsonLdSchemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>
        <RootProvider>
          <Navbar />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
