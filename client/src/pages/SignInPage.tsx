import { SignIn } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </>
  );
}
