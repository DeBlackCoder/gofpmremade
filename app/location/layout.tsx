import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Location",
  description:
    "Find us at Assemblies Of God Church, Port Harcourt. Service times, directions, and everything you need to plan your visit.",
  openGraph: {
    title: "Location | AG Church",
    description:
      "Find us at Assemblies Of God Church, Port Harcourt. Service times and directions.",
  },
};

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
