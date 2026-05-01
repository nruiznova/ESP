"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceInput } from "@/lib/validations";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Badge } from "@/components/ui/Badge";

interface Service extends ServiceInput {
  _id: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({ resolver: zodResolver(serviceSchema), defaultValues: { active: true, displayOrder: 0 } });

  const imageUrl = watch("imageUrl");

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services?all=true");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    setSubmitError("");
    reset({ title: "", description: "", category: "commercial", active: true, displayOrder: 0 });
    setShowForm(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setSubmitError("");
    reset(service);
    setShowForm(true);
  };

  const onSubmit = async (data: ServiceInput) => {
    setSubmitError("");
    const url = editing ? `/api/services/${editing._id}` : "/api/services";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setShowForm(false);
      fetchServices();
      return;
    }
    const text = await res.text();
    let message = `Request failed (${res.status})`;
    if (text.trim()) {
      try {
        const parsed = JSON.parse(text) as { error?: string | Record<string, unknown> };
        if (typeof parsed.error === "string") message = parsed.error;
        else if (parsed.error) message = JSON.stringify(parsed.error);
      } catch {
        message = text.slice(0, 200);
      }
    }
    setSubmitError(message);
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    fetchServices();
  };

  const inputClass = "w-full bg-white border border-stone/25 text-cream placeholder:text-muted px-3 py-2.5 text-sm focus:outline-none focus:border-stone transition-colors";
  const labelClass = "text-xs font-semibold uppercase tracking-widest text-stone-light mb-1.5 block";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display text-4xl text-cream mb-1">Services</h1>
          <p className="text-muted text-sm">Manage the services displayed on your website.</p>
        </div>
        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-red text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-dark transition-colors"
        >
          + Add Service
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-surface border border-stone/15 p-8 mb-8">
          <h2 className="text-display text-2xl text-cream mb-6">
            {editing ? "Edit Service" : "New Service"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Title *</label>
                <input {...register("title")} className={inputClass} placeholder="e.g. Tenant Upfits" />
                {errors.title && <p className="text-red-light text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                <select {...register("category")} className={inputClass}>
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea {...register("description")} rows={4} className={`${inputClass} resize-none`} placeholder="Describe this service…" />
              {errors.description && <p className="text-red-light text-xs mt-1">{errors.description.message}</p>}
            </div>

            <ImageUpload
              value={imageUrl}
              folder="elite-construction/services"
              onChange={(data) => {
                setValue("imageUrl", data?.url || "");
                setValue("imagePublicId", data?.publicId || "");
              }}
            />

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Display Order</label>
                <input {...register("displayOrder", { valueAsNumber: true })} type="number" min={0} className={inputClass} />
              </div>
              <div className="flex items-end gap-3 pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("active")} className="w-4 h-4 accent-red" />
                  <span className="text-sm text-cream-muted">Active (visible on site)</span>
                </label>
              </div>
            </div>

            {submitError && (
              <p className="text-red-light text-sm border border-red/30 bg-red/10 px-4 py-3" role="alert">
                {submitError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-red text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-dark disabled:opacity-60 transition-colors">
                {isSubmitting ? "Saving…" : editing ? "Update Service" : "Create Service"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-stone/30 text-muted text-xs font-semibold uppercase tracking-widest hover:text-cream transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-muted text-center py-16">Loading…</div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-stone/10">
          <p className="text-muted">No services yet. Click &quot;Add Service&quot; to create your first.</p>
        </div>
      ) : (
        <div className="bg-surface border border-stone/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone/10 text-left">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted">Service</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted hidden md:table-cell">Category</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted hidden sm:table-cell">Status</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="border-b border-stone/10 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-cream">{service.title}</p>
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">{service.description}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <Badge category={service.category} />
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${service.active ? "text-green-400" : "text-muted"}`}>
                      {service.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(service)} className="text-xs text-stone-light hover:text-cream transition-colors uppercase tracking-wider">
                        Edit
                      </button>
                      <button onClick={() => deleteService(service._id)} className="text-xs text-muted hover:text-red-light transition-colors uppercase tracking-wider">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
