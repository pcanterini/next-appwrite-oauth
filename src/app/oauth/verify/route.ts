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

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.secret, {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
    sameSite: "lax" as const,
    // Set domain in production
    ...(process.env.NODE_ENV === "production" && {
      domain: "next-appwrite-oauth.hip.dev",
    }),
  });

  console.log("cookieStore >>>", cookieStore.get(SESSION_COOKIE));

  return NextResponse.json({
    authenticated: true,
    session,
  });

  // if (!sessionSecret?.value) {
  //   return NextResponse.json({ authenticated: false }, { status: 401 });
  // }

  return NextResponse.redirect(
    process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL || "http://localhost:3000"
  );
}

// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { SESSION_COOKIE } from "@/lib/const";
// import { createAdminClient } from "@/lib/appwrite-server";

// export async function GET() {
//   try {
//     const cookieStore = await cookies();
//     const sessionSecret = cookieStore.get(SESSION_COOKIE);

//     // console.log("sessionSecret >>>", sessionSecret);
//     console.log("sessionSecret.value >>>", sessionSecret?.value);
//     // console.log("cookieStore >>>", cookieStore);

//     // if (!sessionSecret?.value) {
//     //   return NextResponse.json({ authenticated: false }, { status: 401 });
//     // }

//     const { account } = await createAdminClient();
//     const session = await account.getSession("current");

//     return NextResponse.json({
//       authenticated: true,
//       session,
//     });
//   } catch (error) {
//     console.error("Session verification error:", error);
//     return NextResponse.json({ authenticated: false }, { status: 401 });
//   }
// }
