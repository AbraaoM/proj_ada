import { describe, expect, test } from "vitest";
import type { ClothingCheck } from "@/models/clothing-check.model";
import { toClothingCheckDto } from "./clothing-check.dto";

const row = {
  id: 7,
  checkedAt: new Date("2026-10-13T17:02:00.000Z"),
  temperatureC: "23.2",
  recommendation:
    "body de manga + calça. 23,2°C está na faixa de 20–25°C, então o indicado é body de manga + calça.",
  location: "Pindamonhangaba, SP",
} as ClothingCheck;

describe("toClothingCheckDto", () => {
  test("leva só id, data, temperatura, recomendação e local", () => {
    const dto = toClothingCheckDto({
      ...row,
      internalNote: "não enviar",
    } as ClothingCheck);

    expect(dto).toEqual({
      id: 7,
      checkedAt: "2026-10-13T17:02:00.000Z",
      temperatureC: 23.2,
      recommendation: row.recommendation,
      location: "Pindamonhangaba, SP",
    });
    expect(Object.keys(dto).sort()).toEqual([
      "checkedAt",
      "id",
      "location",
      "recommendation",
      "temperatureC",
    ]);
    expect(dto).not.toHaveProperty("internalNote");
  });
});
