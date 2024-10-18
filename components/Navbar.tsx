import { validateRequest } from "@/lib/lucia";
import Link from "next/link";
import { Cog } from "@/components/Cog";
import { ModeToggle } from "./features/modeSwitch";
export default async function Navbar() {
  const { user, userAdditionalData } = await validateRequest();

  return (
    <nav className="bg-slate-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="text-xl text-white">
          MedicaltechWEB
        </Link>
        {user && (
          <div className="w-full block md:w-auto">
            <ul className="font-medium flex flex-row space-x-10">
              <li>
                <Link 
                  href="/" 
                  className="block py-2 px-3 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Główna
                </Link>
              </li>
              <li>
                <Link 
                  href="/users" 
                  className="block py-2 px-3 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Użytkownicy
                </Link>
              </li>
              <li>
                <Link 
                  href="/organizations" 
                  className="block py-2 px-3 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Organizacja
                </Link>
              </li>
            </ul>
          </div>
        )}
        <div className="flex space-x-2">
          {user && <Cog userName={`${userAdditionalData?.firstname} ${userAdditionalData?.lastname}`} />}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
