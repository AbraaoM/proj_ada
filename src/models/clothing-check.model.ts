import { bigint, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const clothingChecks = pgTable("clothing_checks", {
  id: bigint("id", { mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
  temperatureC: numeric("temperature_c", { precision: 4, scale: 1 }).notNull(),
  recommendation: text("recommendation").notNull(),
  location: text("location").notNull(),
});

export type ClothingCheck = typeof clothingChecks.$inferSelect;
