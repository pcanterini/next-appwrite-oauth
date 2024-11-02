import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLoggedInUser, signOut } from "@/lib/appwrite-server";

export default async function Home() {
  const user = await getLoggedInUser();
  console.log("user >>>", user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {user ? (
          <>
            <p className="text-2xl text-white">
              Hello {user.name || user.email}! 👋
            </p>
            <form className="form common-section" action={signOut}>
              <ul
                className="form-list"
                style={{ "--form-list-gap": "1.5rem" } as React.CSSProperties}
              >
                <li className="form-item">
                  <Button
                    className="Button is-secondary is-full-width"
                    type="submit"
                  >
                    Sign out
                  </Button>
                </li>
              </ul>
            </form>
          </>
        ) : (
          <Button
            asChild
            variant="outline"
            className="w-full text-lg text-white bg-zinc-800/20 border-zinc-700 hover:bg-zinc-900 hover:text-white"
          >
            <Link href="/signin">Sign in</Link>
          </Button>
        )}
      </main>
    </div>
  );
}
