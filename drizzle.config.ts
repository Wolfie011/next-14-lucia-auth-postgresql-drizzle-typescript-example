import { defineConfig } from "drizzle-kit"
export default defineConfig({
  out: "./drizzle",
  schema: "./lib/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "Leauge1231",
    database: "testNext",
    ssl: false,
  }
  
})
