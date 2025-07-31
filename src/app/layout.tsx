import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Pet Classifier - Cat vs Dog Classification",
  description: "Advanced AI-powered pet classification system that accurately distinguishes between cats and dogs using state-of-the-art machine learning algorithms. Upload your pet's photo and get instant results with confidence scores.",
  keywords: "AI, pet classifier, cat, dog, machine learning, image classification, neural network",
  authors: [{ name: "AI Pet Classifier Team" }],
  icons: {
    icon: '/paw.png',
    shortcut: '/paw.png',
    apple: '/paw.png',
  },
  openGraph: {
    title: "AI Pet Classifier - Cat vs Dog Classification",
    description: "Advanced AI-powered pet classification system that accurately distinguishes between cats and dogs.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Pet Classifier - Cat vs Dog Classification",
    description: "Advanced AI-powered pet classification system that accurately distinguishes between cats and dogs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
