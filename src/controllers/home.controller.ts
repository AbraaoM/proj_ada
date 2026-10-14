import {
  toRecommendationDto,
  type RecommendationDto,
} from "@/dtos/recommendation.dto";
import {
  toClothingCheckDto,
  type ClothingCheckDto,
} from "@/dtos/clothing-check.dto";
import { defaultLocation } from "@/infra/location";
import { recommend } from "@/services/clothing.service";
import { HistoryError, list } from "@/services/history.service";
import { getCurrent, WeatherError } from "@/services/weather.service";
import type { HomeViewModel } from "@/views/home-view";

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

async function readRecommendation(): Promise<{
  dto: RecommendationDto | null;
  message: string | null;
}> {
  try {
    const weather = await getCurrent(defaultLocation);
    const clothing = recommend({
      temperatureC: weather.temperatureC,
      windSpeedKmh: weather.windSpeedKmh,
      isRaining: weather.isRaining,
    });
    return {
      dto: toRecommendationDto(weather, clothing, defaultLocation.label),
      message: null,
    };
  } catch (error) {
    if (error instanceof WeatherError) {
      return { dto: null, message: error.message };
    }
    throw error;
  }
}

async function readHistory(): Promise<{
  items: ClothingCheckDto[];
  message: string | null;
}> {
  try {
    const rows = await list();
    return { items: rows.map(toClothingCheckDto), message: null };
  } catch (error) {
    if (error instanceof HistoryError) {
      return { items: [], message: error.message };
    }
    throw error;
  }
}

export async function index(
  searchParams: Record<string, string | string[] | undefined>,
  now: Date,
): Promise<HomeViewModel> {
  const [recommendation, history] = await Promise.all([
    readRecommendation(),
    readHistory(),
  ]);

  const error = first(searchParams.error);
  let historyMessage = history.message;
  if (error === "history") {
    historyMessage = "Não consegui salvar o histórico agora.";
  }

  let weatherMessage = recommendation.message;
  if (error === "weather" && !weatherMessage) {
    weatherMessage = "Não consegui buscar o clima agora.";
  }

  return {
    location: defaultLocation.label,
    recommendation: recommendation.dto,
    weatherMessage,
    history: history.items,
    historyMessage,
    nowIso: now.toISOString(),
  };
}

export const homeRoutes = {
  "/": { GET: index },
} as const;
