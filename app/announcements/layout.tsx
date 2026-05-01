import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Announcements | Assemblies Of God Church, Choba 2",
  description: "Stay up to date with the latest announcements from Assemblies Of God Church, Choba 2.",
};

export default function AnnouncementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
