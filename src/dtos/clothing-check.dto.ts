import type { ClothingCheck } from "@/models/clothing-check.model";

export type ClothingCheckDto = {
  id: number;
  checkedAt: string;
  temperatureC: number;
  recommendation: string;
  location: string;
};

export function toClothingCheckDto(row: ClothingCheck): ClothingCheckDto {
  return {
    id: row.id,
    checkedAt: row.checkedAt.toISOString(),
    temperatureC: Number(row.temperatureC),
    recommendation: row.recommendation,
    location: row.location,
  };
}
