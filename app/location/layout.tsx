import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Location & Hours | GOFPM",
  description:
    "Visit God's Own Favour Prophetic Ministry in Eleme, Rivers State. Service times, directions, and contact information.",
  openGraph: {
    title: "GOFPM — Location & Service Hours",
    description:
      "God's Own Favour Prophetic Ministry in Eleme, Rivers State. Join us for worship, prayer, and community.",
  },
};

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
