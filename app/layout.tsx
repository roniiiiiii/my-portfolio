// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // This should import your font definitions

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Veronika Heckl - Graphic Designer",
  description: "Graphic Designer based in Berlin and Vienna",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}