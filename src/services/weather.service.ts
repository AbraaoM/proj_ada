import { parseCurrentWeather, type Weather } from "@/models/weather.model";

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com";
const REQUEST_TIMEOUT_MS = 8000;

export class WeatherError extends Error {
  constructor() {
    super("Não consegui buscar o clima agora.");
    this.name = "WeatherError";
  }
}

type ForecastLocation = {
  latitude: number;
  longitude: number;
  timezone: string;
};

export async function getCurrent(location: ForecastLocation): Promise<Weather> {
  const base = process.env.OPEN_METEO_BASE_URL ?? OPEN_METEO_BASE_URL;
  const url = new URL("/v1/forecast", base.endsWith("/") ? base : `${base}/`);
  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,wind_speed_10m,precipitation,rain,weather_code",
  );
  url.searchParams.set("timezone", location.timezone);
  url.searchParams.set("wind_speed_unit", "kmh");
  url.searchParams.set("forecast_days", "1");

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new WeatherError();
    return parseCurrentWeather(await response.json());
  } catch (error) {
    if (error instanceof WeatherError) throw error;
    throw new WeatherError();
  }
}
