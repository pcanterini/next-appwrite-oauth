"use client";
import { useEffect, useState } from "react";
import SignInWithApple from "@/components/sign-in-with-apple";
import SignInWithGoogle from "@/components/sign-in-with-google";
import { account } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";

interface User {
  $id: string;
  name: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {!user ? (
          <>
            <SignInWithApple />
            <SignInWithGoogle />
          </>
        ) : (
          <>
            <div>Hi {user.name || user.email}! 👋</div>
            <Button onClick={logout} disabled={loading}>
              {loading ? "Loading..." : "Logout"}
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
