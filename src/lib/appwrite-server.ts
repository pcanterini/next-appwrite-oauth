"use server";
import { Client, Account, OAuthProvider } from "node-appwrite";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "./const";

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

export async function signInWithGoogle() {
  const { account } = await createAdminClient();

  const reqCookies = await headers();
  const origin = reqCookies.get("origin");
  const successUrl = `${origin}/oauth`;
  const failureUrl = `${origin}/signin`;

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    successUrl,
    failureUrl
  );

  redirect(redirectUrl);
}

export async function signInWithApple() {
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

export async function signOut() {
  const { account } = await createSessionClient();
  const reqCookies = await cookies();

  reqCookies.delete(SESSION_COOKIE);
  await account.deleteSession("current");

  redirect("/signin");
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
