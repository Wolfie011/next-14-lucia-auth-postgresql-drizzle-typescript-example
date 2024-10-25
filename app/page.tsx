import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/auth.actions";
import { useState } from "react";
import { PasswordSetupModal } from "@/components/features/password-setup-modal"; // Import your password setup modal component

export default async function Home() {
  const { user, userAdditionalData } = await validateRequest();

  // If there's no authenticated user, redirect to sign-in page
  if (!user || !userAdditionalData) {
    return redirect("/sign-in");
  }

  // Handle user sign out
  async function handleSignOut(formData: FormData) {
    "use server";
    await signOut();
    redirect("/sign-in");
  }

  // Render the protected route and modal
  return (
    <>
      {/* Render the modal outside the main content */}
      {userAdditionalData.status === "not-activated" && (
        <PasswordSetupModal /> // Display the modal unskippable
      )}

      {/* Protected content for activated users */}
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p>Protected route</p>
        <p>{JSON.stringify(user, null, 2)}</p>
        <p className="">{JSON.stringify(userAdditionalData, null, 2)}</p>
        <form action={handleSignOut}>
          <Button type="submit">Sign out</Button>
        </form>
      </main>
    </>
  );
}
