import { z } from "zod";
import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";

import { columns } from "./columns";
import { userSchemaAdditional } from "@/types/index";
import { DataTable } from "@/components/table/data-table";
import { getUsers } from "@/actions/user.actions";

// async function getUsers(page: number, perPage: number) {
//   const res = await fetch(`https://jsonplaceholder.org/users`)
//   const apiUsers = await res.json()

//   // Transforming API response to match User type
//   const users = apiUsers.map((apiUser: any) => ({
//     id: apiUser.id.toString(),
//     username: apiUser.login.username,
//     firstname: apiUser.firstname,
//     lastname: apiUser.lastname,
//     email: apiUser.email,
//     phone: apiUser.phone,
//     role: "user", // You might want to adjust this based on actual data
//     status: "active", // You might want to adjust this based on actual data
//   }));

//   return z.array(userSchemaAdditional).parse(users)
// }

export default async function UserPage() {
  // const data = await getData()
  const data = await getUsers();
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="p-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
