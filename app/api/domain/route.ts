import db from "@/lib/database";
import { domainTable } from "@/lib/database/schema"; // Import the table schema

export async function GET() {
  try {
    // Query the `domainTable` using the schema reference
    const domainList = await db.select().from(domainTable);
    // console.log(domainList);
    // Return the list of domains as JSON
    return new Response(JSON.stringify(domainList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle errors and return a proper error response
    return new Response(
      JSON.stringify({ error: "Failed to fetch domains" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
