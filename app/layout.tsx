import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ITIL 4 Trainer Brasil",
  description: "Treinamento autoral em português para ITIL 4 Foundation"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
