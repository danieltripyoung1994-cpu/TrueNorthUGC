import { SignUp } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </>
  );
}
