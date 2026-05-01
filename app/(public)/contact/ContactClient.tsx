"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validations";

interface Settings {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  hours?: string;
}

const defaultSettings: Settings = {
  phone: "+1 (864) 416-4728",
  email: "info@elitesuperiorconstruction.com",
  address: "188 Blalock Rd B, Boiling Springs, SC 29316",
  whatsapp: "18644164728",
  hours: "Mon–Fri: 7AM–6PM · Sat: 8AM–2PM",
};

const budgetOptions = [
  "Under $10,000",
  "$10,000 – $50,000",
  "$50,000 – $150,000",
  "$150,000 – $400,000",
  "Over $400,000",
  "Not sure yet",
];

export function ContactClient({ settings }: { settings: Settings | null }) {
  const s = settings || defaultSettings;
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [whatsappFollowUp, setWhatsappFollowUp] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({ resolver: zodResolver(leadSchema) });

  const onSubmit = async (data: LeadInput) => {
    setStatus("sending");
    setWhatsappFollowUp(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
      if (json.whatsappUrl) setWhatsappFollowUp(json.whatsappUrl as string);
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-surface-2 border border-stone/20 text-cream placeholder:text-muted px-4 py-3 text-sm focus:outline-none focus:border-stone focus:ring-1 focus:ring-stone/30 transition-colors";
  const labelClass = "text-xs font-semibold uppercase tracking-widest text-stone-light mb-2 block";
  const errorClass = "text-red-light text-xs mt-1";

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 px-6 bg-surface-2">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-light mb-4 block">
            Get in Touch
          </span>
          <h1 className="text-display text-[clamp(3.5rem,10vw,8rem)] text-cream leading-none mb-6">
            Let&apos;s Build<br />
            <span className="text-stone">Together</span>
          </h1>
          <span className="accent-line" />
        </div>
      </section>

      {/* Contact grid */}
      <section className="bg-surface-2 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form — takes 3 cols */}
          <div className="lg:col-span-3 bg-surface border border-stone/10 p-8 md:p-10">
            <h2 className="text-display text-3xl text-cream mb-2">Request a Free Estimate</h2>
            <p className="text-sm text-muted mb-8">
              Fill out the form and we&apos;ll get back to you within one business day.
            </p>

            {status === "success" ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-red/10 border border-red/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-display text-3xl text-cream mb-2">Message Sent!</h3>
                <p className="text-muted text-sm mb-4">
                  We received your inquiry and will contact you shortly.
                </p>
                {whatsappFollowUp && (
                  <a
                    href={whatsappFollowUp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-stone-light hover:text-cream border border-stone/30 px-4 py-2 transition-colors"
                  >
                    Open WhatsApp with your message prefilled
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input {...register("name")} className={inputClass} placeholder="John Smith" />
                    {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input {...register("phone")} className={inputClass} placeholder="(864) 555-0000" type="tel" />
                    {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input {...register("email")} className={inputClass} placeholder="john@company.com" type="email" />
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Project Type *</label>
                  <select {...register("projectType")} className={inputClass}>
                    <option value="">Select a type…</option>
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="other">Other / Not sure</option>
                  </select>
                  {errors.projectType && <p className={errorClass}>{errors.projectType.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Estimated Budget</label>
                  <select {...register("budgetRange")} className={inputClass}>
                    <option value="">Select a range…</option>
                    {budgetOptions.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Describe Your Project *</label>
                  <textarea
                    {...register("description")}
                    rows={5}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your project, location, timeline, and any specific requirements…"
                  />
                  {errors.description && <p className={errorClass}>{errors.description.message}</p>}
                </div>

                {status === "error" && (
                  <p className="text-red-light text-sm">
                    Something went wrong. Please try again or call us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-4 bg-red text-white font-semibold uppercase tracking-widest text-sm hover:bg-red-dark disabled:opacity-60 transition-colors duration-200 flex items-center justify-center gap-3"
                >
                  {status === "sending" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Request"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact info — 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <h2 className="text-display text-3xl text-cream mb-6">Contact Info</h2>

              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
                      </svg>
                    ),
                    label: "Phone",
                    value: s.phone || defaultSettings.phone!,
                    href: `tel:${s.phone}`,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    ),
                    label: "Email",
                    value: s.email || defaultSettings.email!,
                    href: `mailto:${s.email}`,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    ),
                    label: "Address",
                    value: s.address || defaultSettings.address!,
                    href: `https://maps.google.com/?q=${encodeURIComponent(s.address || "")}`,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    label: "Hours",
                    value: s.hours || defaultSettings.hours!,
                    href: null,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-10 h-10 bg-surface border border-stone/20 flex items-center justify-center flex-shrink-0 text-stone-light">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-cream-muted hover:text-cream transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-cream-muted">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp card */}
            <a
              href={`https://wa.me/${s.whatsapp || defaultSettings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 bg-[#128C7E]/15 border border-[#128C7E]/30 hover:border-[#128C7E]/60 transition-colors group"
            >
              <div className="w-12 h-12 bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-cream group-hover:text-white transition-colors">
                  Chat on WhatsApp
                </p>
                <p className="text-xs text-muted">Fastest response — Se habla Español</p>
              </div>
            </a>

            {/* Map placeholder */}
            <div className="border border-stone/15 overflow-hidden h-48 relative bg-surface">
              <iframe
                title="Service area map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105600!2d-81.95!3d35.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88568b6cc3f5cf39%3A0x76a3d6d2e94e49e6!2sBoiling%20Springs%2C%20SC!5e0!3m2!1sen!2sus!4v1700000000000"
                className="w-full h-full grayscale opacity-60"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 border-t-2 border-red pointer-events-none" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
