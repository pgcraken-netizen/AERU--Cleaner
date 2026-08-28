import { NextResponse } from "next/server";

const MISSKEY_HOST = "https://wa-community.net";

export async function GET() {
  const sessionId = crypto.randomUUID();

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://aeru-cleaner-three.vercel.app";

  const callback = `${appUrl}/api/misskey/callback`;

  const params = new URLSearchParams({
    name: "AERU Cleaner",
    permission: "read:account,read:drive,write:drive",
    callback,
  });

  const response = NextResponse.json({
    sessionId,
    url: `${MISSKEY_HOST}/miauth/${sessionId}?${params.toString()}`,
  });

  response.cookies.set("aeru_miauth_session", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
