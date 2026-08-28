import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const DRIVE_LIMIT_BYTES = 800 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const rawTokens = request.cookies.get("aeru_google_tokens")?.value;

  if (!rawTokens) {
    return NextResponse.json(
      {
        connected: false,
        error: "Google Drive is not connected.",
      },
      { status: 401 },
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Google OAuth credentials are not configured." },
      { status: 500 },
    );
  }

  try {
    const tokens = JSON.parse(rawTokens);

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      `${process.env.NEXT_PUBLIC_APP_URL || "https://aeru-cleaner-three.vercel.app"}/api/google/callback`,
    );

    oauth2Client.setCredentials(tokens);

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const response = await drive.about.get({
      fields: "user(displayName,emailAddress),storageQuota",
    });

    const quota = response.data.storageQuota;

    const usage =
      quota?.usageInDrive ??
      quota?.usage ??
      "0";

    const limit =
      quota?.limit ??
      String(DRIVE_LIMIT_BYTES);

    const usedBytes = Number(usage);
    const limitBytes = Number(limit);

    const effectiveLimit =
      Number.isFinite(limitBytes) && limitBytes > 0
        ? Math.min(limitBytes, DRIVE_LIMIT_BYTES)
        : DRIVE_LIMIT_BYTES;

    const freeBytes = Math.max(effectiveLimit - usedBytes, 0);

    return NextResponse.json({
      connected: true,
      user: response.data.user ?? null,
      storage: {
        usedBytes,
        usedMB: Number((usedBytes / 1024 / 1024).toFixed(1)),
        limitBytes: effectiveLimit,
        limitMB: Number((effectiveLimit / 1024 / 1024).toFixed(1)),
        freeBytes,
        freeMB: Number((freeBytes / 1024 / 1024).toFixed(1)),
        usagePercent: Number(
          ((usedBytes / effectiveLimit) * 100).toFixed(1),
        ),
      },
    });
  } catch (error) {
    console.error("Google Drive quota request failed:", error);

    return NextResponse.json(
      {
        connected: false,
        error: "Failed to read Google Drive storage.",
      },
      { status: 500 },
    );
  }
}
