import { defineConfig, devices } from "@playwright/test";

function serverEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) env[key] = value;
  }
  env.OPEN_METEO_BASE_URL = "http://127.0.0.1:4010";
  return env;
}

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:3000",
    ...devices["Desktop Chrome"],
  },
  webServer: [
    {
      command: "node tests/e2e/weather-mock.mjs",
      port: 4010,
      reuseExistingServer: true,
    },
    {
      command: "npm run dev -- --port 3000",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: false,
      timeout: 120000,
      env: serverEnv(),
    },
  ],
});
