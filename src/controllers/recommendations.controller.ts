import { toRecommendationDto } from "@/dtos/recommendation.dto";
import { defaultLocation } from "@/infra/location";
import { recommend } from "@/services/clothing.service";
import { getCurrent, WeatherError } from "@/services/weather.service";

export async function show(): Promise<Response> {
  try {
    const weather = await getCurrent(defaultLocation);
    const clothing = recommend({
      temperatureC: weather.temperatureC,
      windSpeedKmh: weather.windSpeedKmh,
      isRaining: weather.isRaining,
    });

    return Response.json(
      toRecommendationDto(weather, clothing, defaultLocation.label),
    );
  } catch (error) {
    if (error instanceof WeatherError) {
      return Response.json({ error: error.message }, { status: 502 });
    }
    throw error;
  }
}

export const recommendationRoutes = {
  "/api/recommendations": { GET: show },
} as const;
