"use client";

import { useState, useEffect } from "react";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budgetRange?: string;
  read: boolean;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string, read: boolean) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, read } : l)));
    if (selected?._id === id) setSelected((s) => s ? { ...s, read } : s);
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setLeads((prev) => prev.filter((l) => l._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const unread = leads.filter((l) => !l.read).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display text-4xl text-cream mb-1">
          Leads
          {unread > 0 && (
            <span className="ml-3 text-xl bg-red text-white px-2.5 py-0.5 align-middle">{unread} new</span>
          )}
        </h1>
        <p className="text-muted text-sm">Project inquiries received from the contact form.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead list */}
        <div className="lg:col-span-1 space-y-2">
          {loading ? (
            <div className="text-muted text-center py-16">Loading…</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16 bg-surface border border-stone/10">
              <p className="text-muted text-sm">No leads yet.</p>
            </div>
          ) : (
            leads.map((lead) => (
              <button
                key={lead._id}
                onClick={() => {
                  setSelected(lead);
                  if (!lead.read) markRead(lead._id, true);
                }}
                className={`w-full text-left p-4 border transition-all ${
                  selected?._id === lead._id
                    ? "border-stone/50 bg-surface-2"
                    : !lead.read
                    ? "border-red/20 bg-red/5 hover:border-red/40"
                    : "border-stone/10 bg-surface hover:border-stone/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-cream truncate">{lead.name}</p>
                  {!lead.read && (
                    <span className="flex-shrink-0 w-2 h-2 bg-red rounded-full mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-muted capitalize mt-0.5">{lead.projectType}</p>
                <p className="text-xs text-muted mt-1">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Lead detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="h-full flex items-center justify-center bg-surface border border-stone/10 min-h-[300px]">
              <p className="text-muted text-sm">Select a lead to view details</p>
            </div>
          ) : (
            <div className="bg-surface border border-stone/10 p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-display text-3xl text-cream">{selected.name}</h2>
                  <p className="text-muted text-sm mt-1">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markRead(selected._id, !selected.read)}
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest border border-stone/30 text-muted hover:text-cream transition-colors"
                  >
                    {selected.read ? "Mark Unread" : "Mark Read"}
                  </button>
                  <button
                    onClick={() => deleteLead(selected._id)}
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest border border-red/30 text-red-light hover:bg-red/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Email", value: selected.email, href: `mailto:${selected.email}` },
                  { label: "Phone", value: selected.phone, href: `tel:${selected.phone}` },
                  { label: "Project Type", value: selected.projectType },
                  { label: "Budget", value: selected.budgetRange || "Not specified" },
                ].map((item) => (
                  <div key={item.label} className="bg-surface-2 p-3 border border-stone/10">
                    <p className="text-xs uppercase tracking-widest text-muted mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-cream hover:text-stone-light transition-colors capitalize">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-cream capitalize">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-surface-2 p-4 border border-stone/10">
                <p className="text-xs uppercase tracking-widest text-muted mb-3">Message</p>
                <p className="text-sm text-cream-muted leading-relaxed">{selected.description}</p>
              </div>

              <div className="flex gap-3 mt-6">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your Project Inquiry`}
                  className="px-5 py-2.5 bg-red text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-dark transition-colors"
                >
                  Reply via Email
                </a>
                <a
                  href={`tel:${selected.phone}`}
                  className="px-5 py-2.5 border border-stone/30 text-cream text-xs font-semibold uppercase tracking-widest hover:border-stone transition-colors"
                >
                  Call
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
