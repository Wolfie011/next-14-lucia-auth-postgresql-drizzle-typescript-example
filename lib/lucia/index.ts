import { AdditionalUserAttributes, Lucia } from "lucia"
import adapter from "./adapter"
import { cookies } from "next/headers"
import { cache } from "react"
import { roleEnums, userStatusEnums } from "@/lib/database/schema"
import db from '@/lib/database/index'
import { eq, and } from "drizzle-orm"

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
      domainId: attributes.domainId
    }
  },
})

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null,
      userAdditionalData: null,
    };
  }

  const { user, session } = await lucia.validateSession(sessionId);

  let userAdditionalData: AdditionalUserAttributes | null = null;

  if (user) {
    const additionalData = await db.query.userDataTable.findFirst({
      where: (table) => eq(table.userId, user.id),
    });
    userAdditionalData = additionalData ?? null;
  }

  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    } else if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch (err) {
    // Next.js can throw an error when setting cookies in certain cases
    console.error("Error setting cookies: ", err);
  }

  return {
    user,
    session,
    userAdditionalData,
  };
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }

  interface DatabaseUserAttributes {
    id: string;
    username: string;
    domainId: string;
  }

  interface AdditionalUserAttributes {
    id: string;
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string | null; // Allow null here
    role: (typeof roleEnums.enumValues)[number];
    status: (typeof userStatusEnums.enumValues)[number];
  }
}


