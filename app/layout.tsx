import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KisanMitra — Smart Market Intelligence",
  description:
    "Smart market intelligence from farm gate to buyer. Know where to sell, when to sell, and find reliable buyers for your produce.",
  keywords: [
    "KisanMitra",
    "agriculture",
    "market intelligence",
    "farmer",
    "mandi prices",
    "crop selling",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
