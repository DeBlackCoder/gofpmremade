import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Community projects, outreach initiatives, and building programmes at Assemblies Of God Church, Port Harcourt.",
  openGraph: {
    title: "Projects | AG Church",
    description:
      "See how Assemblies Of God Church is serving Port Harcourt and beyond through construction, outreach, education, and relief.",
  },
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
