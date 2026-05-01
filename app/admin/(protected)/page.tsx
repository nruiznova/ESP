import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { Project } from "@/models/Project";
import { Lead } from "@/models/Lead";
import { Testimonial } from "@/models/Testimonial";

async function getStats() {
  try {
    await connectDB();
    const [services, projects, leads, unreadLeads, testimonials] = await Promise.all([
      Service.countDocuments({ active: true }),
      Project.countDocuments(),
      Lead.countDocuments(),
      Lead.countDocuments({ read: false }),
      Testimonial.countDocuments({ visible: true }),
    ]);
    return { services, projects, leads, unreadLeads, testimonials };
  } catch {
    return { services: 0, projects: 0, leads: 0, unreadLeads: 0, testimonials: 0 };
  }
}

async function getRecentLeads() {
  try {
    await connectDB();
    return await Lead.find().sort({ createdAt: -1 }).limit(5).lean();
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const [stats, recentLeads] = await Promise.all([getStats(), getRecentLeads()]);

  const cards = [
    { label: "Active Services", value: stats.services, href: "/admin/services", color: "border-stone/30" },
    { label: "Portfolio Projects", value: stats.projects, href: "/admin/portfolio", color: "border-stone/30" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/testimonials", color: "border-stone/30" },
    {
      label: "Unread Leads",
      value: stats.unreadLeads,
      href: "/admin/leads",
      color: stats.unreadLeads > 0 ? "border-red/50 bg-red/5" : "border-stone/30",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display text-4xl text-cream mb-1">Dashboard</h1>
        <p className="text-muted text-sm">Welcome back. Here&apos;s your site overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`bg-surface border ${card.color} p-6 hover:border-stone/50 transition-colors group`}
          >
            <p className="text-3xl font-bold text-cream mb-1 group-hover:text-stone transition-colors">{card.value}</p>
            <p className="text-xs uppercase tracking-widest text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent leads */}
        <div className="bg-surface border border-stone/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-display text-xl text-cream">Recent Leads</h2>
            <Link href="/admin/leads" className="text-xs text-stone-light hover:text-cream transition-colors uppercase tracking-wider">
              View all →
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <p className="text-muted text-sm py-8 text-center">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead: Record<string, unknown>) => (
                <div
                  key={String(lead._id)}
                  className={`flex items-start justify-between gap-4 p-3 border transition-colors ${
                    !lead.read ? "border-red/20 bg-red/5" : "border-stone/10"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-cream">{String(lead.name)}</p>
                    <p className="text-xs text-muted capitalize">{String(lead.projectType)} · {String(lead.phone)}</p>
                  </div>
                  {!lead.read && (
                    <span className="flex-shrink-0 text-[10px] px-2 py-1 bg-red/20 text-red-light uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-surface border border-stone/10 p-6">
          <h2 className="text-display text-xl text-cream mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { href: "/admin/services", label: "Add Service" },
                { href: "/admin/portfolio", label: "Add Project" },
                { href: "/admin/testimonials", label: "Add Testimonial" },
                { href: "/admin/settings", label: "Edit Contact Info" },
                { href: "/admin/leads", label: "View All Leads" },
                { href: "/", label: "View Live Site ↗", external: true },
              ] as const
            ).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                {...("external" in item && item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted border border-stone/20 hover:text-cream hover:border-stone/50 transition-colors text-center"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
