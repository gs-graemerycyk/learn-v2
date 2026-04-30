import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DebugDock } from "@/components/debug-dock";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orbit Community",
  description: "The workspace community for teams who build together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <DebugDock />
      </body>
    </html>
  );
}
