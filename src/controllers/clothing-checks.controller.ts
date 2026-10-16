import { toClothingCheckDto } from "@/dtos/clothing-check.dto";
import { defaultLocation } from "@/infra/location";
import { recommend } from "@/services/clothing.service";
import { HistoryError, list, record } from "@/services/history.service";
import { getCurrent, WeatherError } from "@/services/weather.service";

function wantsHtml(request: Request): boolean {
  return (request.headers.get("accept") ?? "").includes("text/html");
}

function redirect(request: Request, path: string): Response {
  return Response.redirect(new URL(path, request.url), 303);
}

export async function index(): Promise<Response> {
  try {
    const rows = await list();
    return Response.json(rows.map(toClothingCheckDto));
  } catch (error) {
    if (error instanceof HistoryError) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    throw error;
  }
}

export async function create(request: Request): Promise<Response> {
  const html = wantsHtml(request);

  try {
    const weather = await getCurrent(defaultLocation);
    const clothing = recommend({
      temperatureC: weather.temperatureC,
      windSpeedKmh: weather.windSpeedKmh,
      isRaining: weather.isRaining,
    });
    const row = await record({
      temperatureC: weather.temperatureC,
      recommendation: `${clothing.outfit}. ${clothing.reason}`,
      location: defaultLocation.label,
    });

    if (html) return redirect(request, "/o-que-vestir");
    return Response.json(toClothingCheckDto(row), { status: 201 });
  } catch (error) {
    if (error instanceof WeatherError) {
      if (html) return redirect(request, "/o-que-vestir?error=weather");
      return Response.json({ error: error.message }, { status: 502 });
    }
    if (error instanceof HistoryError) {
      if (html) return redirect(request, "/o-que-vestir?error=history");
      return Response.json({ error: error.message }, { status: 503 });
    }
    throw error;
  }
}

export const clothingCheckRoutes = {
  "/api/clothing-checks": { GET: index, POST: create },
} as const;
