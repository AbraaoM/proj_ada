import type { ClothingRecommendation } from "@/models/clothing.model";
import type { Weather } from "@/models/weather.model";

export type RecommendationDto = {
  temperatureC: number;
  apparentTemperatureC: number | null;
  windSpeedKmh: number;
  raining: boolean;
  outfit: string;
  reason: string;
  location: string;
};

export function toRecommendationDto(
  weather: Weather,
  clothing: ClothingRecommendation,
  location: string,
): RecommendationDto {
  return {
    temperatureC: weather.temperatureC,
    apparentTemperatureC: weather.apparentTemperatureC,
    windSpeedKmh: weather.windSpeedKmh,
    raining: weather.isRaining,
    outfit: clothing.outfit,
    reason: clothing.reason,
    location,
  };
}
