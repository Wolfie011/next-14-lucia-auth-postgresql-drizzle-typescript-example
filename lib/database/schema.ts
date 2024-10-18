import { pgEnum, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"

export const roleEnums = pgEnum("role", ["user", "admin", "mod"])

export const userStatusEnums = pgEnum("status", ['active', 'blocked', 'disabled', 'not-activated', 'canceled'])


export const domainTable = pgTable("domain", {
  id: text("id").primaryKey(),
  domain: text("domain").notNull().unique(),
  db_url: text("db_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
})

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password"),
  domainId: text("domain_id").notNull().references(() => domainTable.id),
})

export const userDataTable = pgTable("userdata", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => userTable.id),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: roleEnums("role").notNull().default("user"),
  status: userStatusEnums("status").notNull().default("not-activated"),
})

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
})
