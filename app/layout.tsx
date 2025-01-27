import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/providers/query";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  fallback: ["sans-serif"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kids Management System",
  description: "A comprehensive system for managing educational activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${poppins.className}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
