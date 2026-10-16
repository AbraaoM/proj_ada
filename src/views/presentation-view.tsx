import Link from "next/link";

const tools = [
  {
    href: "/o-que-vestir",
    name: "O que vestir",
    description: "A roupa do dia, pelo clima de Pindamonhangaba.",
  },
];

const openClass =
  "inline-flex items-center justify-center rounded-lg bg-[#7c3aed] px-4 py-2 text-base font-medium text-white transition-colors duration-300 hover:bg-[#8b5cf6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]";

export function PresentationView() {
  return (
    <main className="min-h-dvh bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 md:px-12 md:py-20">
        <header className="max-w-xl">
          <h1 className="font-display text-6xl leading-none sm:text-7xl">Ada</h1>
          <p className="mt-4 text-lg text-[#6b7280] dark:text-[#9ca3af]">Para o dia a dia com ela.</p>
        </header>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li
            key={tool.href}
            className="flex flex-col border border-[#e5e7eb] p-6 transition-colors duration-300 hover:bg-[#fafafa] dark:border-gray-800 dark:hover:bg-[#0a0a0a]"
          >
            <h2 className="font-display text-3xl leading-none">{tool.name}</h2>
            <p className="mt-3 flex-1 text-base text-[#6b7280] dark:text-[#9ca3af]">{tool.description}</p>
            <Link href={tool.href} className={`${openClass} mt-8 self-start`}>
              Abrir
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </main>
  );
}
