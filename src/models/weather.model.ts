export type Weather = {
  temperatureC: number;
  apparentTemperatureC: number | null;
  windSpeedKmh: number;
  isRaining: boolean;
  observedAt: string;
};

const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
]);

function asRecord(value: unknown, message: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    throw new Error(message);
  }
  return value as Record<string, unknown>;
}

function requiredNumber(value: unknown, message: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(message);
  }
  return value;
}

function optionalNumber(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  return requiredNumber(value, "Resposta do clima inválida.");
}

export function parseCurrentWeather(payload: unknown): Weather {
  const body = asRecord(payload, "Resposta do clima inválida.");
  const current = asRecord(body.current, "Resposta do clima inválida.");
  const temperatureC = requiredNumber(
    current.temperature_2m,
    "Resposta do clima sem temperatura.",
  );
  const windSpeedKmh = requiredNumber(
    current.wind_speed_10m,
    "Resposta do clima sem vento.",
  );
  const precipitation = optionalNumber(current.precipitation) ?? 0;
  const rain = optionalNumber(current.rain) ?? 0;
  const weatherCode = optionalNumber(current.weather_code);
  const observedAt = current.time;
  if (typeof observedAt !== "string" || observedAt.length === 0) {
    throw new Error("Resposta do clima sem horário.");
  }

  return {
    temperatureC,
    apparentTemperatureC: optionalNumber(current.apparent_temperature),
    windSpeedKmh,
    isRaining:
      precipitation > 0 ||
      rain > 0 ||
      (weatherCode !== null && RAIN_CODES.has(weatherCode)),
    observedAt,
  };
}
