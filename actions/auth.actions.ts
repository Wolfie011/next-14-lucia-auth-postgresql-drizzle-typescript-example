"use server"
import { z } from "zod"
import { SignInSchema, SignUpSchema } from "@/types"
import { generateId } from "lucia"
import db from "@/lib/database"
import { userTable } from "@/lib/database/schema"
import { lucia, validateRequest } from "@/lib/lucia"
import { cookies } from "next/headers"
import { eq, and } from "drizzle-orm"
import * as argon2 from "argon2"

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  try {
    SignInSchema.parse(values)
  } catch (error: any) {
    return {
      error: error.message,
    }
  }

  const existingUser = await db.query.userTable.findFirst({
      where: (table) => 
        and(
          eq(table.username, values.username),
          eq(table.domainId, values.domain)
        )
    })
  

  if (!existingUser) {
    return {
      error: "User not found",
    }
  }

  if (!existingUser.hashedPassword) {
    return {
      error: "User not found",
    }
  }

  const isValidPassword = await argon2.verify(
    existingUser.hashedPassword,
    values.password
  )

  if (!isValidPassword) {
    return {
      error: "Incorrect username or password",
    }
  }
  // console.log(existingUser.id)
  const session = await lucia.createSession(existingUser.id, {
    expiresIn: 60 * 60 * 24 * 30,
  })

  const sessionCookie = lucia.createSessionCookie(session.id)

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  return {
    success: "Logged in successfully",
  }
}

export const signOut = async () => {
  try {
    const { session } = await validateRequest()

    if (!session) {
      return {
        error: "Unauthorized",
      }
    }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}
