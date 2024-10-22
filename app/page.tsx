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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Check if the user's role is 'not-activated' */}
      {userAdditionalData.status === "not-activated" && (
        <PasswordSetupModal /> // Display the unskippable modal for setting up a new password
      )}

      {/* Protected content for activated users */}
      <p>Protected route</p>
      <p>{JSON.stringify(user)}</p>
      <p className="text-nowrap">{JSON.stringify(userAdditionalData)}</p>
      <form action={handleSignOut}>
        <Button type="submit">Sign out</Button>
      </form>
    </main>
  );
}
