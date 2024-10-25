import { pgEnum, pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

// Enums
export const roleAccessEnum = pgEnum("role_access", ["user", "admin", "mod"]);
export const roleTypeEnum = pgEnum("role_type", ["nonRole", "IT", "Doctor", "Nurse", "Technician"]);

export const userStatusEnum = pgEnum("user_status", ['active', 'blocked', 'disabled', 'not-activated', 'canceled']);

// Domain Table
export const domainTable = pgTable("domain", {
  id: uuid("id").primaryKey(),
  domain: text("domain").notNull().unique(),
  dbUrl: text("db_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// User Table
export const userTable = pgTable("user", {
  id: uuid("id").primaryKey(),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password"),
  domainId: uuid("domain_id").notNull().references(() => domainTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()), // Use $onUpdateFn
});

// User Data Table
export const userDataTable = pgTable("user_data", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  roleAccess: roleAccessEnum("role_access").notNull().default("user"),
  roleType: roleTypeEnum("role_type").notNull().default("nonRole"),
  status: userStatusEnum("user_status").notNull().default("not-activated"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()), // Use $onUpdateFn
});

// Session Table
export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
