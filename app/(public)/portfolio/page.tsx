import type { Metadata } from "next";
import { getRequestOrigin } from "@/lib/get-request-origin";
import { PortfolioClient } from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse our complete portfolio of commercial and residential construction projects across Upstate South Carolina.",
};

async function getAllProjects() {
  try {
    const origin = await getRequestOrigin();
    const res = await fetch(`${origin}/api/projects`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await getAllProjects();
  return <PortfolioClient projects={projects} />;
}
