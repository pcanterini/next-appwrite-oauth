// import SignInWithApple from "@/components/sign-in-with-apple";
// import SignInWithGoogle from "@/components/sign-in-with-google";
// import { account } from "@/lib/appwrite-server";
// import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/spinner";
import { getLoggedInUser } from "@/lib/appwrite-server";

// interface User {
//   $id: string;
//   name: string;
//   email: string;
// }

export default async function Home() {
  // const [user, setUser] = useState<User | null>(null);
  // const [loading, setLoading] = useState(true);
  const user = await getLoggedInUser();
  // if (!user) redirect("/signin");

  // useEffect(() => {
  //   checkUser();
  // }, []);

  // const checkUser = async () => {
  //   try {
  //     const currentUser = await account.get();
  //     setUser(currentUser);
  //   } catch (error: unknown) {
  //     console.log("not logged in", error);
  //     setUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {user ? "hi" : <LoadingSpinner />}
      </main>
    </div>
  );
}
