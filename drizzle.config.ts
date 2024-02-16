import { type Config } from "drizzle-kit";

import { env } from "facuCampodonico/env.js";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["todo-list_*"],
} satisfies Config;
