import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import Navbar from "../_components/navbar";
import RootProvider from "~/providers/root-provider";

export const metadata: Metadata = {
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Raihanmd | About Me",
    description: "About me",
    type: "website",
    images: "https://avatars.githubusercontent.com/u/100277303?v=4",
    siteName: "Raihanmd",
    countryName: "Indonesia",
    emails: "mraihanf471@gmail.com",
    locale: "en",
  },
  authors: { name: "Raihanmd", url: "https://github.com/raihanmd" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <RootProvider>
          <Navbar />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
