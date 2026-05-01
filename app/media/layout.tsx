import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Listen to audio messages on Spotify and watch recorded services on YouTube from Assemblies Of God Church, Choba 2.",
  openGraph: {
    title: "Media | AG Church Choba 2",
    description:
      "Audio messages and video recordings from Assemblies Of God Church, Choba 2.",
  },
};

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
