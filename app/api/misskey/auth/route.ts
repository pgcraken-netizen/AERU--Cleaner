import { NextResponse } from "next/server";

export async function GET() {
  const sessionId = crypto.randomUUID();
  const callback = `${process.env.NEXT_PUBLIC_APP_URL || "https://aeru-cleaner-three.vercel.app"}/api/misskey/callback`;

  const params = new URLSearchParams({
    name: "AERU Cleaner",
    permission: "read:account,read:drive,write:drive",
    callback,
  });

  return NextResponse.json({
    sessionId,
    url: `https://wa-community.net/miauth/${sessionId}?${params.toString()}`,
  });
}
