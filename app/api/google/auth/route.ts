import { NextResponse } from "next/server";
import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
];

export async function GET() {
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

  const state = crypto.randomUUID();

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });

  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set("aeru_google_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
