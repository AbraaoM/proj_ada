import { describe, expect, test } from "vitest";
import { parseCurrentWeather } from "./weather.model";

function payload(current: Record<string, unknown>) {
  return { current };
}

const calm = {
  time: "2026-10-13T14:00",
  temperature_2m: 23.2,
  apparent_temperature: 21.4,
  wind_speed_10m: 12,
  precipitation: 0,
  rain: 0,
  weather_code: 2,
};

describe("parseCurrentWeather", () => {
  test("lê temperatura, sensação, vento e horário", () => {
    expect(parseCurrentWeather(payload(calm))).toEqual({
      temperatureC: 23.2,
      apparentTemperatureC: 21.4,
      windSpeedKmh: 12,
      isRaining: false,
      observedAt: "2026-10-13T14:00",
    });
  });

  test("sensação ausente vira null", () => {
    const { apparent_temperature: apparentTemperature, ...withoutApparent } = calm;

    expect(apparentTemperature).toBe(21.4);
    expect(
      parseCurrentWeather(payload(withoutApparent)).apparentTemperatureC,
    ).toBeNull();
  });

  test("precipitação acima de zero é chuva", () => {
    expect(
      parseCurrentWeather(
        payload({ ...calm, precipitation: 0.2, weather_code: 0 }),
      ).isRaining,
    ).toBe(true);
  });

  test("chuva em milímetros é chuva mesmo com precipitação zerada", () => {
    expect(
      parseCurrentWeather(payload({ ...calm, rain: 0.1, precipitation: 0 }))
        .isRaining,
    ).toBe(true);
  });

  test.each([51, 61, 80, 95])(
    "weather code %s é chuva mesmo sem milímetros",
    (weatherCode) => {
      expect(
        parseCurrentWeather(
          payload({
            ...calm,
            precipitation: 0,
            rain: 0,
            weather_code: weatherCode,
          }),
        ).isRaining,
      ).toBe(true);
    },
  );

  test("tempo seco não é chuva", () => {
    expect(parseCurrentWeather(payload(calm)).isRaining).toBe(false);
  });

  test("rejeita payload sem o bloco current", () => {
    expect(() => parseCurrentWeather({})).toThrow(/clima/i);
  });

  test("rejeita current sem temperatura", () => {
    const { temperature_2m: temperature, ...withoutTemperature } = calm;

    expect(temperature).toBe(23.2);
    expect(() => parseCurrentWeather(payload(withoutTemperature))).toThrow(
      /temperatura/i,
    );
  });
});
