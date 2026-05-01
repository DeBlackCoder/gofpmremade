import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Assemblies Of God Church",
    template: "%s | AG Church",
  },
  description:
    "A Spirit-filled community rooted in love, faith, and service. Join us for worship, sermons, and community in Port Harcourt, Rivers State.",
  keywords: [
    "church",
    "assemblies of god",
    "Port Harcourt",
    "worship",
    "sermons",
    "faith",
  ],
  openGraph: {
    type: "website",
    siteName: "Assemblies Of God Church",
    title: "Assemblies Of God Church",
    description:
      "A Spirit-filled community rooted in love, faith, and service.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assemblies Of God Church",
    description:
      "A Spirit-filled community rooted in love, faith, and service.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans")}
      style={
        {
          "--font-sans": 'Georgia, "Times New Roman", serif',
          "--font-body": 'Inter, "Segoe UI", Arial, sans-serif',
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <div className="site-wrapper flex flex-col flex-1">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
