import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLoggedInUser, signOut } from "@/lib/appwrite-server";

export default async function Home() {
  const user = await getLoggedInUser();
  console.log("user >>>", user);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {user ? (
          <>
            <span>Hello {user.name || user.email}! 👋`</span>
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
          <Link href="/signin">Sign in</Link>
        )}
      </main>
    </div>
  );
}
