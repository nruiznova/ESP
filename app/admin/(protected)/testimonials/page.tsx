"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations";

interface Testimonial extends TestimonialInput {
  _id: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { rating: 5, visible: true },
  });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials?all=true");
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch {
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    reset({ clientName: "", text: "", rating: 5, visible: true });
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    reset(t);
    setShowForm(true);
  };

  const onSubmit = async (data: TestimonialInput) => {
    const url = editing ? `/api/testimonials/${editing._id}` : "/api/testimonials";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setShowForm(false);
      fetchTestimonials();
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    fetchTestimonials();
  };

  const inputClass = "w-full bg-white border border-stone/25 text-cream placeholder:text-muted px-3 py-2.5 text-sm focus:outline-none focus:border-stone transition-colors";
  const labelClass = "text-xs font-semibold uppercase tracking-widest text-stone-light mb-1.5 block";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display text-4xl text-cream mb-1">Testimonials</h1>
          <p className="text-muted text-sm">Manage client testimonials displayed on the site.</p>
        </div>
        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-red text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-dark transition-colors"
        >
          + Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="bg-surface border border-stone/15 p-8 mb-8">
          <h2 className="text-display text-2xl text-cream mb-6">
            {editing ? "Edit Testimonial" : "New Testimonial"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Client Name *</label>
                <input {...register("clientName")} className={inputClass} placeholder="John Smith" />
                {errors.clientName && <p className="text-red-light text-xs mt-1">{errors.clientName.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Company (optional)</label>
                <input {...register("company")} className={inputClass} placeholder="Smith Properties LLC" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Testimonial *</label>
              <textarea {...register("text")} rows={4} className={`${inputClass} resize-none`} placeholder="What the client said…" />
              {errors.text && <p className="text-red-light text-xs mt-1">{errors.text.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Rating (1-5)</label>
                <input {...register("rating", { valueAsNumber: true })} type="number" min={1} max={5} className={inputClass} />
              </div>
              <div className="flex items-end gap-3 pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("visible")} className="w-4 h-4 accent-red" />
                  <span className="text-sm text-cream-muted">Visible on site</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-red text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-dark disabled:opacity-60 transition-colors">
                {isSubmitting ? "Saving…" : editing ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-stone/30 text-muted text-xs font-semibold uppercase tracking-widest hover:text-cream transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-muted text-center py-16">Loading…</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-stone/10">
          <p className="text-muted">No testimonials yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-surface border border-stone/10 p-6 flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-cream">{t.clientName}</p>
                  {t.company && <span className="text-xs text-muted">· {t.company}</span>}
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-xs ${i < t.rating ? "text-red" : "text-muted"}`}>★</span>
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed line-clamp-2">{t.text}</p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${t.visible ? "text-green-400" : "text-muted"}`}>
                  {t.visible ? "Visible" : "Hidden"}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(t)} className="text-xs text-stone-light hover:text-cream transition-colors uppercase tracking-wider">Edit</button>
                  <button onClick={() => deleteTestimonial(t._id)} className="text-xs text-muted hover:text-red-light transition-colors uppercase tracking-wider">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
