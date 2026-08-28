import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("aeru_google_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.json(
      { error: "Invalid Google OAuth state or authorization code." },
      { status: 400 },
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://aeru-cleaner-three.vercel.app";

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Google OAuth credentials are not configured." },
      { status: 500 },
    );
  }

  const redirectUri = `${appUrl}/api/google/callback`;

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return NextResponse.json(
        { error: "Google did not return an access token." },
        { status: 401 },
      );
    }

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const about = await drive.about.get({
      fields: "user(displayName,emailAddress,permissionId),storageQuota",
    });

    const response = NextResponse.redirect(
      new URL("/?google=connected", request.url),
    );

    response.cookies.delete("aeru_google_state");

    response.cookies.set(
      "aeru_google_tokens",
      JSON.stringify({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        expiry_date: tokens.expiry_date ?? null,
      }),
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      },
    );

    response.cookies.set(
      "aeru_google_account",
      JSON.stringify({
        email: about.data.user?.emailAddress ?? null,
        name: about.data.user?.displayName ?? null,
      }),
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      },
    );

    return response;
  } catch (error) {
    console.error("Google OAuth callback failed:", error);

    return NextResponse.json(
      { error: "Failed to connect to Google Drive." },
      { status: 500 },
    );
  }
}
