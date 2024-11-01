"use server";
import { Client, Account, OAuthProvider } from "node-appwrite";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "app_session";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const reqCookies = await cookies();
  const session = reqCookies.get(SESSION_COOKIE);
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function signInWithGithub() {
  const { account } = await createAdminClient();

  const reqCookies = await headers();
  const origin = reqCookies.get("origin");
  const successUrl = `${origin}/oauth`;
  const failureUrl = `${origin}/signin`;

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Apple,
    successUrl,
    failureUrl
  );

  redirect(redirectUrl);
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}
