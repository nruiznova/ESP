import { NextResponse } from "next/server";

export function jsonErrorFromMongoOrUnknown(e: unknown): NextResponse {
  const name = e instanceof Error ? e.name : "";
  const msg = e instanceof Error ? e.message : String(e);
  const isConn =
    name === "MongoServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongooseServerSelectionError" ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("querySrv");

  if (isConn) {
    return NextResponse.json(
      {
        error:
          "Cannot connect to MongoDB. Set a valid MONGODB_URI in .env.local, ensure the database is reachable, then restart the dev server.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { error: e instanceof Error ? e.message : "Something went wrong" },
    { status: 500 }
  );
}
