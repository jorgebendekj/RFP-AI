import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SICOES Monitor · IA de Licitaciones Bolivia",
  description:
    "Monitoreo inteligente de licitaciones en el Sistema de Contrataciones Estatales de Bolivia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={ibmPlexMono.variable}>{children}</body>
    </html>
  );
}
