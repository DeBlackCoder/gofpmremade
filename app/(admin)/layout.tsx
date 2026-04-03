import Image from "next/image";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-white">
      {/* Background */}
      <Image
        src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1800&q=80"
        alt="Church interior"
        fill
        priority
        className="object-cover object-center opacity-15"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      {/* Content */}
      <div className="relative z-10">
        <AdminShell>{children}</AdminShell>
      </div>
    </div>
  );
}
