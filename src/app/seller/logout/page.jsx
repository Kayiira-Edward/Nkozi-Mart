"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear local storage (adjust if using auth tokens, etc.)
    localStorage.clear();

    // Optional: clear cookies or sessionStorage if needed
    // sessionStorage.clear();

    // Redirect to homepage or login
    router.push("/");
  }, [router]);

  return (
    <div className="py-10 text-center">
      <h1 className="text-xl font-semibold">Logging out...</h1>
      <p>Please wait while we sign you out.</p>
    </div>
  );
}
