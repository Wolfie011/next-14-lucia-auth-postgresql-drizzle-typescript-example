import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import db from "@/lib/database/index"
import { sessionTable, userTable } from "../database/schema"

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable)

export default adapter
