import { verifyAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { sermons } from "@/lib/sermons-data";

export default async function DashboardPage() {
  const valid = await verifyAdminSession();
  if (!valid) redirect("/admin-login");

  const totalSermons = sermons.length;
  const featured = sermons.filter((s) => s.featured).length;
  const tags = [...new Set(sermons.map((s) => s.tag))];

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10 max-w-5xl mx-auto">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex flex-col gap-0.5">
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Assemblies Of God Church
          </span>
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-10">
        {[
          { label: "Total Sermons", value: totalSermons },
          { label: "Featured",      value: featured },
          { label: "Series",        value: tags.length },
          { label: "Pastors",       value: [...new Set(sermons.map((s) => s.pastor))].length },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-950 px-5 py-5 flex flex-col gap-1">
            <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
              {stat.label}
            </span>
            <span className="font-heading text-white font-black text-3xl leading-none">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Sermons table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            All sermons
          </span>
          <a
            href="/sermons"
            className="font-body text-white/40 text-[10px] tracking-widest uppercase hover:text-white transition-colors"
          >
            View public page →
          </a>
        </div>

        <div className="flex flex-col">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 border-b border-white/10">
            <span className="font-body text-white/25 text-[10px] tracking-widest uppercase">Title</span>
            <span className="font-body text-white/25 text-[10px] tracking-widest uppercase hidden sm:block">Pastor</span>
            <span className="font-body text-white/25 text-[10px] tracking-widest uppercase">Date</span>
          </div>

          {sermons.map((sermon) => (
            <div
              key={sermon.slug}
              className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-4 border-b border-white/5 hover:bg-white/3 transition-colors items-center"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`/sermons/${sermon.slug}`}
                    className="font-body text-white font-semibold text-sm hover:text-white/70 transition-colors truncate"
                  >
                    {sermon.title}
                  </a>
                  {sermon.featured && (
                    <span className="font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-white/10 text-white/50 border border-white/15 flex-shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                <span className="font-body text-white/35 text-xs italic">{sermon.scripture} · {sermon.series}</span>
              </div>
              <span className="font-body text-white/40 text-xs hidden sm:block">{sermon.pastor}</span>
              <span className="font-body text-white/30 text-xs flex-shrink-0">{sermon.date}</span>
            </div>
          ))}
        </div>
      </div>

      Quick links
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10">
        {[
          { label: "Sermons",   href: "/admin-sermons",  note: "Create & manage" },
          { label: "Events",    href: "/admin-events",   note: "Manage events" },
          { label: "Messages",  href: "/admin-contacts", note: "Contact responses" },
          { label: "Live",      href: "/admin-live",     note: "Stream settings" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="bg-zinc-950 px-5 py-5 flex flex-col gap-1 hover:bg-zinc-900 transition-colors group"
          >
            <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">{link.note}</span>
            <span className="font-body text-white font-semibold text-sm group-hover:text-white/70 transition-colors">
              {link.label} →
            </span>
          </a>
        ))}
      </div>

    </div>
  );
}
