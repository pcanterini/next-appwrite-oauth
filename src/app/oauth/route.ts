import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/const";
import { createAdminClient } from "@/lib/appwrite-server";

export async function GET(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isSecureContext =
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https") ?? !isDevelopment;
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    return new NextResponse("OAuth2 did not provide token", { status: 400 });
  }

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  if (!session || !session.secret) {
    return new NextResponse("Failed to create session from token", {
      status: 400,
    });
  }

  const reqCookies = await cookies();
  reqCookies.set(SESSION_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: isSecureContext ? "strict" : "lax",
    secure: isSecureContext,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
