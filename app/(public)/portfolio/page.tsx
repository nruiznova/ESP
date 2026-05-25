import type { Metadata } from "next";
import { getAllProjectsForSite } from "@/lib/data/projects";
import { PortfolioClient } from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse our complete portfolio of commercial and residential construction projects across Upstate South Carolina.",
};

export default async function PortfolioPage() {
  const projects = await getAllProjectsForSite();
  return <PortfolioClient projects={projects} />;
}
