import { signOut } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GearIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";

// TypeScript correctly typed props
interface CogProps {
  userName: string; // onLogout function prop
}

async function handleSignOut(formData: FormData) {
  "use server";
  await signOut();
  redirect("/sign-in");
}

export async function Cog({ userName }: CogProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default">
          <GearIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Witaj, {userName}!</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>Profil</DropdownMenuItem>
          <DropdownMenuItem>Ustawienia</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <form action={handleSignOut} className="w-full">
            <Button type="submit" className="w-full">
              Logout
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
