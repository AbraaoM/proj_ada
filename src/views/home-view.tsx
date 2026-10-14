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
  "inline-flex shrink-0 items-center rounded bg-accent px-3 py-2 text-base font-medium text-foreground hover:bg-[#A1CFF0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function HomeView({ model }: { model: HomeViewModel }) {
  const recommendation = model.recommendation;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-5xl bg-sheet px-5 py-8 md:border-x md:border-line md:px-12 md:py-14 lg:px-16 lg:py-16">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-balance text-2xl font-semibold md:text-3xl">O que vestir</h1>
          <p className="mt-1 text-base text-muted">{model.location}</p>
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
          <p className="max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {recommendation.outfit}
          </p>

          <ul className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-2 text-base text-muted md:mt-10 md:gap-x-10 md:text-lg">
            <li className="text-4xl font-semibold text-foreground tabular-nums">
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
        <h2 id="historico-titulo" className="text-xl font-semibold md:text-2xl">
          Histórico
        </h2>
        {model.historyMessage ? (
          <p className="mt-4 max-w-[65ch] text-pretty text-base text-muted" role="alert">
            {model.historyMessage}
          </p>
        ) : null}
        {model.history.length === 0 && !model.historyMessage ? (
          <p className="mt-4 text-base text-muted">Ainda não há consultas salvas.</p>
        ) : null}
        {model.history.length > 0 ? (
          <ol className="mt-4">
            {model.history.map((item) => (
              <li
                key={item.id}
                className="-mx-2 grid grid-cols-[6.5rem_4rem_minmax(0,1fr)] items-baseline gap-x-3 border-t border-line px-2 py-3 text-base hover:bg-[#E5E5E4] md:grid-cols-[7rem_5rem_minmax(0,1fr)] md:gap-x-8 md:py-4"
              >
                <span className="tabular-nums text-muted">
                  {formatCheckedAt(item.checkedAt, model.nowIso)}
                </span>
                <span className="tabular-nums text-muted">
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
