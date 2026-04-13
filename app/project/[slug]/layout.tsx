import type { Metadata } from "next";
import { projects } from "@/lib/projects-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const title = project ? `${project.title} | AG Church` : "Project | AG Church";
  const description = project?.summary ?? "Project details — Assemblies Of God Church, Port Harcourt.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function ProjectSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
