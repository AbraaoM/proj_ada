import type {
  ClothingInput,
  ClothingRecommendation,
} from "@/models/clothing.model";

const STRONG_WIND_KMH = 30;

type Band = {
  outfit: string;
  reason: (temperature: string) => string;
};

const bands: Array<{ min: number; band: Band }> = [
  {
    min: 26,
    band: {
      outfit: "body",
      reason: (temperature) =>
        `${temperature}°C está em 26°C ou mais, então o indicado é body.`,
    },
  },
  {
    min: 20,
    band: {
      outfit: "body de manga + calça",
      reason: (temperature) =>
        `${temperature}°C está na faixa de 20–25°C, então o indicado é body de manga + calça.`,
    },
  },
  {
    min: 15,
    band: {
      outfit: "body de manga + macacão",
      reason: (temperature) =>
        `${temperature}°C está na faixa de 15–19°C, então o indicado é body de manga + macacão.`,
    },
  },
  {
    min: 10,
    band: {
      outfit: "body de manga + macacão + casaco",
      reason: (temperature) =>
        `${temperature}°C está na faixa de 10–14°C, então o indicado é body de manga + macacão + casaco.`,
    },
  },
];

const coldBand: Band = {
  outfit: "body de manga + macacão + agasalho/casaco grosso",
  reason: (temperature) =>
    `${temperature}°C está abaixo de 10°C, então o indicado é body de manga + macacão + agasalho/casaco grosso.`,
};

function formatMeasure(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
  }).format(value);
}

function bandFor(temperatureC: number): Band {
  const match = bands.find((entry) => temperatureC >= entry.min);
  return match?.band ?? coldBand;
}

function windLayer(outfit: string): "casaco" | "blusa extra" {
  if (outfit.includes("casaco") || outfit.includes("agasalho")) {
    return "blusa extra";
  }
  return "casaco";
}

export function recommend(input: ClothingInput): ClothingRecommendation {
  const band = bandFor(input.temperatureC);
  const pieces = [band.outfit];
  const reasons = [band.reason(formatMeasure(input.temperatureC))];

  if (input.windSpeedKmh >= STRONG_WIND_KMH) {
    const layer = windLayer(band.outfit);
    pieces.push(layer);
    reasons.push(
      `O vento está a ${formatMeasure(input.windSpeedKmh)} km/h (forte a partir de 30 km/h), então entra mais uma camada: ${layer}.`,
    );
  }

  if (input.isRaining) {
    pieces.push("capa/impermeável");
    reasons.push("Está chovendo, então leve capa ou impermeável.");
  }

  return {
    outfit: pieces.join(" + "),
    reason: reasons.join(" "),
  };
}
