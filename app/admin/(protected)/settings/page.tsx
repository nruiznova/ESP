"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsInput } from "@/lib/validations";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({ resolver: zodResolver(settingsSchema) });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { reset(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: SettingsInput) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const inputClass = "w-full bg-white border border-stone/25 text-cream placeholder:text-muted px-3 py-2.5 text-sm focus:outline-none focus:border-stone transition-colors";
  const labelClass = "text-xs font-semibold uppercase tracking-widest text-stone-light mb-1.5 block";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-stone/30 border-t-stone-light rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display text-4xl text-cream mb-1">Settings</h1>
        <p className="text-muted text-sm">Update your contact information displayed on the website.</p>
      </div>

      <div className="bg-surface border border-stone/15 p-8 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className={labelClass}>Phone Number *</label>
            <input {...register("phone")} className={inputClass} placeholder="+1 (864) 416-4728" />
            {errors.phone && <p className="text-red-light text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Email Address *</label>
            <input {...register("email")} type="email" className={inputClass} placeholder="info@elitesuperiorconstruction.com" />
            {errors.email && <p className="text-red-light text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Physical Address *</label>
            <input {...register("address")} className={inputClass} placeholder="188 Blalock Rd B, Boiling Springs, SC 29316" />
            {errors.address && <p className="text-red-light text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <label className={labelClass}>WhatsApp Number (digits only) *</label>
            <input {...register("whatsapp")} className={inputClass} placeholder="18644164728" />
            <p className="text-xs text-muted mt-1">Include country code. e.g. 18644164728 for US +1 (864) 416-4728</p>
            {errors.whatsapp && <p className="text-red-light text-xs mt-1">{errors.whatsapp.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Business Hours *</label>
            <input {...register("hours")} className={inputClass} placeholder="Mon–Fri: 7AM–6PM · Sat: 8AM–2PM" />
            {errors.hours && <p className="text-red-light text-xs mt-1">{errors.hours.message}</p>}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-red text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-dark disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? "Saving…" : "Save Settings"}
            </button>
            {saved && (
              <span className="text-green-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
