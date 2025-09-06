import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster from sonner

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rental App",
  description: "Rent anything you need, anytime you want.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-muted/40`}>
        <Navbar/>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster richColors /> {/* Add the Toaster component here */}
      </body>
    </html>
  );
}

