import { expect, test } from "@playwright/test";

test("mostra temperatura, roupa e motivo", async ({ page }) => {
  await page.goto("/o-que-vestir");

  await expect(page.getByRole("heading", { name: "O que vestir" })).toBeVisible();
  const now = page.getByRole("region", { name: "Agora" });
  await expect(now.getByText("22°", { exact: true })).toBeVisible();
  await expect(now.getByText("sensação 21°")).toBeVisible();
  await expect(now.getByText("vento 12 km/h")).toBeVisible();
  await expect(now.getByText("sem chuva")).toBeVisible();
  await expect(now.getByText("body de manga + calça", { exact: true })).toBeVisible();
  await expect(now.getByText(/22°C está na faixa de 20–25°C/)).toBeVisible();
  await expect(page.getByRole("region", { name: "Histórico" })).toBeVisible();
});

test("cabe na largura do celular", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/o-que-vestir");
  await expect(page.getByRole("heading", { name: "O que vestir" })).toBeVisible();

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflows).toBe(false);
});

test("GET /api/recommendations devolve só o DTO", async ({ request }) => {
  const response = await request.get("/api/recommendations");
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(Object.keys(body).sort()).toEqual([
    "apparentTemperatureC",
    "location",
    "outfit",
    "raining",
    "reason",
    "temperatureC",
    "windSpeedKmh",
  ]);
  expect(body).toMatchObject({
    temperatureC: 22,
    apparentTemperatureC: 21,
    windSpeedKmh: 12,
    raining: false,
    outfit: "body de manga + calça",
    location: "Pindamonhangaba, SP",
  });
  expect(body.reason).toContain("22°C");
});

test("POST grava e o histórico da página mostra a linha", async ({ page, request }) => {
  const created = await request.post("/api/clothing-checks", {
    headers: { accept: "application/json" },
  });
  expect(created.status()).toBe(201);
  const body = await created.json();
  expect(Object.keys(body).sort()).toEqual([
    "checkedAt",
    "id",
    "location",
    "recommendation",
    "temperatureC",
  ]);
  expect(body.temperatureC).toBe(22);
  expect(body.location).toBe("Pindamonhangaba, SP");
  expect(body.recommendation).toContain("body de manga + calça");
  expect(body.recommendation).toContain("22°C");

  await page.goto("/o-que-vestir");
  const history = page.getByRole("region", { name: "Histórico" });
  await expect(history.getByText(/body de manga \+ calça/).first()).toBeVisible();

  const before = await history.getByRole("listitem").count();
  await page.getByRole("button", { name: "Atualizar" }).click();
  await expect(page).toHaveURL(/\/o-que-vestir\/?$/);
  await expect(history.getByRole("listitem")).toHaveCount(before + 1);
});
