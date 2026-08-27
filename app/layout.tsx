import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { FloatingUtilities } from "@/app/components/FloatingUtilities.client";

import "./globals.css";

const SITE_URL = "https://russianhighways.ru";
const SITE_NAME = "Государственная компания «Автодор»";
const DESCRIPTION =
  "Официальная информация о сети дорог Государственной компании «Автодор», сервисах для водителей, новостях, контактах и деятельности компании.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
    languages: {
      "ru-RU": "/",
      "en-US": "/en/",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [
      {
        url: "/media/optimized/federal-highway-aerial-hero/federal-highway-aerial-hero-desktop-1440.webp",
        width: 1440,
        height: 810,
        alt: "Сгенерированный образ современной федеральной автомагистрали",
      },
    ],
  },
  icons: {
    icon: "/brand/autodor-logo-footer.png",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [
      "/media/optimized/federal-highway-aerial-hero/federal-highway-aerial-hero-desktop-1440.webp",
    ],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Государственная компания «Российские автомобильные дороги»",
      alternateName: "Государственная компания «Автодор»",
      url: `${SITE_URL}/`,
      email: "info@russianhighways.ru",
      telephone: "+7-495-727-11-95",
      address: {
        "@type": "PostalAddress",
        postalCode: "127006",
        addressLocality: "Москва",
        streetAddress: "Страстной бульвар, 9",
        addressCountry: "RU",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: "ru-RU",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="preload"
          as="image"
          type="image/avif"
          media="(max-width: 767px)"
          imageSrcSet="/media/optimized/federal-highway-aerial-hero/federal-highway-aerial-hero-mobile-320.avif 320w, /media/optimized/federal-highway-aerial-hero/federal-highway-aerial-hero-mobile-480.avif 480w, /media/optimized/federal-highway-aerial-hero/federal-highway-aerial-hero-mobile-720.avif 720w"
          imageSizes="100vw"
          fetchPriority="high"
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          К основному содержанию
        </a>
        {children}
        <FloatingUtilities />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
