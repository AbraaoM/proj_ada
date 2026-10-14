import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/models/clothing-check.model.ts",
  out: "./db",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://local/placeholder",
  },
});
