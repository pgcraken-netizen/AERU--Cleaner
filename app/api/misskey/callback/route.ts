import { NextRequest, NextResponse } from "next/server";

const MISSKEY_HOST = "https://wa-community.net";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session");
  const savedSession = request.cookies.get("aeru_miauth_session")?.value;

  if (!sessionId || !savedSession || sessionId !== savedSession) {
    return NextResponse.json(
      { error: "Invalid or expired Misskey authentication session." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${MISSKEY_HOST}/api/miauth/${encodeURIComponent(sessionId)}/check`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Misskey authentication failed." },
      { status: 401 },
    );
  }

  const data = await response.json();

  if (!data.token || !data.user) {
    return NextResponse.json(
      { error: "Misskey did not return valid authentication data." },
      { status: 401 },
    );
  }

  const result = NextResponse.redirect(
    new URL("/?misskey=connected", request.url),
  );

  result.cookies.delete("aeru_miauth_session");

  result.cookies.set(
    "aeru_misskey_token",
    data.token,
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  );

  result.cookies.set(
    "aeru_misskey_user",
    JSON.stringify({
      id: data.user.id,
      username: data.user.username,
      name: data.user.name,
      host: data.user.host ?? null,
    }),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  );

  return result;
}
