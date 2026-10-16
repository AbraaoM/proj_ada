import Link from "next/link";
import type { ClothingCheckDto } from "@/dtos/clothing-check.dto";
import type { RecommendationDto } from "@/dtos/recommendation.dto";

export type HomeViewModel = {
  location: string;
  recommendation: RecommendationDto | null;
  weatherMessage: string | null;
  history: ClothingCheckDto[];
  historyMessage: string | null;
  nowIso: string;
};

function formatMeasure(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
  }).format(value);
}

function dayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function previousDay(day: string): string {
  const [year, month, date] = day.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, date));
  utc.setUTCDate(utc.getUTCDate() - 1);
  return utc.toISOString().slice(0, 10);
}

function formatCheckedAt(iso: string, nowIso: string): string {
  const date = new Date(iso);
  const now = new Date(nowIso);
  const today = dayKey(now);
  const key = dayKey(date);
  if (key === today) {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
  if (key === previousDay(today)) return "ontem";
  const [year, month, day] = key.split("-");
  return `${day}/${month}/${year}`;
}

function outfitLine(recommendation: string): string {
  const splitAt = recommendation.indexOf(". ");
  return splitAt === -1 ? recommendation : recommendation.slice(0, splitAt);
}

const actionClass =
  "inline-flex shrink-0 items-center rounded bg-accent px-3 py-2 text-base font-medium text-white transition-colors duration-300 hover:bg-accent-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright";

export function HomeView({ model }: { model: HomeViewModel }) {
  const recommendation = model.recommendation;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-5xl bg-white px-5 py-8 text-black transition-colors duration-300 md:border-x md:border-[#e5e7eb] md:px-12 md:py-14 lg:px-16 lg:py-16 dark:bg-black dark:text-white dark:md:border-gray-800">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-balance font-display text-3xl uppercase leading-none md:text-4xl">
            O que vestir
          </h1>
          <p className="mt-2 text-base text-[#6b7280] dark:text-[#9ca3af]">{model.location}</p>
        </div>
        {recommendation ? (
          <form action="/api/clothing-checks" method="post">
            <button type="submit" className={actionClass}>
              Atualizar
            </button>
          </form>
        ) : (
          <Link href="/" className={actionClass}>
            Tentar de novo
          </Link>
        )}
      </header>

      {model.weatherMessage ? (
        <p className="mt-10 max-w-[65ch] text-pretty text-lg leading-7" role="alert">
          {model.weatherMessage}
        </p>
      ) : null}

      {recommendation ? (
        <section className="mt-12 md:mt-16" aria-label="Agora">
          <p className="max-w-3xl text-balance font-display text-4xl uppercase leading-none sm:text-5xl lg:text-6xl">
            {recommendation.outfit}
          </p>

          <ul className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-2 text-base text-[#6b7280] md:mt-10 md:gap-x-10 md:text-lg dark:text-[#9ca3af]">
            <li className="text-4xl font-semibold text-black tabular-nums dark:text-white">
              {formatMeasure(recommendation.temperatureC)}°
            </li>
            {recommendation.apparentTemperatureC !== null ? (
              <li>sensação {formatMeasure(recommendation.apparentTemperatureC)}°</li>
            ) : null}
            <li>vento {formatMeasure(recommendation.windSpeedKmh)} km/h</li>
            <li>{recommendation.raining ? "está chovendo" : "sem chuva"}</li>
          </ul>

          <p className="mt-8 max-w-[65ch] text-pretty text-base leading-7 md:text-lg md:leading-8">
            {recommendation.reason}
          </p>
        </section>
      ) : null}

      <section className="mt-16 md:mt-24" aria-labelledby="historico-titulo">
        <h2 id="historico-titulo" className="font-display text-2xl uppercase leading-none md:text-3xl">
          Histórico
        </h2>
        {model.historyMessage ? (
          <p className="mt-4 max-w-[65ch] text-pretty text-base text-[#6b7280] dark:text-[#9ca3af]" role="alert">
            {model.historyMessage}
          </p>
        ) : null}
        {model.history.length === 0 && !model.historyMessage ? (
          <p className="mt-4 text-base text-[#6b7280] dark:text-[#9ca3af]">
            Ainda não há consultas salvas.
          </p>
        ) : null}
        {model.history.length > 0 ? (
          <ol className="mt-4">
            {model.history.map((item) => (
              <li
                key={item.id}
                className="-mx-2 grid grid-cols-[6.5rem_4rem_minmax(0,1fr)] items-baseline gap-x-3 border-t border-[#e5e7eb] px-2 py-3 text-base transition-colors duration-300 hover:bg-[#fafafa] md:grid-cols-[7rem_5rem_minmax(0,1fr)] md:gap-x-8 md:py-4 dark:border-gray-800 dark:hover:bg-[#0a0a0a]"
              >
                <span className="tabular-nums text-[#6b7280] dark:text-[#9ca3af]">
                  {formatCheckedAt(item.checkedAt, model.nowIso)}
                </span>
                <span className="tabular-nums text-[#6b7280] dark:text-[#9ca3af]">
                  {formatMeasure(item.temperatureC)}°
                </span>
                <span className="min-w-0 text-pretty">{outfitLine(item.recommendation)}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </section>
    </main>
  );
}
