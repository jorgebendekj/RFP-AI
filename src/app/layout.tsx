import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const siteUrl = "https://www.sicoesmonitor.com";

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
    "SICOES licitaciones",
    "portal SICOES",
    "licitaciones estatales Bolivia",
    "contrataciones públicas Bolivia 2025",
    "buscar licitaciones Bolivia",
    "alertas licitaciones SICOES",
    "monitor SICOES Bolivia",
    "licitaciones construcción Bolivia",
    "licitaciones tecnología Bolivia",
    "licitaciones servicios Bolivia",
    "licitaciones mantenimiento Bolivia",
    "licitaciones consultoría Bolivia",
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
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "SICOES Monitor — Licitaciones Bolivia con IA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SICOES Monitor · Licitaciones Bolivia con IA",
    description:
      "Monitoreá las licitaciones de SICOES automáticamente con IA. Alertas diarias para empresas bolivianas.",
    images: [`${siteUrl}/og.png`],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SICOES Monitor",
    description:
      "Sistema de monitoreo automático de licitaciones del portal SICOES (sicoes.gob.bo) con análisis de Inteligencia Artificial para empresas bolivianas. Envía alertas diarias personalizadas por email a las 9am hora Bolivia.",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BOB", availability: "https://schema.org/InStock" },
    creator: { "@type": "Organization", name: "Ribentek", url: "https://ribentek.com" },
    keywords: "SICOES, licitaciones Bolivia, contrataciones estatales, sicoes.gob.bo, licitaciones públicas Bolivia",
    inLanguage: "es-BO",
    availableLanguage: "Spanish",
    areaServed: { "@type": "Country", name: "Bolivia" },
    featureList: [
      "Escaneo diario del portal SICOES",
      "Análisis con Inteligencia Artificial Claude",
      "Alertas por email a las 9am hora Bolivia",
      "Score de relevancia por empresa",
      "Filtros por rubro y palabras clave",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ribentek",
    url: "https://ribentek.com",
    description:
      "Empresa tecnológica especializada en automatización e Inteligencia Artificial con más de 25 proyectos implementados en 5 países y 6 industrias de Latinoamérica.",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 1 },
    knowsAbout: ["Inteligencia Artificial", "Automatización", "Software empresarial", "Licitaciones Bolivia"],
    areaServed: ["Bolivia", "Argentina", "Chile", "Perú", "México"],
    sameAs: ["https://ribentek.com"],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={ibmPlexMono.variable}>{children}</body>
    </html>
  );
}
