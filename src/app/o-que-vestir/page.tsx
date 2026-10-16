import type { Metadata } from "next";
import { connection } from "next/server";
import { index } from "@/controllers/home.controller";
import { HomeView } from "@/views/home-view";

export const metadata: Metadata = {
  title: "O que vestir",
  description: "Clima agora em Pindamonhangaba e a roupa para a criança.",
};

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
