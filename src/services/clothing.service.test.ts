import { describe, expect, test } from "vitest";
import { recommend } from "./clothing.service";

const calm = { windSpeedKmh: 10, isRaining: false };

describe("recommend", () => {
  test.each([
    [26, "body"],
    [25.9, "body de manga + calça"],
    [20, "body de manga + calça"],
    [19.9, "body de manga + macacão"],
    [15, "body de manga + macacão"],
    [14.9, "body de manga + macacão + casaco"],
    [10, "body de manga + macacão + casaco"],
    [9.9, "body de manga + macacão + agasalho/casaco grosso"],
    [0, "body de manga + macacão + agasalho/casaco grosso"],
  ])("a %s°C sem vento forte indica %s", (temperatureC, outfit) => {
    expect(recommend({ temperatureC, ...calm }).outfit).toBe(outfit);
  });

  test("vento de 29,9 km/h não acrescenta camada", () => {
    const result = recommend({
      temperatureC: 26,
      windSpeedKmh: 29.9,
      isRaining: false,
    });

    expect(result.outfit).toBe("body");
    expect(result.reason).not.toMatch(/vento/i);
  });

  test("vento a partir de 30 km/h acrescenta casaco quando ainda não há camada de fora", () => {
    expect(
      recommend({ temperatureC: 26, windSpeedKmh: 30, isRaining: false }).outfit,
    ).toBe("body + casaco");
    expect(
      recommend({ temperatureC: 22, windSpeedKmh: 40, isRaining: false }).outfit,
    ).toBe("body de manga + calça + casaco");
    expect(
      recommend({ temperatureC: 16, windSpeedKmh: 40, isRaining: false }).outfit,
    ).toBe("body de manga + macacão + casaco");
  });

  test("vento forte acrescenta blusa extra quando já há casaco ou agasalho", () => {
    expect(
      recommend({ temperatureC: 12, windSpeedKmh: 40, isRaining: false }).outfit,
    ).toBe("body de manga + macacão + casaco + blusa extra");
    expect(
      recommend({ temperatureC: 5, windSpeedKmh: 40, isRaining: false }).outfit,
    ).toBe("body de manga + macacão + agasalho/casaco grosso + blusa extra");
  });

  test("chuva acrescenta capa sem tirar a roupa", () => {
    expect(
      recommend({ temperatureC: 22, windSpeedKmh: 10, isRaining: true }).outfit,
    ).toBe("body de manga + calça + capa/impermeável");
    expect(
      recommend({ temperatureC: 22, windSpeedKmh: 35, isRaining: true }).outfit,
    ).toBe("body de manga + calça + casaco + capa/impermeável");
    expect(
      recommend({ temperatureC: 8, windSpeedKmh: 40, isRaining: true }).outfit,
    ).toBe(
      "body de manga + macacão + agasalho/casaco grosso + blusa extra + capa/impermeável",
    );
  });

  test("o motivo inclui a temperatura e a faixa", () => {
    const hot = recommend({ temperatureC: 26, ...calm });
    expect(hot.reason).toContain("26°C");
    expect(hot.reason).toContain("26°C ou mais");
    expect(hot.reason).toContain("body");

    const warm = recommend({ temperatureC: 25.9, ...calm });
    expect(warm.reason).toContain("25,9°C");
    expect(warm.reason).toContain("20–25°C");
    expect(warm.reason).toContain("body de manga + calça");

    const mild = recommend({ temperatureC: 15, ...calm });
    expect(mild.reason).toContain("15°C");
    expect(mild.reason).toContain("15–19°C");

    const cool = recommend({ temperatureC: 10, ...calm });
    expect(cool.reason).toContain("10°C");
    expect(cool.reason).toContain("10–14°C");

    const cold = recommend({ temperatureC: 9.9, ...calm });
    expect(cold.reason).toContain("9,9°C");
    expect(cold.reason).toContain("abaixo de 10°C");
  });

  test("o motivo explica vento forte e chuva", () => {
    const result = recommend({
      temperatureC: 22,
      windSpeedKmh: 34,
      isRaining: true,
    });

    expect(result.reason).toContain("22°C");
    expect(result.reason).toContain("34 km/h");
    expect(result.reason).toContain("30 km/h");
    expect(result.reason).toContain("casaco");
    expect(result.reason).toContain("chovendo");
    expect(result.reason).toContain("capa ou impermeável");
  });

  test("o motivo da blusa extra nomeia essa camada", () => {
    const result = recommend({
      temperatureC: 12,
      windSpeedKmh: 30,
      isRaining: false,
    });

    expect(result.outfit).toContain("blusa extra");
    expect(result.reason).toContain("blusa extra");
  });
});
