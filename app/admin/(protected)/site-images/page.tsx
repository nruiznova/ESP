"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteImagesSchema, type SiteImagesInput } from "@/lib/validations";
import { ImageUpload } from "@/components/admin/ImageUpload";

const UPLOAD_FOLDER = "elite-construction/site-images";

const defaultValues: SiteImagesInput = {
  homeHero: null,
  homeCommercial: null,
  homeResidential: null,
  commercialBanner: null,
  commercialSection: null,
  residentialBanner: null,
  residentialBeforeAfter: [
    { title: "Kitchen Transformation", before: null, after: null },
    { title: "Custom Tile Shower", before: null, after: null },
  ],
};

const setImageValue = (
  setValue: ReturnType<typeof useForm<SiteImagesInput>>["setValue"],
  field: keyof Pick<
    SiteImagesInput,
    | "homeHero"
    | "homeCommercial"
    | "homeResidential"
    | "commercialBanner"
    | "commercialSection"
    | "residentialBanner"
  >,
  data: { url: string; publicId: string } | null
) => {
  setValue(field, data, { shouldDirty: true, shouldValidate: true });
};

export default function AdminSiteImagesPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loadError, setLoadError] = useState("");

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SiteImagesInput>({
    resolver: zodResolver(siteImagesSchema),
    defaultValues,
  });

  const homeHero = watch("homeHero");
  const homeCommercial = watch("homeCommercial");
  const homeResidential = watch("homeResidential");
  const commercialBanner = watch("commercialBanner");
  const commercialSection = watch("commercialSection");
  const residentialBanner = watch("residentialBanner");
  const beforeAfter = watch("residentialBeforeAfter");

  useEffect(() => {
    fetch("/api/site-images")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          throw new Error(
            typeof data.error === "string"
              ? data.error
              : "Could not load site images from the database."
          );
        }
        reset({
          homeHero: data.homeHero ?? null,
          homeCommercial: data.homeCommercial ?? null,
          homeResidential: data.homeResidential ?? null,
          commercialBanner: data.commercialBanner ?? null,
          commercialSection: data.commercialSection ?? null,
          residentialBanner: data.residentialBanner ?? null,
          residentialBeforeAfter: data.residentialBeforeAfter?.length === 2
            ? data.residentialBeforeAfter
            : defaultValues.residentialBeforeAfter,
        });
        setLoading(false);
      })
      .catch((error: unknown) => {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load site images from the database."
        );
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: SiteImagesInput) => {
    setSubmitError("");
    setSaved(false);

    const res = await fetch("/api/site-images", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      return;
    }

    const text = await res.text();
    let message = `Could not save site images (${res.status}).`;
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

  const inputClass =
    "w-full bg-white border border-stone/25 text-cream placeholder:text-muted px-3 py-2.5 text-sm focus:outline-none focus:border-stone transition-colors";
  const labelClass =
    "text-xs font-semibold uppercase tracking-widest text-stone-light mb-1.5 block";
  const sectionClass = "bg-surface border border-stone/15 p-8 space-y-6";

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
        <h1 className="text-display text-4xl text-cream mb-1">Site Images</h1>
        <p className="text-muted text-sm">
          Upload images here, then click <strong className="text-cream">Save Site Images</strong> to
          publish them on the website.
        </p>
      </div>

      {loadError && (
        <p className="text-red-light text-sm border border-red/30 bg-red/10 px-4 py-3 mb-6 max-w-3xl" role="alert">
          {loadError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        <div className={sectionClass}>
          <h2 className="text-display text-2xl text-cream">Home Page</h2>
          <ImageUpload
            label="Hero Image (top banner)"
            folder={UPLOAD_FOLDER}
            value={homeHero?.url}
            onChange={(data) => setImageValue(setValue, "homeHero", data)}
          />
          <ImageUpload
            label="Commercial Card"
            folder={UPLOAD_FOLDER}
            value={homeCommercial?.url}
            onChange={(data) => setImageValue(setValue, "homeCommercial", data)}
          />
          <ImageUpload
            label="Residential Card"
            folder={UPLOAD_FOLDER}
            value={homeResidential?.url}
            onChange={(data) => setImageValue(setValue, "homeResidential", data)}
          />
        </div>

        <div className={sectionClass}>
          <h2 className="text-display text-2xl text-cream">Commercial Page</h2>
          <ImageUpload
            label="Page Banner (hero)"
            folder={UPLOAD_FOLDER}
            value={commercialBanner?.url}
            onChange={(data) => setImageValue(setValue, "commercialBanner", data)}
          />
          <ImageUpload
            label="Heritage Section Image"
            folder={UPLOAD_FOLDER}
            value={commercialSection?.url}
            onChange={(data) => setImageValue(setValue, "commercialSection", data)}
          />
        </div>

        <div className={sectionClass}>
          <h2 className="text-display text-2xl text-cream">Residential Page</h2>
          <ImageUpload
            label="Page Banner (hero)"
            folder={UPLOAD_FOLDER}
            value={residentialBanner?.url}
            onChange={(data) => setImageValue(setValue, "residentialBanner", data)}
          />

          {beforeAfter.map((item, i) => (
            <div key={i} className="pt-4 border-t border-stone/10 space-y-4">
              <p className="text-sm font-semibold text-cream">Before & After #{i + 1}</p>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  className={inputClass}
                  value={item.title}
                  onChange={(e) =>
                    setValue(`residentialBeforeAfter.${i}.title`, e.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  placeholder="Project title"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload
                  label="Before"
                  folder={UPLOAD_FOLDER}
                  value={item.before?.url}
                  onChange={(data) =>
                    setValue(`residentialBeforeAfter.${i}.before`, data, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                <ImageUpload
                  label="After"
                  folder={UPLOAD_FOLDER}
                  value={item.after?.url}
                  onChange={(data) =>
                    setValue(`residentialBeforeAfter.${i}.after`, data, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {(submitError || Object.keys(errors).length > 0) && (
          <p className="text-red-light text-sm border border-red/30 bg-red/10 px-4 py-3" role="alert">
            {submitError ||
              "Please fix the highlighted fields before saving."}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-red text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-dark disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? "Saving…" : "Save Site Images"}
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
  );
}
