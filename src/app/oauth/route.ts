import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/const";
import { createAdminClient } from "@/lib/appwrite-server";

export async function GET(request: NextRequest) {
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
    sameSite: "strict",
    secure: true,
  });

  return NextResponse.redirect(
    process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL || ""
  );
  // return NextResponse.redirect("https://next-appwrite-oauth.hip.dev/");
}
