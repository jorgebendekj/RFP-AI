import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a SICOES Monitor para configurar tus alertas diarias de licitaciones de Bolivia.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.sicoesmonitor.com/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
