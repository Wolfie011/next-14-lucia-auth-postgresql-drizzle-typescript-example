"use server";
import { z } from "zod";
import db from "@/lib/database";
import { eq } from "drizzle-orm";
import { userTable, userDataTable } from "@/lib/database/schema";
import { userSchemaBase, UserBaseSchema, SignUpSchema, newPasswordSchema } from "@/types";
import { generateId } from "lucia";
import * as argon2 from "argon2";
import { validateRequest } from "@/lib/lucia";
const { v4: uuidv4 } = require("uuid");

export async function getUsers(): Promise<UserBaseSchema[]> {
  const users = await db
    .select({
      id: userTable.id, // userId as id
      username: userTable.username,
      firstName: userDataTable.firstname,
      lastName: userDataTable.lastname,
      email: userDataTable.email,
      phone: userDataTable.phone,
      roleAccess: userDataTable.roleAccess,
      roleType: userDataTable.roleType,
      status: userDataTable.status,
    })
    .from(userTable)
    .innerJoin(userDataTable, eq(userTable.id, userDataTable.userId));

  // Map database result to the Zod schema and validate each user
  const validatedUsers = users.map((user) => {
    const formattedUser = {
      id: user.id,
      username: user.username,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      phone: user.phone || "", // Handle phone being nullable, set to an empty string if null
      roleAccess: user.roleAccess,
      roleType: user.roleType,
      status: user.status,
    };

    // Validate the user against the Zod schema
    return userSchemaBase.parse(formattedUser);
  });

  return validatedUsers;
}

export const createUsers = async (values: z.infer<typeof SignUpSchema>) => {
  const { user } = await validateRequest();
  if(!user) {
    return {
      error: "No authenticated user found",
    };
  }
  try {
    SignUpSchema.parse(values);
    const userId = generateId(15);

    // Step 1: Start a transaction with an explicit type
    await db.transaction(async (trx) => {
      // Step 2: Hash the password
      const hashedPassword = await argon2.hash(values.password);

      // Step 3: Create entry in 'users' table within the transaction
      const newUser = await trx
        .insert(userTable)
        .values({
          id: uuidv4(),
          username: values.username,
          hashedPassword,
          domainId: user?.domainId
        })
        .returning({
          id: userTable.id,
        });

      if (!newUser.length) {
        throw new Error("Failed to create user");
      }

      const userId = newUser[0].id;

      // Step 4: Use the userId to create an entry in 'userData' table within the transaction
      const newUserData = await trx.insert(userDataTable).values({
        id: uuidv4(),
        userId: userId,
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        phone: values.phone,
        roleAccess: values.role as "user" | "admin" | "mod",
        roleType: 'nonRole',
        status: "not-activated",
      });

      if (!newUser || newUser.length === 0) {
        throw new Error("Failed to create user additional data");
      }

      // Step 5: Commit happens automatically when the function scope finishes successfully.
    });

    return {
      success: true,
      data: {
        userId,
      },
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export async function deleteUser(userId: string) {
  const { user, userAdditionalData } = await validateRequest();
  if(!user) {
    return {
      error: "No authenticated user found",
    };
  }
  if(['admin', 'mod'].includes(userAdditionalData?.roleAccess ?? '')) {
    return {
        error: "Insuficient permission",
    };
  }

  try {
    await db.delete(userDataTable).where(eq(userDataTable.userId, userId));
    await db.delete(userTable).where(eq(userTable.id, userId));
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
}

export const setNewPassword = async (values: z.infer<typeof newPasswordSchema>) => {
  const { user } = await validateRequest();
  if(!user) {
    return {
      error: "No authenticated user found",
    };
  }
  try {
    newPasswordSchema.parse(values);
    const hashedPassword = await argon2.hash(values.password);

    await db.update(userTable).set({
      hashedPassword: hashedPassword,
    }).where(eq(userTable.id, user.id));
    await db.update(userDataTable).set({
      status: "active",
    }).where(eq(userDataTable.userId, user.id));
    return {
      success: true,
    }
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
}

export async function changeUserRole(userId: string, role: string) {
  // const { user, userAdditionalData } = await validateRequest();
  // if(!user) {
  //   return {
  //     error: "No authenticated user found",
  //   };
  // }
  // if(['admin', 'mod'].includes(userAdditionalData?.roleAccess ?? '')) {
  //   return {
  //       error: "Insuficient permission",
  //   };
  // }

  try {
    console.log("userId", userId, "role", role);
    await db.update(userDataTable).set({
      roleAccess: role as "user" | "admin" | "mod",
    }).where(eq(userDataTable.userId, userId));
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
}