import mongoose from "mongoose";

export const runtime = "nodejs";

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return Response.json({ ok: false, error: "MONGODB_URI is missing" }, { status: 500 });
    }

    // Prevent multiple connections during dev hot-reload
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    }

    const ping = await mongoose.connection.db.admin().ping();

    return Response.json({
      ok: true,
      readyState: mongoose.connection.readyState,
      ping,
      dbName: mongoose.connection.name,
    });
  } catch (err) {
    return Response.json(
      { ok: false, name: err?.name, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

