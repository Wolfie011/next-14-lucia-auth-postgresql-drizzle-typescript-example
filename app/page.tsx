import { Button } from "@/components/ui/button"
import { validateRequest } from "@/lib/lucia"
import { redirect } from "next/navigation"
import { signOut } from "@/actions/auth.actions"

export default async function Home() {
  const { user, userAdditionalData } = await validateRequest()

  if (!user) {
    return redirect("/sign-in")
  }

  async function handleSignOut(formData: FormData) {
    "use server";
    await signOut();
    redirect("/sign-in");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Protected route</p>
      <p>{JSON.stringify(user)}</p>
      <p className="text-nowrap	">{JSON.stringify(userAdditionalData)}</p>
      <form action={handleSignOut}>
        <Button type="submit">Sign out</Button>
      </form>
    </main>
  )
}
