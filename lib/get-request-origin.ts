import { headers } from "next/headers";

/**
 * Base URL for server-side fetches to this app's own routes (correct host/port in dev and Vercel).
 */
export async function getRequestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const forwardedProto = h.get("x-forwarded-proto");
    const proto =
      forwardedProto ??
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}
