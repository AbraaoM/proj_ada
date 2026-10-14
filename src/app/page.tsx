import { connection } from "next/server";
import { index } from "@/controllers/home.controller";
import { HomeView } from "@/views/home-view";

// Clima ao vivo: esta rota não pode ser pré-renderizada.
export const instant = false;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const model = await index(await searchParams, new Date());
  return <HomeView model={model} />;
}
