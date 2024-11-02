import SignInWithApple from "@/components/sign-in-with-apple";
import SignInWithGoogle from "@/components/sign-in-with-google";
import Link from "next/link";

export default async function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Sign in to App
          </h1>
          <p className="text-gray-400 text-lg">
            Access all features of our platform
          </p>
        </div>

        <div className="space-y-4 mt-8">
          <SignInWithGoogle />
          <SignInWithApple />
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
