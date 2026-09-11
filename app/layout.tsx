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
    <html lang="en" className="h-full bg-[#0E2318] text-[#F4F1E4]">
      <body className="min-h-full flex flex-col antialiased bg-[#0E2318] text-[#F4F1E4]">{children}</body>
    </html>
  );
}
