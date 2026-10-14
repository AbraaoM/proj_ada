import { desc } from "drizzle-orm";
import { getDb } from "@/infra/db";
import {
  clothingChecks,
  type ClothingCheck,
} from "@/models/clothing-check.model";

const HISTORY_LIMIT = 10;

export class HistoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HistoryError";
  }
}

export type NewClothingCheck = {
  temperatureC: number;
  recommendation: string;
  location: string;
};

function requireDb() {
  if (!process.env.DATABASE_URL) {
    throw new HistoryError("Histórico indisponível.");
  }
  return getDb();
}

export async function list(): Promise<ClothingCheck[]> {
  try {
    const db = requireDb();
    return await db
      .select()
      .from(clothingChecks)
      .orderBy(desc(clothingChecks.checkedAt))
      .limit(HISTORY_LIMIT);
  } catch (error) {
    if (error instanceof HistoryError) throw error;
    throw new HistoryError("Não consegui carregar o histórico.");
  }
}

export async function record(input: NewClothingCheck): Promise<ClothingCheck> {
  try {
    const db = requireDb();
    const rows = await db
      .insert(clothingChecks)
      .values({
        temperatureC: input.temperatureC.toFixed(1),
        recommendation: input.recommendation,
        location: input.location,
      })
      .returning();
    const row = rows[0];
    if (!row) throw new Error("insert vazio");
    return row;
  } catch (error) {
    if (error instanceof HistoryError) throw error;
    throw new HistoryError("Não consegui salvar o histórico agora.");
  }
}
