import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const siteUrl = "https://www.ribentek.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SICOES Monitor · Licitaciones Bolivia con IA",
    template: "%s · SICOES Monitor",
  },
  description:
    "Monitoreá automáticamente las licitaciones del portal SICOES (sicoes.gob.bo) con Inteligencia Artificial. Recibí cada mañana las oportunidades más relevantes para tu empresa en Bolivia.",
  keywords: [
    "SICOES",
    "licitaciones Bolivia",
    "contrataciones estatales Bolivia",
    "sicoes.gob.bo",
    "licitaciones públicas Bolivia",
    "sistema de contrataciones estado Bolivia",
    "SICOES monitor",
    "licitaciones IA Bolivia",
    "contrataciones gobierno Bolivia",
    "licitaciones empresas Bolivia",
    "SICOES alertas",
    "licitaciones automáticas Bolivia",
  ],
  authors: [{ name: "Ribentek", url: "https://ribentek.com" }],
  creator: "Ribentek",
  publisher: "Ribentek",
  category: "business",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "es_BO",
    url: siteUrl,
    siteName: "SICOES Monitor",
    title: "SICOES Monitor · Licitaciones Bolivia con IA",
    description:
      "Monitoreá automáticamente las licitaciones del portal SICOES con Inteligencia Artificial. Recibí cada mañana las oportunidades más relevantes para tu empresa en Bolivia.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SICOES Monitor — Licitaciones Bolivia con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SICOES Monitor · Licitaciones Bolivia con IA",
    description:
      "Monitoreá las licitaciones de SICOES automáticamente con IA. Alertas diarias para empresas bolivianas.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SICOES Monitor",
  description:
    "Sistema de monitoreo automático de licitaciones del portal SICOES (sicoes.gob.bo) con análisis de Inteligencia Artificial para empresas bolivianas.",
  url: siteUrl,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BOB" },
  creator: { "@type": "Organization", name: "Ribentek", url: "https://ribentek.com" },
  keywords: "SICOES, licitaciones Bolivia, contrataciones estatales, sicoes.gob.bo",
  inLanguage: "es-BO",
  availableLanguage: "Spanish",
  areaServed: { "@type": "Country", name: "Bolivia" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={ibmPlexMono.variable}>{children}</body>
    </html>
  );
}
