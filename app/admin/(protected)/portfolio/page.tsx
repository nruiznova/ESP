"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Badge } from "@/components/ui/Badge";

interface Project extends ProjectInput {
  _id: string;
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: { images: [], featured: false, beforeImage: null, afterImage: null },
  });

  const images = watch("images") || [];
  const beforeImage = watch("beforeImage");
  const afterImage = watch("afterImage");

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    reset({
      title: "",
      description: "",
      category: "commercial",
      images: [],
      featured: false,
      beforeImage: null,
      afterImage: null,
    });
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    reset({
      title: p.title,
      description: p.description,
      category: p.category,
      featured: Boolean(p.featured),
      images: Array.isArray(p.images) ? p.images : [],
      beforeImage: p.beforeImage ?? null,
      afterImage: p.afterImage ?? null,
    });
    setShowForm(true);
  };

  const onSubmit = async (data: ProjectInput) => {
    const url = editing ? `/api/projects/${editing._id}` : "/api/projects";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setShowForm(false);
      fetchProjects();
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const addImage = (data: { url: string; publicId: string } | null) => {
    if (!data) return;
    const current = getValues("images") ?? [];
    setValue("images", [...current, data], { shouldDirty: true, shouldValidate: true });
  };

  const removeImage = (index: number) => {
    setValue("images", images.filter((_, i) => i !== index));
  };

  const inputClass = "w-full bg-white border border-stone/25 text-cream placeholder:text-muted px-3 py-2.5 text-sm focus:outline-none focus:border-stone transition-colors";
  const labelClass = "text-xs font-semibold uppercase tracking-widest text-stone-light mb-1.5 block";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display text-4xl text-cream mb-1">Portfolio</h1>
          <p className="text-muted text-sm">Manage portfolio projects displayed on the website.</p>
        </div>
        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-red text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-dark transition-colors"
        >
          + Add Project
        </button>
      </div>

      {showForm && (
        <div className="bg-surface border border-stone/15 p-8 mb-8">
          <h2 className="text-display text-2xl text-cream mb-6">
            {editing ? "Edit Project" : "New Project"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Project Title *</label>
                <input {...register("title")} className={inputClass} placeholder="e.g. Executive Cabinets Upfit" />
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
              <textarea {...register("description")} rows={3} className={`${inputClass} resize-none`} placeholder="Brief description of the project…" />
              {errors.description && <p className="text-red-light text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Project images */}
            <div>
              <label className={labelClass}>Project Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative h-28 bg-surface-2 border border-stone/20 overflow-hidden group">
                    <Image src={img.url} alt={`Image ${i + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red text-xs font-semibold uppercase tracking-wider transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <ImageUpload
                  folder="elite-construction/projects"
                  onChange={addImage}
                  label=""
                />
              </div>
            </div>

            {/* Before/After */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ImageUpload
                value={beforeImage?.url}
                folder="elite-construction/before-after"
                label="Before Image (optional)"
                onChange={(data) => setValue("beforeImage", data || null)}
              />
              <ImageUpload
                value={afterImage?.url}
                folder="elite-construction/before-after"
                label="After Image (optional)"
                onChange={(data) => setValue("afterImage", data || null)}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-red" />
              <span className="text-sm text-cream-muted">Featured project (shown prominently)</span>
            </label>

            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-red text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-dark disabled:opacity-60 transition-colors">
                {isSubmitting ? "Saving…" : editing ? "Update Project" : "Create Project"}
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
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-stone/10">
          <p className="text-muted">No projects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p._id} className="bg-surface border border-stone/10 overflow-hidden group">
              <div className="relative h-40 bg-surface-2">
                {p.images?.[0]?.url ? (
                  <Image src={p.images[0].url} alt={p.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted text-xs">No image</div>
                )}
                {p.featured && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-red text-white text-[10px] font-semibold uppercase tracking-wider">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <Badge category={p.category} className="mb-2" />
                <h3 className="text-sm font-medium text-cream mb-1">{p.title}</h3>
                <p className="text-xs text-muted line-clamp-2">{p.description}</p>
                <div className="flex gap-3 mt-4 pt-3 border-t border-stone/10">
                  <button onClick={() => openEdit(p)} className="text-xs text-stone-light hover:text-cream transition-colors uppercase tracking-wider">Edit</button>
                  <button onClick={() => deleteProject(p._id)} className="text-xs text-muted hover:text-red-light transition-colors uppercase tracking-wider">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
