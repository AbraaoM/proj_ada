export type ClothingInput = {
  temperatureC: number;
  windSpeedKmh: number;
  isRaining: boolean;
};

export type ClothingRecommendation = {
  outfit: string;
  reason: string;
};
