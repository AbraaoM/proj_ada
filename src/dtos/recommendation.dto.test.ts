import { describe, expect, test } from "vitest";
import type { ClothingRecommendation } from "@/models/clothing.model";
import type { Weather } from "@/models/weather.model";
import { toRecommendationDto } from "./recommendation.dto";

const weather: Weather = {
  temperatureC: 22,
  apparentTemperatureC: 21,
  windSpeedKmh: 34,
  isRaining: true,
  observedAt: "2026-10-13T14:00",
};

const clothing: ClothingRecommendation = {
  outfit: "body de manga + calça + casaco + capa/impermeável",
  reason: "22°C está na faixa de 20–25°C, então o indicado é body de manga + calça.",
};

describe("toRecommendationDto", () => {
  test("leva só o que a tela de agora mostra", () => {
    const dto = toRecommendationDto(
      { ...weather, weatherCode: 61 } as Weather & { weatherCode: number },
      clothing,
      "Pindamonhangaba, SP",
    );

    expect(dto).toEqual({
      temperatureC: 22,
      apparentTemperatureC: 21,
      windSpeedKmh: 34,
      raining: true,
      outfit: clothing.outfit,
      reason: clothing.reason,
      location: "Pindamonhangaba, SP",
    });
    expect(Object.keys(dto).sort()).toEqual([
      "apparentTemperatureC",
      "location",
      "outfit",
      "raining",
      "reason",
      "temperatureC",
      "windSpeedKmh",
    ]);
    expect(dto).not.toHaveProperty("weatherCode");
    expect(dto).not.toHaveProperty("observedAt");
    expect(dto).not.toHaveProperty("isRaining");
  });

  test("preserva sensação ausente", () => {
    const dto = toRecommendationDto(
      { ...weather, apparentTemperatureC: null },
      clothing,
      "Pindamonhangaba, SP",
    );

    expect(dto.apparentTemperatureC).toBeNull();
  });
});
