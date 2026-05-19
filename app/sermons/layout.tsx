import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Sermons, reflections, and pastoral letters from our leadership — written to be read slowly.",
  openGraph: {
    title: "Sermons | GOFPM Church",
    description: "God's Own Favour Prophetic Ministry.",
  },
};

export default function SermonsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
